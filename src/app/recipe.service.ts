import { Injectable } from '@angular/core';
import { Formula, IngredientsService, IngredientStats, Trait, TRAITS } from './ingredients.service';
import { RankRepo, PotionRank } from './potion-rank.repo';
import RecipeOptimizer, { OptimalityCriteria } from './recipe-optimizer';


export enum Senses {
  None,
  Taste,
  Touch,
  Smell,
  Sight,
  Sound
}

export enum RecipeSort {
  Value,
  Ratio,
  Profit
}

interface Recipe extends Omit<IngredientStats, 'Location' | 'Rarity' | 'Type'> {
  ingredients: string[];
  rank: PotionRank;
  value: number;
  deviation: number;
}

/** Contains everything from settings to the main combination methods and all related members. */
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private percA = 50 / 100;
  private percB = 50 / 100;
  private percC = 0 / 100;
  private percD = 0 / 100;
  private percE = 0 / 100;
  private topDeviate = 0 + 0.0025; // Perfect: 0 Very: 0.05 Stable: 0.15 Unstable 0.25 | allowance 0.25%
  private tempAvail: Record<string, number> = {}; // Holds the available ingredients for the working recipe.
  private rankRepo = new RankRepo;
  private recipeList: Recipe[] = [];
  private heuristicsList: Recipe[] = [];
  private heuristicsComplete = false;

  selectedQuality = "Perfect";
  qualities: Record<string, number> = {
    "Perfect": 0,
    "Very Stable": 0.05,
    "Stable": 0.15,
    "Unstable": 0.25,
  };
  selectedSort = "Profit";
  recipeSorts: Record<string, number> = {
    "Value": RecipeSort.Value,
    "Ratio": RecipeSort.Ratio,
    "Profit": RecipeSort.Profit,
  };
  recipeListDisplay: Recipe[] = []; // Used to display 1000 results on frontend.
  ingredientList: string[] = []; // Used for display style changes
  traits = [false, false, false, false, false]; // For display and selection
  illusion = 0; // For display and selection
  selectedFormula = 0;
  maxMagamin = 375;
  ingredCount = 9;
  ingredientSelection = 9;
  shopBonus = 0;

  statusMessage = "I'm empty, fill me!"; // @TODO implement status of heuristics "Running popularity Heuristics " or "4x" etc

  constructor(
    public ingredientsService: IngredientsService,
  ) {
    /*mainLoopService.tickSubject.subscribe(() => {
      this.discoverInit(); // Entry point
    });*/
  }

  startOptimization() {
    let criterria: OptimalityCriteria;
    switch (this.selectedSort) {
      case "Value":
        criterria = OptimalityCriteria.MAXIMIZE_VALUE;
        break;
      case "Profit":
        criterria = OptimalityCriteria.MAXIMIZE_PROFIT;
        break;
      default:
        criterria = OptimalityCriteria.MAXIMIZE_VALUE;
    }
    const maxRank = this.rankRepo.getRank(this.maxMagamin);
    const optimizers: RecipeOptimizer[] = [];
    for (const rank of this.rankRepo.ranks) {
      optimizers.push(new RecipeOptimizer(
        rank,
        criterria,
        this.ingredientsService,
        this.ingredientsService.formulas[this.selectedFormula].type,
        this.shopBonus,
        this.ingredientSelection,
      ));
      if (rank === maxRank) {
        break;
      }
    }
    const formula = this.ingredientsService.formulas[this.selectedFormula];
    const firstStep = Promise.all(optimizers.map(optimizer => this.optimize(optimizer, formula)));
    firstStep.then(results => this.continueOptimization(optimizers, results, formula)).catch(console.error);
  }

  private async continueOptimization(optimizers: RecipeOptimizer[], results: ({ recipe: Recipe, objective: number } | null)[], formula: Formula) {
    const maxRecipes = optimizers.length + 100;
    while (this.recipeListDisplay.length < maxRecipes) {
      let bestIndex = null;
      for (let i = 0; i < results.length; i++) {
        if (results[i] !== null) {
          if (bestIndex == null || (results[bestIndex]?.objective ?? 0) < (results[i]?.objective ?? 0)) {
            bestIndex = i;
          }
        }
      }
      if (bestIndex == null) break;
      results[bestIndex] = await this.optimize(optimizers[bestIndex], formula);
    }
  }

  private async optimize(optimizer: RecipeOptimizer, formula: Formula): Promise<{ recipe: Recipe, objective: number } | null> {
    const result = await optimizer.optimizeRecipe();
    if (result === 'Infeasible') {
      return null;
    } else {
      optimizer.blackListRecipe(result.recipe);
      const recipe = this.recipeFromOptimizerResult(result.recipe, formula);
      this.recipeListDisplay.push(recipe);
      this.recipeSort(this.recipeListDisplay);
      this.recipeListDisplay = this.recipeListDisplay.slice(0, 100);
      return {
        recipe,
        objective: result.objective,
      };
    }
  }

  private recipeFromOptimizerResult(result: Record<string, number>, formula: Formula): Recipe {
    const ingredients: string[] = Object.keys(result).flatMap(key => {
      const count = result[key];
      return count > 0 ? Array(count).fill(key) : [];
    });
    const negativeTraits: Record<string, boolean> = {};
    const positiveTraits: Record<string, boolean> = {};
    ingredients.forEach(ingredient => {
      const stats = this.ingredientsService.ingredients[ingredient];
      for (const trait of TRAITS) {
        if (stats[trait] < 0) {
          negativeTraits[trait] = true;
        } else if (stats[trait] > 0) {
          positiveTraits[trait] = true;
        }
      }
    });
    const traits: Record<string, number> = {};
    for (const trait of TRAITS) {
      let result = 0;
      if (negativeTraits[trait]) {
        result -= 5;
      }
      if (positiveTraits[trait]) {
        result += 5;
      }
      traits[trait] = result;
    }
    const sum = (key: keyof IngredientsService['ingredients']['key']) => ingredients.reduce((acc, ingredient) => acc + (this.ingredientsService.ingredients[ingredient][key] as number), 0);
    const Total = sum('Total');
    const recipe: Recipe = {
      ingredients,
      A: sum('A'),
      B: sum('B'),
      C: sum('C'),
      D: sum('D'),
      E: sum('E'),
      ...(traits as Record<Trait, number>),
      Total,
      cost: sum('cost'),
      deviation: 0,
      rank: this.rankRepo.ranks[0],
      value: 0,
    };
    this.recipeRank(recipe);

    return recipe;
  }

  /** Updates the formula and the viable ingredients, resets the counts, recipe list, and heuristics boolean, then sets up the indexer in heuristics mode */
  reset() {
    this.recipeList = [];
  }


  /** Sorts the results of the sim prior to display according to selection saved in selectedSort member 
   * @TODO make the recipe sorting more efficient, individual insertions and pre-sorted categorical subsets
  */
  recipeSort(list = this.recipeList) {
    switch (this.selectedSort) {
      case "Value":
        list.sort((b, a) => a.value - b.value);
        break;
      case "Ratio":
        list.sort((b, a) => (a.value * this.potionCount() - a.cost) / a.cost - (b.value * this.potionCount() - b.cost) / b.cost);
        break;
      case "Profit":
        list.sort((b, a) => (a.value * this.potionCount() - a.cost) - (b.value * this.potionCount() - b.cost));
        break;
    }
  }

  /** Displays the recipes from index start to start + length - 1.
   * @param size The length of the display, default 1000
   * @param start The starting index, default 0
   */
  recipeDisplay(length = 100, start = 0) {
    this.recipeListDisplay.push(...this.recipeList.slice()); // Pushes the next 1000 recipes to the display list.
    this.recipeListDisplay = this.recipeList.slice(start, length);
    this.recipeList.splice
  }

  /** Updates the recipe rank and value by comparing the rank repo with the total magamin count.
   * @param recipe The recipe in need of a rank and value update
   */
  recipeRank(recipe: Recipe) {
    const formula = this.ingredientsService.formulas[this.selectedFormula];
    const ranks = this.rankRepo.ranks;
    for (let i = 0; i <= this.rankRepo.ranks.length - 1; i++) {
      if (ranks[i].min <= recipe.Total && recipe.Total < ranks[i].max) {
        const bonus = this.shopBonus + recipe.Smell + recipe.Sight + recipe.Sound + recipe.Taste + recipe.Touch;
        let extra;
        if (recipe.deviation <= 0.0025) {
          extra = 2;
        }
        else if (recipe.deviation <= 0.05) {
          extra = 1;
        }
        else if (recipe.deviation <= 0.15) {
          extra = 0;
        }
        else {
          extra = -1;
        }
        recipe.rank = ranks[Math.min(i + extra, ranks.length - 1)];
        recipe.value = Math.round(recipe.rank.mult * formula.value * (bonus / 100 + 1));
        break;
      }
    }
  }

  /** A macro method to remember potions multiply based on ingredient count */
  potionCount() {
    return Math.floor(this.ingredCount / 2);
  }

}
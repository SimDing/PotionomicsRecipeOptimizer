import { Injectable } from '@angular/core';
import { IngredientsService, IngredientStats } from './ingredients.service';
import { MainLoopService } from './main-loop.service';
import { RankRepo, PotionRank } from './potion-rank.repo';


export enum Senses {
  None,
  Taste,
  Touch,
  Smell,
  Sight,
  Sound
}

export enum RecipeSort {
  Cost,
  Rank,
  Value,
  Ratio,
  Profit
}

interface Recipe extends IngredientStats {
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
  private slotIndex = 0; // only locally used for the recursive method. I can't be completely sure of my work.
  private rankRepo = new RankRepo;
  private recipeList: Recipe[] = [];

  selectedQuality = "Perfect";
  qualities: Record<string, number> = {
    "Perfect": 0,
    "Very Stable": 0.05,
    "Stable": 0.15,
    "Unstable": 0.25,
  };
  selectedSort = "Profit";
  recipeSorts: Record<string, number> = {
    "Cost": RecipeSort.Cost,
    "Rank": RecipeSort.Rank,
    "Value": RecipeSort.Value,
    "Ratio": RecipeSort.Ratio,
    "Profit": RecipeSort.Profit,
  };
  recipeListDisplay: Recipe[] = []; // Used to display 1000 results on frontend.
  ingredientList: string[] = []; // Used for display style changes
  indexer: number[] = []; // Used in display
  totalCount = 0; // For display
  hitCount = 0; // For display
  traits = [false, false, false, false, false]; // For display and selection
  illusion = 0; // For display and selection
  selectedFormula = 0;
  maxMagamin = 375;
  ingredCount = 8;
  ingredSelection = 8;
  shopBonus = 0;

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
  ) {
    mainLoopService.tickSubject.subscribe(() => {
      this.discoverInit(); // Entry point
    });
  }


  // INIT

  /** Initializes a recipe search loop. */
  discoverInit() {
    this.tempAvail = { ...this.ingredientsService.ingredientAvailability }
    this.discoverNewRecipe(this.initRecipe());
  }

  /** Initializes the working index of the search algorithms. */
  indexerInit() {
    this.indexer = [];
    for (let i = 0; i < this.ingredCount; i++) {
      this.indexer.push(this.ingredientList.length - 1);
    }
  }

  /** Initializes the search list. */
  searchInit() {
    this.recipeList = [];
    this.totalCount = 0;
    this.hitCount = 0;
    this.slotIndex = 0;
  }


  // UTILITY

  /** Updates the formula ratios. */
  updateFormula() {
    this.percA = this.ingredientsService.formulas[this.selectedFormula].A;
    this.percB = this.ingredientsService.formulas[this.selectedFormula].B;
    this.percC = this.ingredientsService.formulas[this.selectedFormula].C;
    this.percD = this.ingredientsService.formulas[this.selectedFormula].D;
    this.percE = this.ingredientsService.formulas[this.selectedFormula].E;
    this.topDeviate = this.qualities[this.selectedQuality] + 0.0025;
    this.buildIngredients();
    this.searchInit();
  }

  /** Sorts the results of the sim prior to display according to selection saved in selectedSort member */
  recipeSort() {
    switch (this.selectedSort) {
      case "Cost":
        this.recipeList.sort((b, a) => a.cost - b.cost);
        break;
      case "Rank":
        this.recipeList.sort((b, a) => a.rank.mult - b.rank.mult);
        break;
      case "Value":
        this.recipeList.sort((b, a) => a.value - b.value);
        break;
      case "Ratio":
        this.recipeList.sort((b, a) => (a.value * this.potionCount() - a.cost) / a.cost - (b.value * this.potionCount() - b.cost) / b.cost);
        break;
      case "Profit":
        this.recipeList.sort((b, a) => (a.value * this.potionCount() - a.cost) - (b.value * this.potionCount() - b.cost));
        break;
    }
  }

  /** Displays the recipes from index start to start + length.
   * @param size The length of the display, default 1000
   * @param start The starting index, default 0
   */
  recipeDisplay(length = 1000, start = 0) {
    this.recipeListDisplay = this.recipeList.slice(start, length);
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


  // MAIN FLOW

  /** Macro method to create a new blank recipe */
  initRecipe(): Recipe {
    return {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      cost: 0,
      Total: 0,
      Taste: 0,
      Touch: 0,
      Smell: 0,
      Sight: 0,
      Sound: 0,
      Rarity: "",
      Location: "",
      Type: "",
      ingredients: [],
      rank: this.rankRepo.ranks[0],
      value: 0,
      deviation: 0,
    }
  }

  /** Builds the viable ingredients list for the active recipe.  
   * @param arr the list of ingredients to consider. defaults to ingredients stored in ingredients service
  */
  buildIngredients() {
    let deviation = 0; // Init the deviation variable
    this.ingredientList = [...this.ingredientsService.ingredientNames]; // Shallow copy the names array 
    let i = this.ingredientList.length;
    const validA = this.percA > 0;
    const validB = this.percB > 0;
    const validC = this.percC > 0;
    const validD = this.percD > 0;
    const validE = this.percE > 0;

    // Sort and Filter out unwanted materials
    this.ingredientList.sort((a, b) => this.ingredientsService.ingredients[a].Total - this.ingredientsService.ingredients[b].Total);
    while (i > 0) {
      i--;
      const ingredient = this.ingredientsService.ingredients[this.ingredientList[i]]
      deviation = // Measure if an ingredient goes over the maximum viable for the target
        Math.max((ingredient.A / this.maxMagamin) - this.percA, 0) +
        Math.max((ingredient.B / this.maxMagamin) - this.percB, 0) +
        Math.max((ingredient.C / this.maxMagamin) - this.percC, 0) +
        Math.max((ingredient.D / this.maxMagamin) - this.percD, 0) +
        Math.max((ingredient.E / this.maxMagamin) - this.percE, 0);

      if (deviation > this.topDeviate || // Remove ingredients that don't match filters and deviate too far.
        this.ingredientsService.ingredientAvailability[this.ingredientList[i]] == 0 || // and are empty
        (ingredient.Taste < 0 && this.traits[Senses.Taste]) ||
        (ingredient.Touch < 0 && this.traits[Senses.Touch]) ||
        (ingredient.Smell < 0 && this.traits[Senses.Smell]) ||
        (ingredient.Sight < 0 && this.traits[Senses.Sight]) ||
        (ingredient.Sound < 0 && this.traits[Senses.Sound]) ||
        !(((ingredient.A > 0) == validA && validA) || // This section checks to see if the ingredient has anything of value to add.  
          ((ingredient.B > 0) == validB && validB) || // No point adding an ingredient that is below deviation but has no value.
          ((ingredient.C > 0) == validC && validC) ||
          ((ingredient.D > 0) == validD && validD) ||
          ((ingredient.E > 0) == validE && validE))
      ) {
        this.ingredientList.splice(i, 1); // Cut the fat.
      }
    }
    this.indexerInit(); // Initialize the index based on this new ingredient list.
  }

  /** Controls the flow of the recipe search */
  discoverNewRecipe(recipe: Recipe | undefined) {
    if (recipe === undefined) {
      return;
    }

    // Combine a new ingredient into the recipe
    recipe = this.addIngredient(recipe);

    // @TODO need to improve architecture and detach indices.
    // Check if the current ingredient slot returned nothing
    if (recipe === undefined) {
      if (this.slotIndex <= 0) { // If the first slot returns nothing then we're done.
        this.mainLoopService.started = false;
        this.recipeSort();
        this.recipeDisplay();
        return;
      }
      this.indexer[this.slotIndex - 1]--; // reduce the index of this slot and fill the indices of later slots.
      for (let j = this.slotIndex; j < this.ingredCount; j++) {
        this.indexer[j] = this.indexer[this.slotIndex - 1];
      }
      // Cleaned out a slot, return to top.
      this.slotIndex = 0;
      return;
    }

    // Check if we've reached the final slot
    if (this.slotIndex < this.ingredCount - 1) {
      // @TODO improve recursion with local indices and remove global member.
      // Recursively move to the next slot. Good for dynamic depth.
      this.slotIndex++;
      this.discoverNewRecipe(recipe);
    } else {
      this.indexer[this.slotIndex]--;
      this.finalizeRecipe(recipe);
    }
    // If we're here then we're coming up for air to check frame time and for a new round.
    this.slotIndex = 0;
  }

  /** Adds an ingredient to the recipe */
  addIngredient(recipe: Recipe): Recipe | undefined {
    const pos = this.indexer[this.slotIndex]
    const result = this.findIngredient(recipe, pos);
    this.indexer[this.slotIndex] = result.pos;
    if (result.deviation === undefined || result.pos < 0) {
      return;
    }

    const ingredientName = this.ingredientList[result.pos];
    const ingredient = this.ingredientsService.ingredients[ingredientName]
    
    recipe.ingredients[this.slotIndex] = ingredientName;
    recipe.A += ingredient.A;
    recipe.B += ingredient.B;
    recipe.C += ingredient.C;
    recipe.D += ingredient.D;
    recipe.E += ingredient.E;
    recipe.Total += ingredient.Total;
    recipe.cost += ingredient.cost;
    recipe.Taste = ingredient.Taste < 0 || recipe.Taste < 0 ? -5 : ingredient.Taste > 0 ? 5 : recipe.Taste;
    recipe.Touch = ingredient.Touch < 0 || recipe.Touch < 0 ? -5 : ingredient.Touch > 0 ? 5 : recipe.Touch;
    recipe.Smell = ingredient.Smell < 0 || recipe.Smell < 0 ? -5 : ingredient.Smell > 0 ? 5 : recipe.Smell;
    recipe.Sight = ingredient.Sight < 0 || recipe.Sight < 0 ? -5 : ingredient.Sight > 0 ? 5 : recipe.Sight;
    recipe.Sound = ingredient.Sound < 0 || recipe.Sound < 0 ? -5 : ingredient.Sound > 0 ? 5 : recipe.Sound;
    recipe.deviation = result.deviation;
    this.tempAvail[ingredientName]--;

    return recipe;
  }

  /** Joins ingredients to form a recipe.
   * @returns object with deviation and pos (index) of the ingredient, or undefined and -1 if none fit.
   * @param recipe the empty or partially built recipe needing a new ingredient.
   * @param pos the current position of the slot currently being worked, moves in reverse.
   * @TODO create params for one time or short use recursion variables.
   * @TODO allow for division heuristics
   * @TODO allow for required ingredient (something like an Avail reduction and starter recipe and higher slotIndex before calling discover. Watch out for the indexer sweeper tho)
  */
  findIngredient(recipe: Recipe, pos: number): { deviation: number | undefined; pos: number; } {
    let deviation; // Going to need to check for recipe deviation.

    while (pos >= 0) { // While the ingredients at this slot are available, keep looking through them for a viable one.
      
      if (!(this.tempAvail[this.ingredientList[pos]] > 0)) { // Ignore ingredients that have no availability count left
        pos--;
        continue;
      }
      const ingredient = this.ingredientsService.ingredients[this.ingredientList[pos]];
      const A = ingredient.A;
      const B = ingredient.B;
      const C = ingredient.C;
      const D = ingredient.D;
      const E = ingredient.E;
      const Total = ingredient.Total;

      // If the final ingredient is added, change from max magamin to the totals in the recipe and get updated ratios.
      if (this.slotIndex < this.ingredCount - 1) {
        deviation =
          Math.max(((recipe.A + A) / this.maxMagamin) - this.percA, 0) +
          Math.max(((recipe.B + B) / this.maxMagamin) - this.percB, 0) +
          Math.max(((recipe.C + C) / this.maxMagamin) - this.percC, 0) +
          Math.max(((recipe.D + D) / this.maxMagamin) - this.percD, 0) +
          Math.max(((recipe.E + E) / this.maxMagamin) - this.percE, 0);
      } else {
        if (
          (this.traits[Senses.Taste] && recipe.Taste < 5 && ingredient.Taste < 5) ||
          (this.traits[Senses.Touch] && recipe.Touch < 5 && ingredient.Touch < 5) ||
          (this.traits[Senses.Smell] && recipe.Smell < 5 && ingredient.Smell < 5) ||
          (this.traits[Senses.Sight] && recipe.Sight < 5 && ingredient.Sight < 5) ||
          (this.traits[Senses.Sound] && recipe.Sound < 5 && ingredient.Sound < 5)
        ) {
          this.totalCount++;
          pos--;
          continue;
        }
        deviation =
          Math.max(((recipe.A + A) / (recipe.Total + Total)) - this.percA, 0) +
          Math.max(((recipe.B + B) / (recipe.Total + Total)) - this.percB, 0) +
          Math.max(((recipe.C + C) / (recipe.Total + Total)) - this.percC, 0) +
          Math.max(((recipe.D + D) / (recipe.Total + Total)) - this.percD, 0) +
          Math.max(((recipe.E + E) / (recipe.Total + Total)) - this.percE, 0);
        this.totalCount++;
      }

      // Skip deviant ingredients and ingredients that go over magamin count. The lowest total magamin is 4 
      // so this will also remove earlier ingredients that go over by assuming all the later ingredients total 4.
      if (deviation > this.topDeviate ||
        ((this.ingredCount - 1 - this.slotIndex) * 4 + recipe.Total + ingredient.Total > this.maxMagamin)
      ) {
        pos--;
      } else {
        break;
      }
    }

    return { deviation, pos };
  }

  /** Finalizes a valid recipe by applying illusion, ranking, and pushing to the recipe list.
   * @param recipe the complete recipe of the slot currently being worked.
  */
  finalizeRecipe(recipe: Recipe) {
    switch (this.illusion) {
      case Senses.None:
        break;
      case Senses.Taste:
        recipe.Taste = 5;
        break;
      case Senses.Touch:
        recipe.Touch = 5;
        break;
      case Senses.Smell:
        recipe.Smell = 5;
        break;
      case Senses.Sight:
        recipe.Sight = 5;
        break;
      case Senses.Sound:
        recipe.Sound = 5;
        break;
    }

    // increase the good recipe counter when finding one, and Rank/price the recipe.
    this.totalCount++;
    this.hitCount++;
    this.recipeRank(recipe);
    this.recipeList.push(recipe)

  }

}
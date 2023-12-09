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
  indexer: number[] = []; // Used in display and tracking
  heuristicIndexer: { index: number, size: number }[] = []; // Used in display and tracking
  totalCount = 0; // For display
  hitCount = 0; // For display
  traits = [false, false, false, false, false]; // For display and selection
  illusion = 0; // For display and selection
  selectedFormula = 0;
  maxMagamin = 375;
  ingredCount = 9;
  ingredSelection = 9;
  shopBonus = 0;
  heuristicsDefault = false;
  heuristicSize = 3;
  mustHaveArray: string[] = []

  statusMessage = "I'm empty, fill me!"; // @TODO implement status of heuristics "Running popularity Heuristics " or "4x" etc

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
    this.heuristicsComplete ? this.discoverNewRecipe(this.initRecipe()) : this.heuristicFlow(this.initRecipe()); // Entry point
  }

  /** Updates the formula ratios and rebuilds the viable ingredients list*/
  updateFormula() {
    this.percA = this.ingredientsService.formulas[this.selectedFormula].A;
    this.percB = this.ingredientsService.formulas[this.selectedFormula].B;
    this.percC = this.ingredientsService.formulas[this.selectedFormula].C;
    this.percD = this.ingredientsService.formulas[this.selectedFormula].D;
    this.percE = this.ingredientsService.formulas[this.selectedFormula].E;
    this.topDeviate = this.qualities[this.selectedQuality] + 0.0025;
    this.buildIngredients();
  }

  /** Builds the viable ingredients list for the active recipe. */
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

  /** Initializes the working index of the search algorithms. 
   * @param indexerLength The number of slots to index, default ingredSelection - mustHaveArray.length
  */
  indexerInit(indexerLength = this.ingredSelection - this.mustHaveArray.length) {
    this.indexer = [];
    this.heuristicIndexer = [];
    for (let i = 0; i < indexerLength; i++) {
      this.indexer.push(this.ingredientList.length - 1);
    }
    for (let i = 0; i < this.heuristicSize; i++) {
      const sizeadd = i < (this.ingredSelection - this.mustHaveArray.length) % 3 ? 1 : 0;
      this.heuristicIndexer.push({ index: this.ingredientList.length - 1, size: this.heuristicCount() + sizeadd });
    }
  }

  /** Initializes the search list. */
  searchInit() {
    this.heuristicsComplete = this.heuristicsDefault;
    this.recipeList = [];
    this.totalCount = 0;
    this.hitCount = 0;
  }

  /** Updates the formula and the viable ingredients, resets the counts, recipe list, and heuristics boolean, then sets up the indexer in heuristics mode */
  reset() {
    this.updateFormula();
    this.searchInit();
  }


  // UTILITY

  /** Updates teh must have ingredients array */
  updateMustHaves() {
    this.mustHaveArray = []
    this.ingredientsService.ingredientNames.forEach(element => {
      for (let i = 0; i < this.ingredientsService.ingredientMustHaves[element]; i++) {
        this.mustHaveArray.push(element)
      }
    });
  }

  /** Sorts the results of the sim prior to display according to selection saved in selectedSort member 
   * @TODO make the recipe sorting more efficient, individual insertions and pre-sorted categorical subsets
  */
  recipeSort() {
    switch (this.selectedSort) {
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

  /** Displays the recipes from index start to start + length - 1.
   * @param size The length of the display, default 1000
   * @param start The starting index, default 0
   */
  recipeDisplay(length = 100, start = 0) {
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

  /** Macro method to create a new blank recipe */
  initRecipe(): Recipe {
    const recipe = {
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
    this.mustHaveArray.forEach(element => {
      this.addIngredient(recipe, element)
    });
    return recipe;
  }

  /** A macro method to remember potions multiply based on ingredient count */
  potionCount() {
    return Math.floor(this.ingredCount / 2);
  }

  /** A macro method to return ingredient count for heuristics if they're not complete */
  heuristicCount() {
    return this.heuristicsComplete ? 1 : Math.floor((this.ingredSelection - this.mustHaveArray.length) / 3);
  }


  // HEURISTICS FLOW

  /** Controls the flow of the heuristic search 
   * @todo handle stuff smaller than heuristics
  */
  heuristicFlow(recipe: Recipe) {
    let slot = 0;
    while (slot < this.heuristicSize) {

      // Combine a new ingredient into the recipe
      recipe = this.updateHeuristicRecipe(recipe, slot);

      // Check if the current ingredient slot returned nothing
      if (recipe.deviation === 99) {
        slot--
        if (this.heuristicIndexer[0].index < 0) { // If the first slot returns nothing then we're done.
          this.sortByHeuristics();
          this.heuristicsComplete = true;

          return;
        }
        this.heuristicIndexer[slot].index--; // reduce the index of this slot and fill the indices of later slots.
        for (let j = slot + 1; j < this.heuristicIndexer.length; j++) {
          this.heuristicIndexer[j].index = this.heuristicIndexer[slot].index;
        }
        // Cleaned out a slot, return to top. 
        return;
      }
      slot++;
    }

    // If we're here then we're coming up for air to check frame time and for a new round.
    this.heuristicIndexer[slot - 1].index--;
    this.finalizeRecipe(recipe);

  }

  /** Manages heuristic recipe change flow 
     * @param recipe The recipe that requires more ingredients.
     * @TODO incorporate heuristics
    */
  updateHeuristicRecipe(recipe: Recipe, slot: number): Recipe {
    const pos = this.heuristicIndexer[slot].index
    const result = this.findIngredient(recipe, pos, this.heuristicIndexer[slot].size);
    this.heuristicIndexer[slot].index = result.pos;
    recipe.deviation = result.finalDeviation;
    if (result.pos < 0) {
      return recipe;
    }
    const ingredientName = this.ingredientList[result.pos];
    for (let i = 0; i < this.heuristicIndexer[slot].size; i++) {
      this.addIngredient(recipe, ingredientName);
    }
    return recipe; // recipe.ingredients.length == slotIndex prior to this.
  }

  /** Updates the sorting based on heuristic model crossed with the sorting selected by the user and the results of the initial heuristics. */
  sortByHeuristics() {
    // Create a copy of the viable ingredients name array as an object that accepts weighted values
    const sortedIngredients: { [key: string]: number } = {}
    this.ingredientList.forEach(ingredient => {
      sortedIngredients[ingredient] = 0;
    })

    // Weight the recipe ingredients by value according to the user selected recipe sort
    let callback = ((a: Recipe) => { return a.value })
    switch (this.selectedSort) {
      case "Ratio":
        callback = ((a) => { return (a.value * this.potionCount() - a.cost) / a.cost });
        break;
      case "Profit":
        callback = ((a) => { return (a.value * this.potionCount() - a.cost) });
        break;
    }

    // Create a recipe array with just ingredients and weights
    const weightedList = this.heuristicsList.map((recipe: Recipe) => {
      return { ingredients: recipe.ingredients, value: callback(recipe) }
    })

    // Match up ingredient names with ingredients in recipes and add weighted value to each ingredient found in each recipe.
    weightedList.forEach((recipe) => {
      recipe.ingredients.forEach(ingredient => {
        sortedIngredients[ingredient] += recipe.value;
      });
    })

    // Sort the finalized list and use it to sort main ingredientList
    this.ingredientList.sort((a, b) => sortedIngredients[a] - sortedIngredients[b])
    console.log(this.ingredientList) // @TODO remove logs
    console.log(sortedIngredients)
    console.log(weightedList)
  }


  // MAIN FLOW

  /** Controls the flow of the recipe search */
  discoverNewRecipe(recipe: Recipe) {
    while (this.ingredCount - recipe.ingredients.length > 0) {

      // Combine a new ingredient into the recipe
      recipe = this.updateRecipe(recipe);

      // Check if the current ingredient slot returned nothing
      if (recipe.deviation === 99) {
        if (this.indexer[0] < 0) { // If the first slot returns nothing then we're done.
          this.mainLoopService.started = false;
          this.recipeSort();
          this.recipeDisplay();
          return;
        }
        this.indexer[recipe.ingredients.length - this.mustHaveArray.length - 1]--; // reduce the index of this slot and fill the indices of later slots.
        for (let j = recipe.ingredients.length; j < this.ingredCount; j++) {
          this.indexer[j - this.mustHaveArray.length] = this.indexer[recipe.ingredients.length - this.mustHaveArray.length - 1];
        }
        // Cleaned out a slot, return to top. 
        // @TODO Alternatively, clear the recipe slot and check through bottom 2 index per run. This runs at 10s of thousands per tick, it can handle doing two rows at a time.
        return;
      }
    }
    // If we're here then we're coming up for air to check frame time and for a new round.
    this.indexer[recipe.ingredients.length - 1 - this.mustHaveArray.length]--;
    this.finalizeRecipe(recipe);

  }

  /** Joins ingredients to form a recipe.
   * @returns object with deviation and pos (index) of the ingredient, or undefined and -1 if none fit.
   * @param recipe the empty or partially built recipe needing a new ingredient.
   * @param pos the current position of the slot currently being worked, moves in reverse.
   * @param count the number of ingredients to attempt to add. Default 1
   * @TODO allow for division heuristics
  */
  findIngredient(recipe: Recipe, pos: number, count = 1): { finalDeviation: number; pos: number; } {
    const ingredRemain = this.ingredCount - recipe.ingredients.length
    count = Math.max(Math.min(count, ingredRemain), 1) // keep count above 1 and below the available recipe slots
    let finalDeviation = 99; // Let 99 be code for nothing found.
    let deviation;
    const remainingSlots = ingredRemain - count; // The number of recipe slots left after they're filled by count


    while (pos >= 0) { // While the ingredients at this slot are available, keep looking through them for a viable one.

      if (!(this.tempAvail[this.ingredientList[pos]] > 0)) { // Ignore ingredients that have no availability count left
        pos--;
        continue;
      }
      const ingredient = this.ingredientsService.ingredients[this.ingredientList[pos]];
      const A = ingredient.A * count;
      const B = ingredient.B * count;
      const C = ingredient.C * count;
      const D = ingredient.D * count;
      const E = ingredient.E * count;
      const Total = ingredient.Total * count;


      // If the final ingredient is added, change from max magamin to the totals in the recipe and get updated ratios.
      if (remainingSlots > 0) {
        deviation =
          Math.max(((recipe.A + A) / this.maxMagamin) - this.percA, 0) +
          Math.max(((recipe.B + B) / this.maxMagamin) - this.percB, 0) +
          Math.max(((recipe.C + C) / this.maxMagamin) - this.percC, 0) +
          Math.max(((recipe.D + D) / this.maxMagamin) - this.percD, 0) +
          Math.max(((recipe.E + E) / this.maxMagamin) - this.percE, 0);
      } else if (remainingSlots < 0) {
        throw new Error("Ingredient count overflow");
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
      if ((this.heuristicsComplete && deviation > this.topDeviate) ||
        deviation > 0.2525 ||
        ((remainingSlots) * 4 + recipe.Total + Total > this.maxMagamin)
      ) {
        pos--;
      } else {
        finalDeviation = deviation;
        break;
      }
    }

    return { finalDeviation, pos };
  }

  /** Adds an ingredient to the recipe. Ensuring tempAvail has enough ingredients is not handled.
   * @param recipe The Recipe object to add an ingredient to.
   * @param ingredientName The ingredient key to add to the recipe.
  */
  addIngredient(recipe: Recipe, ingredientName: string): Recipe {
    const ingredient = this.ingredientsService.ingredients[ingredientName]

    recipe.ingredients.push(ingredientName); // recipe.ingredients.length == slotIndex prior to this, slotIndex + 1 after.
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
    this.tempAvail[ingredientName]--;

    return recipe;
  }

  /** Manages recipe change flow 
   * @param recipe The recipe that requires more ingredients.
   * @TODO incorporate heuristics
  */
  updateRecipe(recipe: Recipe): Recipe {
    const slotIndex = recipe.ingredients.length - this.mustHaveArray.length
    const pos = this.indexer[slotIndex]
    const result = this.findIngredient(recipe, pos);
    this.indexer[slotIndex] = result.pos;
    recipe.deviation = result.finalDeviation;
    if (result.pos < 0) {
      return recipe;
    }
    const ingredientName = this.ingredientList[result.pos];
    this.addIngredient(recipe, ingredientName)
    return recipe; // recipe.ingredients.length == slotIndex prior to this.
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
    this.recipeRank(recipe);
    if (this.heuristicsComplete) {
      this.recipeList.push(recipe)
      this.totalCount++;
      this.hitCount++;
    }
    else this.heuristicsList.push(recipe);

    //this.recipeList.push(recipe) // @TODO set up the heuristics list.
  }

}
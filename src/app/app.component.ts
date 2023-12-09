import { Component, OnInit } from '@angular/core';
import { IngredientsService, Rarity } from './ingredients.service';
import { RecipeService, Senses } from './recipe.service';
import { MainLoopService } from './main-loop.service';
import { DataService } from './data.service';
import { SortingService } from './sorting.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Potionomics Recipe Finder';
  
  senses = Senses;
  ingredientCountDisplay = []; // Used to extend the recipe results table based on ingredient count
  qualitySelection: string[] = []
  heuristicSelection: number[] = []
  recipeSort: string[] = []

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public recipeService: RecipeService,
    public sortingService: SortingService,
    public dataService: DataService,
  ) {
    this.qualitySelection = Object.keys(this.recipeService.qualities)
    this.recipeSort = Object.keys(this.recipeService.recipeSorts)
    this.recipeService.buildIngredients();
  }

  /** Startup */
  ngOnInit(): void {
    this.dataService.loadData();
    this.ingredientCountDisplay = Array.from({ length: this.recipeService.ingredCount - 1 });
    this.mainLoopService.start();
  }

  /** Changes the ingredient sorting */
  sortClick(mode: number){
    this.sortingService.changeSortMode(mode); 
    this.sortingService.ingredientSort();
  }

  /** Checks the sorting for arrow display */
  sortCheck(category: number, desc: boolean) {
    return this.sortingService.sortMode.category == category && this.sortingService.sortMode.descending == desc;
  }

  /** Flips the filtration setting. */
  filterRecipe() {
    this.sortingService.filter = !this.sortingService.filter;
  }

  /** Sets the style for the matching ingredients by recipe depending on filter. */
  ingredCheck(i: string): string {
    let str = this.recipeService.ingredientList.find((a) => (a == i)) ? "GREEN" : "";
    str = this.sortingService.filter ? str.concat("INVISIBLE") : str;
    return str;
  }

  /** Flips the start/stop for the combination sim. */
  startClick() {
    this.mainLoopService.started = !this.mainLoopService.started;
    this.recipeService.recipeSort();
    this.recipeService.recipeDisplay();
    this.recipeService.ingredCount = this.recipeService.ingredSelection;
    this.ingredientCountDisplay = Array.from({ length: this.recipeService.ingredCount - 1 }); // -1 because the first is a header.
  }

  /** Resets the combination sim. */
  resetClick() {
    this.recipeService.reset();
  }

  
  // DIRECT EVENT HANDLERS

  /** Sets the available to the amounts that Quinn will sell in a given day. */
  setToQuinns() {
    for (const ingredient of this.ingredientsService.ingredientNames) {
      this.ingredientsService.ingredientAvailability[ingredient] = 
        this.ingredientsService.ingredients[ingredient].Rarity == '9-Common' ? 
        10 : this.ingredientsService.ingredients[ingredient].Rarity == '4-Uncommon' ?
        4 : this.ingredientsService.ingredients[ingredient].Rarity == '2-Rare' ?
        2 : 1;
    }
    this.resetClick();
  }

  /** Halves the current available number for entire inventory. */
  halveInventory() {
    for (const name of this.ingredientsService.ingredientNames) {
      this.ingredientsService.ingredientAvailability[name] = Math.floor(this.ingredientsService.ingredientAvailability[name] / 2);
    }
    this.resetClick();
  }

  /** Removes available number of ingredients of a specific rarity. */
  selectRarityChange(str: Rarity) {
    for (const name of this.ingredientsService.ingredientNames) {
      if (this.ingredientsService.ingredients[name].Rarity == str)
        this.ingredientsService.ingredientAvailability[name] = 0;
    }
    this.resetClick();
  }

  /** Removes available number of ingredients not available on or after the specified week.  */
  selectWeekChange(week: number) {
    for (const name of this.ingredientsService.ingredientNames) {
      if (parseInt(this.ingredientsService.ingredients[name].Location) >= week)
        this.ingredientsService.ingredientAvailability[name] = 0;
    }
    this.resetClick();
  }

  /** Sets desired traits to include in recipe. */
  setTrait(sense: number) {
    this.recipeService.traits[sense] = !this.recipeService.traits[sense];
    this.resetClick();
  }

  /** Sets desired illusions to include in recipe. */
  setIllusion(sense: number) {
    if (this.recipeService.illusion == sense) {
      this.recipeService.illusion = 0;
    } else {
      this.recipeService.illusion = sense;
      this.recipeService.traits[sense] = false;
    }
    this.resetClick();
  }


  // INDIRECT EVENT HANDLERS

  /** Updates a specific ingredient's available number. */
  ingredAvailChange(event: Event, name: string) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber, 999), 0);
    this.ingredientsService.ingredientAvailability[name] = numCheck;
    this.resetClick();
  }

  /** Changes all available to a specific number, generally for zeroing or filling. */
  allAvailChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber, 999), 0);
    for (const name of this.ingredientsService.ingredientNames) {
      this.ingredientsService.ingredientAvailability[name] = numCheck;
    }
    this.resetClick();
  }

  /** Updates a specific ingredient's must-have number. 
  */
  mustHaveChange(event: Event, name: string) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber, 14), 0);
    this.ingredientsService.ingredientMustHaves[name] = numCheck;
    this.recipeService.updateMustHaves();
    this.resetClick();
  }

  /** Checks for user changes to ingredient count. */
  ingredCountChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 2 : event.target.valueAsNumber, 14), 2);
    this.recipeService.ingredSelection = numCheck;
    this.resetClick();
  }

  /** Checks for user changes to magamin target. */
  magaminChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber, 2000), 0);
    this.recipeService.maxMagamin = numCheck;
    this.resetClick();
  }

  /** Checks for user changes to shop bonuses. */
  bonusChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber, 10000), 0);
    this.recipeService.shopBonus = numCheck;
    this.resetClick();
  }
  
  /** Updates the formula in use. */
  formulaUpdate(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.recipeService.selectedFormula = parseInt(event.target.value);
    this.resetClick();
  }

  /** Updates the minimum allowed quality. */
  qualityUpdate(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.recipeService.selectedQuality = event.target.value;
    this.resetClick();
  }

  /** Updates Recipe Sorting */
  RecipeSortUpdate(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.recipeService.selectedSort = event.target.value;
    this.recipeService.recipeSort();
    this.recipeService.recipeDisplay();
  }


  // HELPERS

  /** Displays the profit ratio. */
  recipeRatio(i: number) {
    const recipe = this.recipeService.recipeListDisplay[i];
    return Math.floor((recipe.value * this.recipeService.potionCount() - recipe.cost) / recipe.cost * 100) / 100;
  }

  /** Display helper function, rounds to two decimals */
  round(i: number) {
    return Math.round(i*100)/100
  }

  /** @TODO Heuristics something somethng */
  heuristicChoices(){
    this.heuristicSelection = []
    const ingreds = this.recipeService.ingredSelection - this.recipeService.mustHaveArray.length;
    for (let i = 2; i * 2 <= ingreds; i++){
      if ( ingreds % i == 0) this.heuristicSelection.push(i)
    }
  }
}

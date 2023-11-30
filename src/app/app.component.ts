import { Component, OnInit } from '@angular/core';
import { IngredientsService, Rarity } from './ingredients.service';
import { CombinationService } from './combination.service';
import { MainLoopService } from './main-loop-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'PotionomicsBruteforcer';
  percents: number[] = [0.5, 0.5, 0, 0];

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public combinationService: CombinationService
  ) {
    this.combinationService.buildIngredients();
  }

  /** Startup */
  ngOnInit(): void {
    this.combinationService.loadData();
    this.mainLoopService.start();
  }

  /** Changes the sorting in the data service */
  sortCheck(category: number, desc: boolean) {
    return this.combinationService.sortMode.category == category && this.combinationService.sortMode.descending == desc;
  }

  /** Sets the available to the amounts that Quinn will sell in a given day. */
  setToQuinns() {
    for (const ingredient of this.ingredientsService.ingredients) {
      ingredient.Avail = ingredient.Rarity == '9-Common' ? 10 : ingredient.Rarity == '4-Uncommon' ? 4 : ingredient.Rarity == '2-Rare' ? 2 : 1;
    }
    this.combinationService.updateFormula();
  }

  /** Changes all available to a specific number, generally for zeroing. */
  allAvailChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    for (let i = 0; i < this.ingredientsService.ingredients.length; i++) {
      this.ingredientsService.ingredients[i].Avail = numCheck;
    }
    this.combinationService.updateFormula();
  }

  /** Updates a specific ingredient's available number. */
  ingredAvailChange(event: Event, index: number) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.ingredientsService.ingredients[index].Avail = numCheck;
    this.combinationService.updateFormula();
  }

  /** Halves the current available number for entire inventory. */
  halveInventory() {
    for (let i = 0; i < this.ingredientsService.ingredients.length; i++) {
      this.ingredientsService.ingredients[i].Avail = Math.floor(this.ingredientsService.ingredients[i].Avail / 2);
    }
  }

  /** Removes available number of ingredients of a specific rarity. */
  selectRarityChange(str: Rarity) {
    for (let i = 0; i < this.ingredientsService.ingredients.length; i++) {
      if (this.ingredientsService.ingredients[i].Rarity == str)
        this.ingredientsService.ingredients[i].Avail = 0;
    }
  }

  /** Removes available number of ingredients not available on or after the specified week.  */
  selectWeekChange(week: number) {
    for (let i = 0; i < this.ingredientsService.ingredients.length; i++) {
      if (parseInt(this.ingredientsService.ingredients[i].Location[0]) >= week)
        this.ingredientsService.ingredients[i].Avail = 0;
    }
  }

  /** Checks for user changes to ingredient count. */
  ingredCountChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.combinationService.ingredCount = numCheck;
    this.resetClick();
  }

  /** Checks for user changes to magamin target. */
  targetChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 2000), 0);
    this.combinationService.target = numCheck;
    this.resetClick();
  }

  /** Checks for user changes to shop bonuses. */
  bonusChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 10000), 0);
    this.combinationService.shopBonus = numCheck;
    this.combinationService.updateFormula();
  }

  /** Flips the filtration setting. */
  filterRecipe() {
    this.combinationService.filter = !this.combinationService.filter;
  }

  /** Sets the style for the matching ingredients by recipe depending on filter. */
  ingredCheck(i: number): string {
    let str = this.combinationService.ingredientList.find((a) => (a.index == i)) ? "GREEN" : "";
    str = this.combinationService.filter ? str.concat("INVISIBLE") : str;
    return str;
  }

  /** Sets desired traits to include in recipe. */
  setTrait(sense: number) {
    this.combinationService.traits[sense] = !this.combinationService.traits[sense];
    this.combinationService.updateFormula();
  }

  /** Sets desired illusions to include in recipe. */
  setIllusion(sense: number) {
    this.combinationService.illusion = this.combinationService.illusion == sense ? 0 : sense;
  }

  /** Flips the start/stop for the combination sim. */
  startClick() {
    this.mainLoopService.started = !this.mainLoopService.started;
    this.combinationService.ingredientSort();
    this.combinationService.recipeSort();
    this.combinationService.recipeDisplay();
  }

  /** Resets the combination sim. */
  resetClick() {
    this.combinationService.indexerInit();
    this.combinationService.recipeInit();
  }

  /** Updates the formula in use. */
  formulaUpdate(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.ingredientsService.selectedFormula = parseInt(event.target.value);
    this.combinationService.updateFormula();
  }

  /** Displays the profit ratio. */
  recipeRatio(i: number) {
    const recipe = this.combinationService.recipeListDisplay[i];
    return Math.floor((recipe.value * this.combinationService.potionCount() - recipe.cost) / recipe.cost * 100) / 100;
  }

  /* Abandoned the idea of people importing CSV updates, most users would just be confused.
    importCSVClick() {
      //this.ingredientsService.parseCSV();
    }
  
    exportCSVClick() {
      /*  const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${this.title + "\n1,2,3,4,5\n6,7,8,9,0"}`);
        element.setAttribute('download', `PotionsList.csv`);
        const event = new MouseEvent("click");
        element.dispatchEvent(event);*//*
}*/
}

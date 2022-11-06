import { Component, OnInit } from '@angular/core';
import { IngredientsService } from './ingredients.service';
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
    this.combinationService.superMode ? this.combinationService.buildIngredientsSuper() : this.combinationService.buildIngredientsPerfect();
  }

  sortCheck(category: number, desc: boolean) {
    return this.combinationService.sortMode.category == category && this.combinationService.sortMode.descending == desc;
  }

  ingredCheck(i: number): string {
    let str = this.combinationService.ingredientList.find((a) => (a.index == i)) ? "GREEN" : "";
    str = this.combinationService.filter ? str.concat("INVISIBLE") : str;
    return str;
  }

  setToQuinns(){
    for (const ingredient of this.ingredientsService.ingredients) {
      ingredient.Avail = ingredient.Rarity == '9-Common' ? 10 : ingredient.Rarity == '4-Uncommon' ? 4 : ingredient.Rarity == '2-Rare' ? 2 : 1;
    }
    this.combinationService.updateFormula();    
  }

  allAvailChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    for (let i = 0; i < this.ingredientsService.ingredients.length; i++) {
      this.ingredientsService.ingredients[i].Avail = numCheck;
    }
    this.combinationService.updateFormula();
  }

  ingredAvailChange(event: Event, index: number) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.ingredientsService.ingredients[index].Avail = numCheck;
    this.combinationService.updateFormula();
  }

  ingredCountChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.combinationService.ingredCount = numCheck;
    this.resetClick();
  }

  targetChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 2000), 0);
    this.combinationService.target = numCheck;
    this.resetClick();
  }

  bonusChange(event: Event){
    if (!(event.target instanceof HTMLInputElement)) return;
    const numCheck = Math.max(Math.min(event.target.valueAsNumber, 10000), 0);
    this.combinationService.shopBonus = numCheck;
    this.combinationService.updateFormula();
  }

  filterRecipe() {
    this.combinationService.filter = !this.combinationService.filter;
  }

  setTrait(sense:number){
    this.combinationService.traits[sense] = !this.combinationService.traits[sense];
    this.combinationService.updateFormula();
  }

  modeClick() {
    this.combinationService.superMode = !this.combinationService.superMode;
    this.combinationService.updateFormula();
  }

  ngOnInit(): void {
    this.combinationService.loadData();
    this.mainLoopService.start();
  }

  startClick() {
    this.mainLoopService.started = !this.mainLoopService.started;
    this.combinationService.ingredientSort();
    this.combinationService.recipeSort();
    this.combinationService.recipeDisplay();
  }

  resetClick() {
    this.combinationService.indexerInit();
    this.combinationService.recipeInit();
  }

  percUpdate(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    this.ingredientsService.selectedFormula = parseInt(event.target.value);
    this.combinationService.updateFormula();
  }

  recipeRatio(i: number) {
    const recipe = this.combinationService.recipeListDisplay[i];
    return Math.floor((recipe.value * this.combinationService.potionCount() - recipe.cost) / recipe.cost * 100) / 100;
  }

  /*
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

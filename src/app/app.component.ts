import { Component, OnInit } from '@angular/core';
import { IngredientsService, IngredientStats } from './ingredients.service';
import { CombinationService } from './combination.service';
import { MainLoopService } from './main-loop-service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'PotionomicsBruteforcer';
  percents: number[] = [0.5, 0.5, 0, 0,]

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public combinationService: CombinationService
  ) {

    /*test array
    let arr: IngredientStats[] = [{
      index: 0,
      name: "AB",
      A: 42,
      B: 43,
      C: 0,
      D: 0,
      E: 0,
      Total: 85,
      Price: 0
    },{
      index: 1,
      name: "A",
      A: 4,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      Total: 4,
      Price: 0
    },{
      index: 2,
      name: "B",
      A: 0,
      B: 4,
      C: 0,
      D: 0,
      E: 0,
      Total: 4,
      Price: 0
    }];
    this.combinationService.mode ? this.combinationService.buildIngredientsSuper(arr) : this.combinationService.buildIngredientsPerfect(arr);*/
    this.combinationService.superMode ? this.combinationService.buildIngredientsSuper() : this.combinationService.buildIngredientsPerfect();
  }

  ingredCheck(i: number): string {
    return this.combinationService.ingredientList.find((a) => (a.index == i)) ? "GREEN" : ""
  }

  allAvailChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    let numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    for (let i = 0; i < this.combinationService.ingredAvail.length; i++) {
      this.combinationService.ingredAvail[i] = numCheck;
    }
  }

  ingredAvailChange(event: Event, index: number) {
    if (!(event.target instanceof HTMLInputElement)) return;
    let numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.combinationService.ingredAvail[index] = numCheck;
  }

  ingredCountChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    let numCheck = Math.max(Math.min(event.target.valueAsNumber, 20), 0);
    this.combinationService.ingredCount = numCheck;
    this.resetClick();
  }

  targetChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    let numCheck = Math.max(Math.min(event.target.valueAsNumber, 2000), 0);
    this.combinationService.target = numCheck;
    this.resetClick();
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

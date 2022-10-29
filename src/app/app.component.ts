import { Component, OnInit } from '@angular/core';
import { IngredientsService, IngredientStats } from './ingredients.service';
import { CombinationService } from './combination.service';
import { MainLoopService } from './main-loop-service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'PotionomicsBruteforcer';

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public combinationService: CombinationService
  ) { 
    
    //test array
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
    this.combinationService.buildIngredients(arr);
    this.combinationService.buildIngredients(this.ingredientsService.ingredients);
  }

  ngOnInit(): void {
    this.mainLoopService.start();
  }

  startClick() {
    this.mainLoopService.started = !this.mainLoopService.started;
  }

  listRecipe() {

  }

  importCSVClick() {
    //this.ingredientsService.parseCSV();
  }

  exportCSVClick() {
    /*  const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${this.title + "\n1,2,3,4,5\n6,7,8,9,0"}`);
      element.setAttribute('download', `PotionsList.csv`);
      const event = new MouseEvent("click");
      element.dispatchEvent(event);*/
  }
}

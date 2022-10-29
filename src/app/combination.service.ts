import { Injectable } from '@angular/core';
import { IngredientsService, IngredientStats } from './ingredients.service';
import { MainLoopService } from './main-loop-service';

interface Indexer {
  ingredient: number[],
  index: number
}

@Injectable({
  providedIn: 'root'
})
export class CombinationService {

  recipeList: IngredientStats[] = [{
    index: 0,
    name: "",
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    Total: 0,
    Price: 0
  }];
  ingredientList: IngredientStats[] = [];
  indexer: Indexer[] = [{ index: 0, ingredient: [] }];
  totalCount = 0;
  hitCount = 0;

  percA = 50 / 100;
  percB = 50 / 100;
  percC = 0 / 100;
  percD = 0 / 100;
  percE = 0 / 100;
  target = 194;
  ingredCount = 8;
  private comboIndex = 0;

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService
  ) {
    mainLoopService.tickSubject.subscribe(() => {
      this.discoverCombinations();
      this.recipeList[this.recipeList.length - 1] = ({
        index: 0,
        name: "",
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        Total: 0,
        Price: 0
      })
    });
  }

  buildIngredients(arr: IngredientStats[]) {
    let percAtoE = 0;
    this.ingredientList = JSON.parse(JSON.stringify(arr));
    let i = this.ingredientList.length;
    let validA = this.percA > 0;
    let validB = this.percB > 0;
    let validC = this.percC > 0;
    let validD = this.percD > 0;
    let validE = this.percE > 0;


    // Sort and Filter out useless materials
    this.ingredientList.sort((a, b) => a.index - b.index);
    while (i > 0) {
      i--;
      percAtoE =
        Math.max((this.ingredientList[i].A / this.target) - this.percA, 0) +
        Math.max((this.ingredientList[i].B / this.target) - this.percB, 0) +
        Math.max((this.ingredientList[i].C / this.target) - this.percC, 0) +
        Math.max((this.ingredientList[i].D / this.target) - this.percD, 0) +
        Math.max((this.ingredientList[i].E / this.target) - this.percE, 0);

      if (percAtoE > 0.05 || !(
        ((this.ingredientList[i].A > 0) == validA && validA) ||
        ((this.ingredientList[i].B > 0) == validB && validB) ||
        ((this.ingredientList[i].C > 0) == validC && validC) ||
        ((this.ingredientList[i].D > 0) == validD && validD) ||
        ((this.ingredientList[i].E > 0) == validE && validE)
      )) {
        this.ingredientList.splice(i, 1);
      };
    }
    this.indexerInit();
  }

  joinIngredients(): number {
    let percAtoE = 0;
    let arr = this.indexer[this.comboIndex];
    let recipe = this.recipeList[this.recipeList.length - 1];

    while (arr.index >= 0) {
      percAtoE =
        Math.max(((recipe.A + this.ingredientList[arr.index].A) / this.target) - this.percA, 0) +
        Math.max(((recipe.B + this.ingredientList[arr.index].B) / this.target) - this.percB, 0) +
        Math.max(((recipe.C + this.ingredientList[arr.index].C) / this.target) - this.percC, 0) +
        Math.max(((recipe.D + this.ingredientList[arr.index].D) / this.target) - this.percD, 0) +
        Math.max(((recipe.E + this.ingredientList[arr.index].E) / this.target) - this.percE, 0);
      if (percAtoE > 0.05 || (this.ingredCount - this.comboIndex) * 4 + recipe.Total > this.target) {
        arr.index--;
        this.totalCount++
      } else {
        if (this.comboIndex != 0) {
          recipe.name += ",";
        }
        recipe.name += this.ingredientList[arr.index].name;
        recipe.A += this.ingredientList[arr.index].A;
        recipe.B += this.ingredientList[arr.index].B;
        recipe.C += this.ingredientList[arr.index].C;
        recipe.D += this.ingredientList[arr.index].D;
        recipe.E += this.ingredientList[arr.index].E;
        recipe.Total += this.ingredientList[arr.index].Total;
        return arr.index
      }
    }
    return arr.index;
  }

  discoverCombinations() {

    //DO Combine
    this.joinIngredients()

    if (this.comboIndex >= this.ingredCount - 1) {
      this.indexer[this.comboIndex].index--;

      if (this.recipeList[this.recipeList.length - 1].Total != this.target) {
        this.recipeList.pop();
      } else {
        this.hitCount++;
        this.totalCount++;
      }
      this.recipeList.push({
        index: 0,
        name: "",
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        Total: 0,
        Price: 0
      })

    } 
    
    if (this.indexer[this.comboIndex].index < 0) {
      if (this.comboIndex <= 0) {
        this.mainLoopService.started = false;
        return;
      }
      this.indexer[this.comboIndex - 1].index--;
      for (let j = this.comboIndex; j < this.ingredCount; j++) {
        this.indexer[j].index = this.indexer[this.comboIndex - 1].index;
      }
      this.comboIndex--;
      return;
    } 
    if (!(this.comboIndex >= this.ingredCount - 1)) {
      this.comboIndex++;
      this.discoverCombinations();
    }

    if (this.hitCount > 99999) {
      this.mainLoopService.started = false;
    }
    this.comboIndex = 0;
  }

  indexerInit() {
    this.indexer = [];
    let tempIndex: Indexer = { index: 0, ingredient: [] }
    let i = 0;
    while (i < this.ingredientList.length) {
      tempIndex.ingredient.push(this.ingredientList[i].index);
      i++;
    }
    tempIndex.index = tempIndex.ingredient.length - 1;
    for (i = 0; i < this.ingredCount; i++) {
      this.indexer.push({ index: tempIndex.index, ingredient: [] });
    }

  }

}

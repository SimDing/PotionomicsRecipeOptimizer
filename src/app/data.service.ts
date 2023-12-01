import { Injectable } from '@angular/core';
import { IngredientsService, FormulaType, SortCategory, Sort, IngredientCount} from './ingredients.service';
import { MainLoopService } from './main-loop.service';
import { RecipeService } from './recipe.service';


/** holds the settings and some user entered data for ingredients */
interface Data {
  ingredients: IngredientCount[],
  selectedFormula: FormulaType,
  selectedQuality: string,
  target: number,
  ingredCount: number,
  sortMode: Sort,
  filter: boolean,
  traits: boolean[],
  illusion: number 
  shopBonus: number
}


/** Contains everything from settings to the main combination methods and all related members. */
@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService,
    public recipeService: RecipeService
  ) { }

  /** Saves user settings and inventory counts. 
   * @TODO update avail ingredients saving
  */
  saveData() {
    const data: Data = {
      sortMode: this.ingredientsService.sortMode,
      filter: this.ingredientsService.filter,
      ingredients: this.ingredientsService.ingredients,
      ingredCount: this.recipeService.ingredCount,
      target: this.recipeService.target,
      selectedFormula: this.recipeService.selectedFormula,
      selectedQuality: this.recipeService.selectedQuality,
      shopBonus: this.recipeService.shopBonus,
      traits: this.recipeService.traits,
      illusion: this.recipeService.illusion
    }
    console.log(data.selectedQuality)
    console.log(this.recipeService.selectedQuality)
    window.localStorage.setItem("AvailableIngredients", JSON.stringify(data))
  }

  /** Loads settings and inventory counts. */
  loadData() {
    const str = window.localStorage.getItem("AvailableIngredients");
    if (!this.ingredientsService.ingredients.length || this.ingredientsService.ingredients.length < 2) {
      this.ingredientsService.parseTSV()
    }
    if (str) {
      const data = JSON.parse(str) as Data;

      this.ingredientsService.ingredients.forEach(ingredient => {
        const index = data.ingredients.find(x => x.name === ingredient.name);
        ingredient.Avail = index ? index.Avail : 0;
      });
      this.ingredientsService.sortMode = data.sortMode || { category: SortCategory.Name, descending: false };
      this.ingredientsService.filter = data.filter || false;
      this.ingredientsService.ingredientSort();

      this.recipeService.selectedFormula = data.selectedFormula || 0;
      this.recipeService.selectedQuality = data.selectedQuality || "Perfect";
      this.recipeService.target = data.target || 375;
      this.recipeService.ingredCount = data.ingredCount || 8;
      this.recipeService.traits = data.traits || [false, false, false, false, false];
      this.recipeService.illusion = data.illusion || 0;
      this.recipeService.shopBonus = data.shopBonus || 0;
      this.recipeService.updateFormula();
    } else {
      this.recipeService.selectedFormula = 0;
      this.recipeService.target = 375;
      this.recipeService.ingredCount = 8;
      this.recipeService.traits = [false, false, false, false, false]
      this.recipeService.shopBonus = 0;
    }
    this.ingredientsService.enumerateWeekRarity();
  }

  /** Removes all settings. */
  clearData() {
    window.localStorage.removeItem("AvailableIngredients");
    this.loadData();
  }

}
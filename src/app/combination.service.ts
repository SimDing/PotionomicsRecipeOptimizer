import { Injectable } from '@angular/core';
import { IngredientsService, IngredientStats, FormulaType } from './ingredients.service';
import { MainLoopService } from './main-loop-service';
import { RankRepo, PotionRank} from './potionRank-Repo';

interface Indexer {
  ingredient: number[],
  index: number
}

interface Data {
  ingredients: IngredientStats[],
  selectedFormula: FormulaType,
  target: number,
  ingredCount: number,
  sortMode: Sort,
  filter: boolean,
  traits: boolean[],
  shopBonus: number
}

interface Recipe extends IngredientStats {
  rank: PotionRank;
  value: number;
}

export enum SortCategory {
  Index,
  Name,
  A,
  B,
  C,
  D,
  E,
  Total,
  Cost,
  Taste,
  Touch,
  Smell,
  Sight,
  Sound,
  Rarity,
  Location,
  Type,
  RankValue
}

enum Senses {
  None,
  Taste,
  Touch,
  Smell,
  Sight,
  Sound
}

interface Sort {
  category: SortCategory;
  descending: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CombinationService {
  rankRepo = new RankRepo;
  recipeList: Recipe[] = [{
    index: 0,
    name: "",
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
    Avail: 0,
    recipe: false,
    rank: this.rankRepo.ranks[0],
    value: 0
  }];
  recipeListDisplay = [...this.recipeList];

  
  ingredientList: IngredientStats[] = [];
  private IngredAvail: number[] = [];
  indexer: Indexer[] = [{ index: 0, ingredient: [] }];
  totalCount = 0;
  hitCount = 0;
  superMode = false;
  sortMode: Sort = { category: SortCategory.Name, descending: false };
  filter = false;
  traits = [false,false,false,false,false]
  senses = Senses;
  illusion = 0;

  private percA = 50 / 100;
  private percB = 50 / 100;
  private percC = 0 / 100;
  private percD = 0 / 100;
  private percE = 0 / 100;
  target = 375;
  ingredCount = 8;
  shopBonus = 0;
  private comboIndex = 0; // only locally used for that damn recursive method.

  constructor(
    public mainLoopService: MainLoopService,
    public ingredientsService: IngredientsService
  ) {
    mainLoopService.tickSubject.subscribe(() => {
      if (this.recipeList.length == 0) {
        this.recipeList.push({
          index: 0,
          name: "",
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
          Avail: 0,
          recipe: false,
          rank: this.rankRepo.ranks[0],
          value: 0
        })
      }
      this.IngredAvail.splice(0);
      this.ingredientsService.ingredients.sort((a, b) => a.index - b.index);
      for (let i = 0; i < this.ingredientsService.ingredients.length - 1; i++) {
        this.IngredAvail.push(this.ingredientsService.ingredients[i].Avail);
      }
      this.superMode ? this.discoverCombinationsSuper() : this.discoverCombinationsPerfect();
      this.totalCount++;
    });
  }

  updateFormula() {
    this.percA = this.ingredientsService.formulas[this.ingredientsService.selectedFormula].A;
    this.percB = this.ingredientsService.formulas[this.ingredientsService.selectedFormula].B;
    this.percC = this.ingredientsService.formulas[this.ingredientsService.selectedFormula].C;
    this.percD = this.ingredientsService.formulas[this.ingredientsService.selectedFormula].D;
    this.percE = this.ingredientsService.formulas[this.ingredientsService.selectedFormula].E;
    this.superMode ? this.buildIngredientsSuper() : this.buildIngredientsPerfect();
    this.recipeInit();
  }

  targetCountUpdate(target: number, count: number) {
    this.target = target;
    this.ingredCount = count;
  }

  indexerInit() {
    this.indexer = [];
    const tempIndex: Indexer = { index: 0, ingredient: [] }
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

  recipeInit() {
    this.recipeList = [{
      index: 0,
      name: "",
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
      Avail: 0,
      recipe: false,
      rank: this.rankRepo.ranks[0],
      value: 0
    }];
    this.totalCount = 0;
    this.hitCount = 0;
  }

  saveData() {
    const data: Data = {
      selectedFormula: this.ingredientsService.selectedFormula,
      target: this.target,
      ingredCount: this.ingredCount,
      ingredients: this.ingredientsService.ingredients,
      sortMode: this.sortMode,
      filter: this.filter,
      traits: this.traits,
      shopBonus: this.shopBonus
    }
    window.localStorage.setItem("AvailableIngredients", JSON.stringify(data))
  }

  loadData() {
    const str = window.localStorage.getItem("AvailableIngredients");
    if (!this.ingredientsService.ingredients.length || this.ingredientsService.ingredients.length < 2) {
      this.ingredientsService.parseCSV()
    }
    if (str) {
      const data = JSON.parse(str) as Data;
      this.ingredientsService.selectedFormula = data.selectedFormula || 0;
      this.target = data.target || 375;
      this.ingredCount = data.ingredCount || 8;
      this.ingredientsService.ingredients = data.ingredients || [];
      this.sortMode = data.sortMode || { category: SortCategory.Name, descending: false };
      this.filter = data.filter || false;
      this.traits = data.traits || [false,false,false,false,false];
      this.shopBonus = data.shopBonus || 0;
      this.updateFormula();
    } else {
      this.ingredientsService.selectedFormula = 0;
      this.target = 375;
      this.ingredCount = 8;
      this.sortMode = { category: SortCategory.Name, descending: false };
      this.filter = false;
      this.traits = [false,false,false,false,false]
      this.shopBonus = 0;
    }
    this.ingredientsService.enumerateLocations();
  }

  clearData() {
    window.localStorage.removeItem("AvailableIngredients");
    this.loadData();
  }

  ingredientSort(category: SortCategory | null = null) {
    if (category) {
      if (this.sortMode.category == category) {
        this.sortMode.descending = !this.sortMode.descending;
      } else {
        this.sortMode = { category: category, descending: false } as Sort;
      }
    }

    if (!this.sortMode.descending) {
      if (this.sortMode.category == SortCategory.Name) {
        this.ingredientsService.ingredients.sort((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.A) {
        this.ingredientsService.ingredients.sort((a, b) => a.A - b.A);
      } else if (this.sortMode.category == SortCategory.B) {
        this.ingredientsService.ingredients.sort((a, b) => a.B - b.B);
      } else if (this.sortMode.category == SortCategory.C) {
        this.ingredientsService.ingredients.sort((a, b) => a.C - b.C);
      } else if (this.sortMode.category == SortCategory.D) {
        this.ingredientsService.ingredients.sort((a, b) => a.D - b.D);
      } else if (this.sortMode.category == SortCategory.E) {
        this.ingredientsService.ingredients.sort((a, b) => a.E - b.E);
      } else if (this.sortMode.category == SortCategory.Cost) {
        this.ingredientsService.ingredients.sort((a, b) => a.cost - b.cost);
      } else if (this.sortMode.category == SortCategory.Total) {
        this.ingredientsService.ingredients.sort((a, b) => a.Total - b.Total);
      } else if (this.sortMode.category == SortCategory.Taste) {
        this.ingredientsService.ingredients.sort((a, b) => a.Taste - b.Taste);
      } else if (this.sortMode.category == SortCategory.Touch) {
        this.ingredientsService.ingredients.sort((a, b) => a.Touch - b.Touch);
      } else if (this.sortMode.category == SortCategory.Smell) {
        this.ingredientsService.ingredients.sort((a, b) => a.Smell - b.Smell);
      } else if (this.sortMode.category == SortCategory.Sight) {
        this.ingredientsService.ingredients.sort((a, b) => a.Sight - b.Sight);
      } else if (this.sortMode.category == SortCategory.Sound) {
        this.ingredientsService.ingredients.sort((a, b) => a.Sound - b.Sound);
      } else if (this.sortMode.category == SortCategory.Rarity) {
        this.ingredientsService.ingredients.sort((a, b) => a.Rarity < b.Rarity ? -1 : a.Rarity == b.Rarity ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.Location) {
        this.ingredientsService.ingredients.sort((a, b) => a.Location < b.Location ? -1 : a.Location == b.Location ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.Type) {
        this.ingredientsService.ingredients.sort((a, b) => a.Type < b.Type ? -1 : a.Type == b.Type ? 0 : 1);
      }

    } else {
      if (this.sortMode.category == SortCategory.Name) {
        this.ingredientsService.ingredients.sort((b, a) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.A) {
        this.ingredientsService.ingredients.sort((b, a) => a.A - b.A);
      } else if (this.sortMode.category == SortCategory.B) {
        this.ingredientsService.ingredients.sort((b, a) => a.B - b.B);
      } else if (this.sortMode.category == SortCategory.C) {
        this.ingredientsService.ingredients.sort((b, a) => a.C - b.C);
      } else if (this.sortMode.category == SortCategory.D) {
        this.ingredientsService.ingredients.sort((b, a) => a.D - b.D);
      } else if (this.sortMode.category == SortCategory.E) {
        this.ingredientsService.ingredients.sort((b, a) => a.E - b.E);
      } else if (this.sortMode.category == SortCategory.Cost) {
        this.ingredientsService.ingredients.sort((b, a) => a.cost - b.cost);
      } else if (this.sortMode.category == SortCategory.Total) {
        this.ingredientsService.ingredients.sort((b, a) => a.Total - b.Total);
      } else if (this.sortMode.category == SortCategory.Taste) {
        this.ingredientsService.ingredients.sort((b, a) => a.Taste - b.Taste);
      } else if (this.sortMode.category == SortCategory.Touch) {
        this.ingredientsService.ingredients.sort((b, a) => a.Touch - b.Touch);
      } else if (this.sortMode.category == SortCategory.Smell) {
        this.ingredientsService.ingredients.sort((b, a) => a.Smell - b.Smell);
      } else if (this.sortMode.category == SortCategory.Sight) {
        this.ingredientsService.ingredients.sort((b, a) => a.Sight - b.Sight);
      } else if (this.sortMode.category == SortCategory.Sound) {
        this.ingredientsService.ingredients.sort((b, a) => a.Sound - b.Sound);
      } else if (this.sortMode.category == SortCategory.Rarity) {
        this.ingredientsService.ingredients.sort((b, a) => a.Rarity < b.Rarity ? -1 : a.Rarity == b.Rarity ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.Location) {
        this.ingredientsService.ingredients.sort((b, a) => a.Location < b.Location ? -1 : a.Location == b.Location ? 0 : 1);
      } else if (this.sortMode.category == SortCategory.Type) {
        this.ingredientsService.ingredients.sort((b, a) => a.Type < b.Type ? -1 : a.Type == b.Type ? 0 : 1);
      }
    }
  }

  recipeSort(list = this.recipeList) {
    list.sort((a, b) => (b.value * this.potionCount() - b.cost) - (a.value * this.potionCount() - a.cost));
  }

  recipeDisplay(size = 1000, start = 0) {
    this.recipeListDisplay = this.recipeList.slice(start, size + 1);
  }

  recipeRank(stats: Recipe){
    const formula = this.ingredientsService.formulas[this.ingredientsService.selectedFormula];
    const ranks = this.rankRepo.ranks;
    for (let i = 0; i < this.rankRepo.ranks.length - 1; i++){
      if (ranks[i].min <= stats.Total && stats.Total < ranks[i].max){
        const bonus = this.shopBonus + stats.Smell + stats.Sight + stats.Sound + stats.Taste + stats.Touch;
        // Since Perfect potions add 2+ ranks, gotta increase the base.
        stats.rank = ranks[Math.min(i + 2, ranks.length - 1)];
        stats.value = Math.round(stats.rank.mult * formula.value * (bonus / 100 + 1));
      }
    }
  }

  potionCount(){
   return Math.floor(this.ingredCount/2);
  }

  buildIngredientsSuper(arr: IngredientStats[] = this.ingredientsService.ingredients) {
    let percAtoE = 0;
    this.ingredientList = JSON.parse(JSON.stringify(arr));
    let i = this.ingredientList.length;
    const validA = this.percA > 0;
    const validB = this.percB > 0;
    const validC = this.percC > 0;
    const validD = this.percD > 0;
    const validE = this.percE > 0;


    // Sort and Filter out useless materials
    this.ingredientList.sort((a, b) => a.Total - b.Total);
    while (i > 0) {
      i--;
      percAtoE =
        Math.max((this.ingredientList[i].A / this.target) - this.percA, 0) +
        Math.max((this.ingredientList[i].B / this.target) - this.percB, 0) +
        Math.max((this.ingredientList[i].C / this.target) - this.percC, 0) +
        Math.max((this.ingredientList[i].D / this.target) - this.percD, 0) +
        Math.max((this.ingredientList[i].E / this.target) - this.percE, 0);

      if (percAtoE > 0.051 || 
        (this.ingredientList[i].Taste < 0 && this.traits[Senses.Taste]) ||
        (this.ingredientList[i].Touch < 0 && this.traits[Senses.Touch]) ||
        (this.ingredientList[i].Smell < 0 && this.traits[Senses.Smell]) ||
        (this.ingredientList[i].Sight < 0 && this.traits[Senses.Sight]) ||
        (this.ingredientList[i].Sound < 0 && this.traits[Senses.Sound]) || 
        !( ((this.ingredientList[i].A > 0) == validA && validA) ||
        ((this.ingredientList[i].B > 0) == validB && validB) ||
        ((this.ingredientList[i].C > 0) == validC && validC) ||
        ((this.ingredientList[i].D > 0) == validD && validD) ||
        ((this.ingredientList[i].E > 0) == validE && validE) )
        ) {
        this.ingredientList.splice(i, 1);
        this.ingredientsService.ingredients[i].recipe = false;
      } else {
        this.ingredientsService.ingredients[i].recipe = true;
      }
    }
    this.indexerInit();
  }

  joinIngredientsSuper(): number {
    let percAtoE = 0;
    const arr = this.indexer[this.comboIndex];
    const recipe = this.recipeList[this.recipeList.length - 1];

    while (arr.index >= 0) {
      if (!this.IngredAvail[this.ingredientList[arr.index].index]) {
        arr.index--;
        continue;
      }
      const ingredient = this.ingredientList[arr.index];
      percAtoE =
        Math.max(((recipe.A + ingredient.A) / this.target) - this.percA, 0) +
        Math.max(((recipe.B + ingredient.B) / this.target) - this.percB, 0) +
        Math.max(((recipe.C + ingredient.C) / this.target) - this.percC, 0) +
        Math.max(((recipe.D + ingredient.D) / this.target) - this.percD, 0) +
        Math.max(((recipe.E + ingredient.E) / this.target) - this.percE, 0);
      if (percAtoE > 0.051 || ((this.ingredCount - 1 - this.comboIndex) * 4 + recipe.Total + ingredient.Total > this.target)) {
        arr.index--;
      } else {
        if (this.comboIndex != 0) {
          recipe.name += ",";
        }
        recipe.name += ingredient.name;
        recipe.A += ingredient.A;
        recipe.B += ingredient.B;
        recipe.C += ingredient.C;
        recipe.D += ingredient.D;
        recipe.E += ingredient.E;
        recipe.Total += ingredient.Total;
        recipe.cost += ingredient.cost;
        recipe.Taste = (ingredient.Taste || recipe.Taste) < 0 ? -5: ingredient.Taste > 0 ? 5: 0;
        recipe.Touch = (ingredient.Touch || recipe.Touch) < 0 ? -5: ingredient.Touch > 0 ? 5: 0;
        recipe.Smell = (ingredient.Smell || recipe.Smell) < 0 ? -5: ingredient.Smell > 0 ? 5: 0;
        recipe.Sight = (ingredient.Sight || recipe.Sight) < 0 ? -5: ingredient.Sight > 0 ? 5: 0;
        recipe.Sound = (ingredient.Sound || recipe.Sound) < 0 ? -5: ingredient.Sound > 0 ? 5: 0;
        this.IngredAvail[ingredient.index]--;
        break;
      }
    }
    return arr.index;
  }

  discoverCombinationsSuper() {

    //DO Combine
    this.joinIngredientsSuper()

    if (this.indexer[this.comboIndex].index < 0) {
      if (this.comboIndex <= 0) {
        this.mainLoopService.started = false;
        this.ingredientSort();
        this.recipeSort();
        this.recipeDisplay();
        return;
      }
      this.indexer[this.comboIndex - 1].index--;
      for (let j = this.comboIndex; j < this.ingredCount; j++) {
        this.indexer[j].index = this.indexer[this.comboIndex - 1].index;
      }
      this.comboIndex--;
      this.recipeList.pop();
      this.recipeList.push({
        index: 0,
        name: "",
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
        Avail: 0,
        recipe: false,
        rank: this.rankRepo.ranks[0],
        value: 0
      })
      return;
    }

    if (this.comboIndex >= this.ingredCount - 1) {
      this.indexer[this.comboIndex].index--;

      if (this.recipeList[this.recipeList.length - 1].Total != this.target) {
        this.recipeList.pop();
      } else {
        this.hitCount++;
      }
      this.recipeList.push({
        index: 0,
        name: "",
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
        Avail: 0,
        recipe: false,
        rank: this.rankRepo.ranks[0],
        value: 0
      })

    } else {
      this.comboIndex++;
      this.discoverCombinationsSuper();
    }
    this.comboIndex = 0;
  }

  buildIngredientsPerfect(arr: IngredientStats[] = this.ingredientsService.ingredients) {
    let percAtoE = 0;
    this.ingredientList = JSON.parse(JSON.stringify(arr));
    let i = this.ingredientList.length;
    const validA = this.percA > 0;
    const validB = this.percB > 0;
    const validC = this.percC > 0;
    const validD = this.percD > 0;
    const validE = this.percE > 0;


    // Sort and Filter out useless materials
    this.ingredientList.sort((a, b) => a.Total - b.Total);
    while (i > 0) {
      i--;
      percAtoE =
        Math.max((this.ingredientList[i].A / this.target) - this.percA, 0) +
        Math.max((this.ingredientList[i].B / this.target) - this.percB, 0) +
        Math.max((this.ingredientList[i].C / this.target) - this.percC, 0) +
        Math.max((this.ingredientList[i].D / this.target) - this.percD, 0) +
        Math.max((this.ingredientList[i].E / this.target) - this.percE, 0);

      if (percAtoE > 0.0025 ||
        (this.ingredientList[i].Taste < 0 && this.traits[Senses.Taste]) ||
        (this.ingredientList[i].Touch < 0 && this.traits[Senses.Touch]) ||
        (this.ingredientList[i].Smell < 0 && this.traits[Senses.Smell]) ||
        (this.ingredientList[i].Sight < 0 && this.traits[Senses.Sight]) ||
        (this.ingredientList[i].Sound < 0 && this.traits[Senses.Sound]) || 
        !( ((this.ingredientList[i].A > 0) == validA && validA) ||
        ((this.ingredientList[i].B > 0) == validB && validB) ||
        ((this.ingredientList[i].C > 0) == validC && validC) ||
        ((this.ingredientList[i].D > 0) == validD && validD) ||
        ((this.ingredientList[i].E > 0) == validE && validE) )
        ) {
        this.ingredientList.splice(i, 1);
        this.ingredientsService.ingredients[i].recipe = false;
      } else {
        this.ingredientsService.ingredients[i].recipe = true;
      }
    }
    this.indexerInit();
  }

  joinIngredientsPerfect(): number {
    let percAtoE = 0;
    const arr = this.indexer[this.comboIndex];
    const recipe = this.recipeList[this.recipeList.length - 1];

    while (arr.index >= 0) {
      if (!this.IngredAvail[this.ingredientList[arr.index].index]) {
        arr.index--;
        continue;
      }
      const ingredient = this.ingredientList[arr.index];
      const A = ingredient.A;
      const B = ingredient.B;
      const C = ingredient.C;
      const D = ingredient.D;
      const E = ingredient.E;
      const Total = ingredient.Total;
      if (this.comboIndex >= this.ingredCount - 1) {
        percAtoE =
          Math.max(((recipe.A + A) / (recipe.Total + Total)) - this.percA, 0) +
          Math.max(((recipe.B + B) / (recipe.Total + Total)) - this.percB, 0) +
          Math.max(((recipe.C + C) / (recipe.Total + Total)) - this.percC, 0) +
          Math.max(((recipe.D + D) / (recipe.Total + Total)) - this.percD, 0) +
          Math.max(((recipe.E + E) / (recipe.Total + Total)) - this.percE, 0);
      } else {
        percAtoE =
          Math.max(((recipe.A + A) / this.target) - this.percA, 0) +
          Math.max(((recipe.B + B) / this.target) - this.percB, 0) +
          Math.max(((recipe.C + C) / this.target) - this.percC, 0) +
          Math.max(((recipe.D + D) / this.target) - this.percD, 0) +
          Math.max(((recipe.E + E) / this.target) - this.percE, 0);
      }
      if (percAtoE > 0.0025 || ((this.ingredCount - 1 - this.comboIndex) * 4 + recipe.Total + ingredient.Total > this.target)) {
        arr.index--;
      } else {
        if (this.comboIndex != 0) {
          recipe.name += ",";
        }
        recipe.name += ingredient.name;
        recipe.A += A;
        recipe.B += B;
        recipe.C += C;
        recipe.D += D;
        recipe.E += E;
        recipe.Total += Total;
        recipe.cost += ingredient.cost;
        recipe.Taste = ingredient.Taste < 0 || recipe.Taste < 0 ? -5: ingredient.Taste > 0 ? 5: 0;
        recipe.Touch = ingredient.Touch < 0 || recipe.Touch < 0 ? -5: ingredient.Touch > 0 ? 5: 0;
        recipe.Smell = ingredient.Smell < 0 || recipe.Smell < 0 ? -5: ingredient.Smell > 0 ? 5: 0;
        recipe.Sight = ingredient.Sight < 0 || recipe.Sight < 0 ? -5: ingredient.Sight > 0 ? 5: 0;
        recipe.Sound = ingredient.Sound < 0 || recipe.Sound < 0 ? -5: ingredient.Sound > 0 ? 5: 0;
        this.IngredAvail[ingredient.index]--;
        break;
      }
    }
    return arr.index;
  }

  discoverCombinationsPerfect() {

    //DO Combine
    this.joinIngredientsPerfect()

    if (this.indexer[this.comboIndex].index < 0) {
      if (this.comboIndex <= 0) {
        this.mainLoopService.started = false;
        this.ingredientSort();
        this.recipeSort();
        this.recipeDisplay();
        return;
      }
      this.indexer[this.comboIndex - 1].index--;
      for (let j = this.comboIndex; j < this.ingredCount; j++) {
        this.indexer[j].index = this.indexer[this.comboIndex - 1].index;
      }
      this.comboIndex--;
      this.recipeList.pop();
      this.recipeList.push({
        index: 0,
        name: "",
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
        Avail: 0,
        recipe: false,
        rank: this.rankRepo.ranks[0],
        value: 0
      })
      return;
    }

    if (this.comboIndex >= this.ingredCount - 1) {
      this.indexer[this.comboIndex].index--;
      if (this.illusion == Senses.Taste){
        this.recipeList[this.recipeList.length - 1].Taste = 5;
      } else if (this.illusion == Senses.Touch){
        this.recipeList[this.recipeList.length - 1].Touch = 5;
      } else if (this.illusion == Senses.Smell){
        this.recipeList[this.recipeList.length - 1].Smell = 5;
      } else if (this.illusion == Senses.Sight){
        this.recipeList[this.recipeList.length - 1].Sight = 5;
      } else if (this.illusion == Senses.Sound){
        this.recipeList[this.recipeList.length - 1].Sound = 5;
      }
      if (this.recipeList[this.recipeList.length - 1].Total > this.target ||
        (this.recipeList[this.recipeList.length - 1].Taste <= 0 && this.traits[Senses.Taste]) ||
        (this.recipeList[this.recipeList.length - 1].Touch <= 0 && this.traits[Senses.Touch]) ||
        (this.recipeList[this.recipeList.length - 1].Smell <= 0 && this.traits[Senses.Smell]) ||
        (this.recipeList[this.recipeList.length - 1].Sight <= 0 && this.traits[Senses.Sight]) ||
        (this.recipeList[this.recipeList.length - 1].Sound <= 0 && this.traits[Senses.Sound])
        ) {
        this.recipeList.pop();
      } else {
        this.hitCount++;
        this.recipeRank(this.recipeList[this.recipeList.length - 1]);
      }
      this.recipeList.push({
        index: 0,
        name: "",
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
        Avail: 0,
        recipe: false,
        rank: this.rankRepo.ranks[0],
        value: 0
      })
    } else {
      this.comboIndex++;
      this.discoverCombinationsPerfect();
    }
    this.comboIndex = 0;
  }

}

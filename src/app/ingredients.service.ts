import { Injectable } from '@angular/core';
import { IngredientRepo } from './Ingredients.repo';


export type Rarity = '9-Common' | '4-Uncommon' | '2-Rare' | '1-Epic';

/** @TODO Implement... whatever this was for
type Location = '0-Enchanted Forest' | '1-Bone Wastes' | '1-Mushroom Mire' | '2-Ocean Coasts' | '2-Shadow Steppe' | '2-Storm Plains' | '3-Crystalline Forest' |
  '3-Ice Craggs' | '3-Sulfuric Falls' | '4-Arctic' | '4-Crater' | '4-Dragon Oasis' | '5-Magical Wasteland';
  */

export enum FormulaType {
  HealthPotion,
  ManaPotion,
  StaminaPotion,
  SpeedPotion,
  TolerancePotion,
  FireTonic,
  IceTonic,
  ThunderTonic,
  ShadowTonic,
  RadiationTonic,
  SightEnhancer,
  AlertnessEnhancer,
  InsightEnhancer,
  DowsingEnhancer,
  SeekingEnhancer,
  PoisonCure,
  DrowsinessCure,
  PetrificationCure,
  SilenceCure,
  CurseCure
}

/** Interface to house both ingredients and recipes, extended as it made certain operations simpler. */
export interface IngredientStats {
  index: number;
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  cost: number;
  Total: number;
  Taste: number;
  Touch: number;
  Smell: number;
  Sight: number;
  Sound: number;
  Rarity: string;
  Location: string;
  Type: string;
  Avail: number; // Number of this ingredient user has for potionmaking.
}

export enum SortCategory {
  None,
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

/** Interface for sort category and direction */
export interface SortMode {
  category: SortCategory;
  descending: boolean;
}

/** Interface for the formula templates. */
interface Formula {
  type: FormulaType;
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  value: number;
}

/**
 * This service class contains the formulas repo and preps the ingredient and location data.
 */
@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  ingredients: IngredientStats[] = []

  formulas: Formula[] = [
    {
      type: FormulaType.HealthPotion,
      name: "Health Potion",
      A: 0.5,
      B: 0.5,
      C: 0,
      D: 0,
      E: 0,
      value: 16
    },
    {
      type: FormulaType.ManaPotion,
      name: "Mana Potion",
      A: 0,
      B: 0.5,
      C: 0.5,
      D: 0,
      E: 0,
      value: 20
    },
    {
      type: FormulaType.StaminaPotion,
      name: "Stamina Potion",
      A: 0.5,
      B: 0,
      C: 0,
      D: 0,
      E: 0.5,
      value: 22
    },
    {
      type: FormulaType.SpeedPotion,
      name: "Speed Potion",
      A: 0,
      B: 0,
      C: 0.5,
      D: 0.5,
      E: 0,
      value: 24
    },
    {
      type: FormulaType.TolerancePotion,
      name: "Tolerance Potion",
      A: 0,
      B: 0,
      C: 0,
      D: 0.5,
      E: 0.5,
      value: 28
    },
    {
      type: FormulaType.FireTonic,
      name: "Fire Tonic",
      A: 0.5,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0,
      value: 18
    },
    {
      type: FormulaType.IceTonic,
      name: "Ice Tonic",
      A: 0.5,
      B: 0,
      C: 0,
      D: 0.5,
      E: 0,
      value: 20
    },
    {
      type: FormulaType.ThunderTonic,
      name: "Thunder Tonic",
      A: 0,
      B: 0.5,
      C: 0,
      D: 0.5,
      E: 0,
      value: 22
    },
    {
      type: FormulaType.ShadowTonic,
      name: "Shadow Tonic",
      A: 0,
      B: 0.5,
      C: 0,
      D: 0,
      E: 0.5,
      value: 24
    },
    {
      type: FormulaType.RadiationTonic,
      name: "Radiation Tonic",
      A: 0,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0.5,
      value: 26
    },
    {
      type: FormulaType.SightEnhancer,
      name: "Sight Enhancer",
      A: 0.3,
      B: 0.4,
      C: 0.3,
      D: 0,
      E: 0,
      value: 20
    },
    {
      type: FormulaType.AlertnessEnhancer,
      name: "Alertness Enhancer",
      A: 0,
      B: 0.3,
      C: 0.4,
      D: 0.3,
      E: 0,
      value: 26
    },
    {
      type: FormulaType.InsightEnhancer,
      name: "Insight Enhancer",
      A: 0.4,
      B: 0.3,
      C: 0,
      D: 0,
      E: 0.3,
      value: 24
    },
    {
      type: FormulaType.DowsingEnhancer,
      name: "Dowsing Enhancer",
      A: 0.3,
      B: 0,
      C: 0,
      D: 0.3,
      E: 0.4,
      value: 28
    },
    {
      type: FormulaType.SeekingEnhancer,
      name: "Seeking Enhancer",
      A: 0,
      B: 0,
      C: 0.3,
      D: 0.4,
      E: 0.3,
      value: 32
    },
    {
      type: FormulaType.PoisonCure,
      name: "Poison Cure",
      A: 0.5,
      B: 0,
      C: 0.25,
      D: 0.25,
      E: 0,
      value: 19
    },
    {
      type: FormulaType.DrowsinessCure,
      name: "Drowsiness Cure",
      A: 0.25,
      B: 0.25,
      C: 0,
      D: 0.5,
      E: 0,
      value: 21
    },
    {
      type: FormulaType.PetrificationCure,
      name: "Petrification Cure",
      A: 0.25,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0.25,
      value: 22
    },
    {
      type: FormulaType.SilenceCure,
      name: "Silence Cure",
      A: 0,
      B: 0.5,
      C: 0.25,
      D: 0,
      E: 0.25,
      value: 20
    },
    {
      type: FormulaType.CurseCure,
      name: "Curse Cure",
      A: 0,
      B: 0.25,
      C: 0.25,
      D: 0,
      E: 0.5,
      value: 25
    }
  ]

  repo = new IngredientRepo;
  sortMode: SortMode = { category: SortCategory.None, descending: false };
  sortMode2: SortMode = { category: SortCategory.None, descending: false }; // Secondary sort, since that kinda matters.
  filter = false;

  constructor(
  ) {
    this.parseTSV();
    this.enumerateWeekRarity();
  }

  changeSortMode(category: SortCategory){
    if (this.sortMode.category == category) {
      this.sortMode.descending = !this.sortMode.descending;
    } else {
      this.sortMode2 = this.sortMode;
      this.sortMode = { category: category, descending: false } as SortMode;
    }
  }

  
  /** Sorts ingredients using optiona SortMode object.
   * @param sortMode An object that decides how the ingredients are sorted. Defaults to the sortMode member.
  */
  ingredientSort(sortMode: SortMode = this.sortMode) {
    if (!sortMode.descending) {
      switch (sortMode.category) {
        case SortCategory.Name:
          this.ingredients.sort((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1);
          break;
        case SortCategory.A:
          this.ingredients.sort((a, b) => a.A - b.A);
          break;
        case SortCategory.B:
          this.ingredients.sort((a, b) => a.B - b.B);
          break;
        case SortCategory.C:
          this.ingredients.sort((a, b) => a.C - b.C);
          break;
        case SortCategory.D:
          this.ingredients.sort((a, b) => a.D - b.D);
          break;
        case SortCategory.E:
          this.ingredients.sort((a, b) => a.E - b.E);
          break;
        case SortCategory.Cost:
          this.ingredients.sort((a, b) => a.cost - b.cost);
          break;
        case SortCategory.Total:
          this.ingredients.sort((a, b) => a.Total - b.Total);
          break;
        case SortCategory.Taste:
          this.ingredients.sort((a, b) => a.Taste - b.Taste);
          break;
        case SortCategory.Touch:
          this.ingredients.sort((a, b) => a.Touch - b.Touch);
          break;
        case SortCategory.Smell:
          this.ingredients.sort((a, b) => a.Smell - b.Smell);
          break;
        case SortCategory.Sight:
          this.ingredients.sort((a, b) => a.Sight - b.Sight);
          break;
        case SortCategory.Sound:
          this.ingredients.sort((a, b) => a.Sound - b.Sound);
          break;
        case SortCategory.Rarity:
          this.ingredients.sort((a, b) => a.Rarity < b.Rarity ? -1 : a.Rarity == b.Rarity ? 0 : 1);
          break;
        case SortCategory.Location:
          this.ingredients.sort((a, b) => a.Location < b.Location ? -1 : a.Location == b.Location ? 0 : 1);
          break;
        case SortCategory.Type:
          this.ingredients.sort((a, b) => a.Type < b.Type ? -1 : a.Type == b.Type ? 0 : 1);
          break;
      }

    } else {
      switch (sortMode.category) {
        case SortCategory.Name:
          this.ingredients.sort((b, a) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1);
          break;
        case SortCategory.A:
          this.ingredients.sort((b, a) => a.A - b.A);
          break;
        case SortCategory.B:
          this.ingredients.sort((b, a) => a.B - b.B);
          break;
        case SortCategory.C:
          this.ingredients.sort((b, a) => a.C - b.C);
          break;
        case SortCategory.D:
          this.ingredients.sort((b, a) => a.D - b.D);
          break;
        case SortCategory.E:
          this.ingredients.sort((b, a) => a.E - b.E);
          break;
        case SortCategory.Cost:
          this.ingredients.sort((b, a) => a.cost - b.cost);
          break;
        case SortCategory.Total:
          this.ingredients.sort((b, a) => a.Total - b.Total);
          break;
        case SortCategory.Taste:
          this.ingredients.sort((b, a) => a.Taste - b.Taste);
          break;
        case SortCategory.Touch:
          this.ingredients.sort((b, a) => a.Touch - b.Touch);
          break;
        case SortCategory.Smell:
          this.ingredients.sort((b, a) => a.Smell - b.Smell);
          break;
        case SortCategory.Sight:
          this.ingredients.sort((b, a) => a.Sight - b.Sight);
          break;
        case SortCategory.Sound:
          this.ingredients.sort((b, a) => a.Sound - b.Sound);
          break;
        case SortCategory.Rarity:
          this.ingredients.sort((b, a) => a.Rarity < b.Rarity ? -1 : a.Rarity == b.Rarity ? 0 : 1);
          break;
        case SortCategory.Location:
          this.ingredients.sort((b, a) => a.Location < b.Location ? -1 : a.Location == b.Location ? 0 : 1);
          break;
        case SortCategory.Type:
          this.ingredients.sort((b, a) => a.Type < b.Type ? -1 : a.Type == b.Type ? 0 : 1);
          break;
      }
    }
  }

  parseTSV(str = this.repo.ingredientStr) {
    //init the array
    this.ingredients = [];
    //parse for IngredientStats
    let m;
    let i = 1;
    const tempStats: IngredientStats = {
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
    };
    let regex = /Name\tA\tB\tC\tD\tE\tCost\tTotal Magimin\tTaste\tTouch\tSmell\tSight\tSound\tRarity\tLocation\tType\n/gm
    if ((m = regex.exec(str)) == null) {
      return;
    }
    regex = /([ \-'’A-z]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([ \-'’A-z]*)\t([ \-'’A-z0-5]*)\t([ \-'’A-z]*)[\n|\r]?/gi;
    while ((m = regex.exec(str)) != null) {
      if (!m[2]) continue;
      tempStats.index = i;
      tempStats.name = m[1];
      tempStats.A = +m[2];
      tempStats.B = +m[3];
      tempStats.C = +m[4];
      tempStats.D = +m[5];
      tempStats.E = +m[6];
      tempStats.cost = +m[7];
      tempStats.Total = +m[8];
      tempStats.Taste = +m[9];
      tempStats.Touch = +m[10];
      tempStats.Smell = +m[11];
      tempStats.Sight = +m[12];
      tempStats.Sound = +m[13];
      tempStats.Rarity = m[14];
      tempStats.Location = m[15];
      tempStats.Type = m[16];
      //Add the matches to ingredients
      this.ingredients.push(JSON.parse(JSON.stringify(tempStats)));
      i++;
    }
  }

  enumerateWeekRarity() {
    for (const ingredient of this.ingredients) {
      if (ingredient.Location == "Enchanted Forest") {
        ingredient.Location = "0-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Bone Wastes" || "Mushroom Mire")) {
        ingredient.Location = "1-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Ocean Coasts" || "Shadow Steppe" || "Storm Plains")) {
        ingredient.Location = "2-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Crystalline Forest" || "Ice Craggs" || "Sulfuric Falls")) {
        ingredient.Location = "3-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Arctic" || "Crater" || "Dragon Oasis")) {
        ingredient.Location = "4-".concat(ingredient.Location);
      } else if (ingredient.Location == "Magical Wasteland") {
        ingredient.Location = "5-".concat(ingredient.Location);
      }
      if (ingredient.Rarity == "Common") {
        ingredient.Rarity = "9-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Uncommon") {
        ingredient.Rarity = "4-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Rare") {
        ingredient.Rarity = "2-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Epic") {
        ingredient.Rarity = "1-".concat(ingredient.Rarity);
      }
    }
  }
}

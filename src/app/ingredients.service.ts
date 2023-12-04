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

  ingredientNames: string[] = []
  ingredients: Record<string,IngredientStats> = {}
  ingredientAvailability: Record<string, number> = {} // Number of this ingredient user has for potionmaking.

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

  constructor(
  ) {
    this.parseTSV();
    this.enumerateWeekRarity();
    this.ingredientNames = Object.keys(this.ingredients)
    for (const ingredient of this.ingredientNames) {
      this.ingredientAvailability[ingredient] = 0;
    }
  }

  /** Parses the ingredient repo data into an Object */
  parseTSV(str = this.repo.ingredientStr) {
    //init the array
    this.ingredients = {};
    //parse for IngredientStats
    let m;
    const tempStats: IngredientStats = {
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
    };
    let regex = /Name\tA\tB\tC\tD\tE\tCost\tTotal Magimin\tTaste\tTouch\tSmell\tSight\tSound\tRarity\tLocation\tType\n/gm
    if ((m = regex.exec(str)) == null) {
      return;
    }
    regex = /([ \-'’A-z]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([-0-9]*)\t([ \-'’A-z]*)\t([ \-'’A-z0-5]*)\t([ \-'’A-z]*)[\n|\r]?/gi;
    while ((m = regex.exec(str)) != null) {
      if (!m[2]) continue;
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
      this.ingredients[m[1]] = JSON.parse(JSON.stringify(tempStats));
    }
  }

  enumerateWeekRarity() {
    for (const ingredient of Object.keys(this.ingredients)) {
      if (this.ingredients[ingredient].Location == "Enchanted Forest") {
        this.ingredients[ingredient].Location = "0-".concat(this.ingredients[ingredient].Location);
      } else if (this.ingredients[ingredient].Location == ("Bone Wastes" || "Mushroom Mire")) {
        this.ingredients[ingredient].Location = "1-".concat(this.ingredients[ingredient].Location);
      } else if (this.ingredients[ingredient].Location == ("Ocean Coasts" || "Shadow Steppe" || "Storm Plains")) {
        this.ingredients[ingredient].Location = "2-".concat(this.ingredients[ingredient].Location);
      } else if (this.ingredients[ingredient].Location == ("Crystalline Forest" || "Ice Craggs" || "Sulfuric Falls")) {
        this.ingredients[ingredient].Location = "3-".concat(this.ingredients[ingredient].Location);
      } else if (this.ingredients[ingredient].Location == ("Arctic" || "Crater" || "Dragon Oasis")) {
        this.ingredients[ingredient].Location = "4-".concat(this.ingredients[ingredient].Location);
      } else if (this.ingredients[ingredient].Location == "Magical Wasteland") {
        this.ingredients[ingredient].Location = "5-".concat(this.ingredients[ingredient].Location);
      }
      if (this.ingredients[ingredient].Rarity == "Common") {
        this.ingredients[ingredient].Rarity = "9-".concat(this.ingredients[ingredient].Rarity);
      } else if (this.ingredients[ingredient].Rarity == "Uncommon") {
        this.ingredients[ingredient].Rarity = "4-".concat(this.ingredients[ingredient].Rarity);
      } else if (this.ingredients[ingredient].Rarity == "Rare") {
        this.ingredients[ingredient].Rarity = "2-".concat(this.ingredients[ingredient].Rarity);
      } else if (this.ingredients[ingredient].Rarity == "Epic") {
        this.ingredients[ingredient].Rarity = "1-".concat(this.ingredients[ingredient].Rarity);
      }
    }
  }
}

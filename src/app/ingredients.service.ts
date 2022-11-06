import { Injectable } from '@angular/core';
import { Repo } from './Ingredient-Repo';

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

export interface Formula {
  type: FormulaType;
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  value: number;
}

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
  Avail: number;
  recipe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  selectedFormula: FormulaType = 0;

  ingredients: IngredientStats[] = [
    {
      index: 0,
      name: "(blank)",
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
      recipe: false
    }
  ]

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

  repo = new Repo;

  constructor(
  ) {
    this.parseCSV();
    this.enumerateLocations();
  }

  parseCSV(str = this.repo.ingredientStr) {
    //init the array
    this.ingredients = [];
    //parse for IngredientStats
    let m;
    let i = 0;
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
      recipe: false
    };
    let regex = /Name,A,B,C,D,E,Cost,Total Magimin,Taste,Touch,Smell,Sight,Sound,Rarity,Location,Type\n/gm 
    if ((m = regex.exec(str)) == null) {
      return;
    }
    regex = /([/ \-'’A-z]*),([0-9]*),([0-9]*),([0-9]*),([0-9]*),([0-9]*),([0-9]*),([0-9]*),([-0-9]*),([-0-9]*),([-0-9]*),([-0-9]*),([-0-9]*),([/ \-'’A-z]*),([/ \-'’A-z0-5]*),([/ \-'’A-z]*)[\n|\r]/gi;
    while ((m = regex.exec(str)) != null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
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

  enumerateLocations(){
    for (const ingredient of this.ingredients) {
      if (ingredient.Location == "Enchanted Forest"){
        ingredient.Location = "0-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Bone Wastes" || "Mushroom Mire")){
        ingredient.Location = "1-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Ocean Coasts" || "Shadow Steppe" || "Storm Plains")){
        ingredient.Location = "2-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Crystalline Forest" || "Ice Craggs" || "Sulfuric Falls")){
        ingredient.Location = "3-".concat(ingredient.Location);
      } else if (ingredient.Location == ("Arctic" || "Crater" || "Dragon Oasis")){
        ingredient.Location = "4-".concat(ingredient.Location);
      } else if (ingredient.Location == "Magical Wasteland"){
        ingredient.Location = "5-".concat(ingredient.Location);
      }
      if (ingredient.Rarity == "Common"){
        ingredient.Rarity = "9-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Uncommon"){
        ingredient.Rarity = "4-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Rare"){
        ingredient.Rarity = "2-".concat(ingredient.Rarity);
      } else if (ingredient.Rarity == "Epic"){
        ingredient.Rarity = "1-".concat(ingredient.Rarity);
      } 
    } 
  }
}

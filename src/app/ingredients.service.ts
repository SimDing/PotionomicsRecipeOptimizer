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
}

export interface IngredientStats {
  index: number;
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  Total: number;
  Price: number | null;
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
      Total: 0,
      Price: 0,
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
      E: 0
    },
    {
      type: FormulaType.ManaPotion,
      name: "Mana Potion",
      A: 0,
      B: 0.5,
      C: 0.5,
      D: 0,
      E: 0
    },
    {
      type: FormulaType.StaminaPotion,
      name: "Stamina Potion",
      A: 0.5,
      B: 0,
      C: 0,
      D: 0,
      E: 0.5
    },
    {
      type: FormulaType.SpeedPotion,
      name: "Speed Potion",
      A: 0,
      B: 0,
      C: 0.5,
      D: 0.5,
      E: 0
    },
    {
      type: FormulaType.TolerancePotion,
      name: "Tolerance Potion",
      A: 0,
      B: 0,
      C: 0,
      D: 0.5,
      E: 0.5
    },
    {
      type: FormulaType.FireTonic,
      name: "Fire Tonic",
      A: 0.5,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0
    },
    {
      type: FormulaType.IceTonic,
      name: "Ice Tonic",
      A: 0.5,
      B: 0,
      C: 0,
      D: 0.5,
      E: 0
    },
    {
      type: FormulaType.ThunderTonic,
      name: "Thunder Tonic",
      A: 0,
      B: 0.5,
      C: 0,
      D: 0.5,
      E: 0
    },
    {
      type: FormulaType.ShadowTonic,
      name: "Shadow Tonic",
      A: 0,
      B: 0.5,
      C: 0,
      D: 0,
      E: 0.5
    },
    {
      type: FormulaType.RadiationTonic,
      name: "Radiation Tonic",
      A: 0,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0.5
    },
    {
      type: FormulaType.SightEnhancer,
      name: "Sight Enhancer",
      A: 0.3,
      B: 0.4,
      C: 0.3,
      D: 0,
      E: 0
    },
    {
      type: FormulaType.AlertnessEnhancer,
      name: "Alertness Enhancer",
      A: 0,
      B: 0.3,
      C: 0.4,
      D: 0.3,
      E: 0
    },
    {
      type: FormulaType.InsightEnhancer,
      name: "Insight Enhancer",
      A: 0.4,
      B: 0.3,
      C: 0,
      D: 0,
      E: 0.3
    },
    {
      type: FormulaType.DowsingEnhancer,
      name: "Dowsing Enhancer",
      A: 0.3,
      B: 0,
      C: 0,
      D: 0.3,
      E: 0.4
    },
    {
      type: FormulaType.SeekingEnhancer,
      name: "Seeking Enhancer",
      A: 0,
      B: 0,
      C: 0.3,
      D: 0.4,
      E: 0.3
    },
    {
      type: FormulaType.PoisonCure,
      name: "Poison Cure",
      A: 0.5,
      B: 0,
      C: 0.25,
      D: 0.25,
      E: 0
    },
    {
      type: FormulaType.DrowsinessCure,
      name: "Drowsiness Cure",
      A: 0.25,
      B: 0.25,
      C: 0,
      D: 0.5,
      E: 0
    },
    {
      type: FormulaType.PetrificationCure,
      name: "Petrification Cure",
      A: 0.25,
      B: 0,
      C: 0.5,
      D: 0,
      E: 0.25
    },
    {
      type: FormulaType.SilenceCure,
      name: "Silence Cure",
      A: 0,
      B: 0.5,
      C: 0.25,
      D: 0,
      E: 0.25
    },
    {
      type: FormulaType.CurseCure,
      name: "Curse Cure",
      A: 0,
      B: 0.25,
      C: 0.25,
      D: 0,
      E: 0.5
    }
  ]

  repo = new Repo;

  constructor(
  ) {
    this.parseCSV();
  }

  parseCSV(str = this.repo.str) {
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
      Total: 0,
      Price: 0,
      Avail: 0,
      recipe: false
    };
    let regex = /Name,A,B,C,D,E,Price,Total Magimin,Taste,Touch,Smell,Sight,Sound,Rarity,Location,Type\n/gm 
    if ((m = regex.exec(str)) == null) {
      return;
    }
    regex = /([/ \-'’A-z]*)(,*)([0-9]*)(,*)([0-9]*)(,\t*)([0-9]*)(,*)([0-9]*)(,*)([0-9]*)(,*)([0-9]*)(,*)([0-9]*)(,*)([-0-9]*)(,*)([-0-9]*)(,*)([-0-9]*)(,*)([-0-9]*)(,*)([-0-9]*)(,*)([/ \-'’A-z]*)(,*)([/ \-'’A-z]*)(,*)([/ \-'’A-z]*)([\n|\r]*)/gi;
    while ((m = regex.exec(str)) != null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (!m[3]) continue;
      tempStats.index = i;
      tempStats.name = m[1];
      tempStats.A = +m[3];
      tempStats.B = +m[5];
      tempStats.C = +m[7];
      tempStats.D = +m[9];
      tempStats.E = +m[11];
      tempStats.Price = +m[13];
      tempStats.Total = +m[15];
      //Add the matches to ingredients
      this.ingredients.push(JSON.parse(JSON.stringify(tempStats)));
      i++;
    }
  }
}

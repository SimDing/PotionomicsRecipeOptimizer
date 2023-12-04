import { Injectable } from '@angular/core';
import { IngredientsService } from './ingredients.service';


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


/** Contains everything from settings to the main combination methods and all related members. */
@Injectable({
  providedIn: 'root'
})
export class SortingService {

  filter = false;
  sortMode: SortMode = { category: SortCategory.None, descending: false };
  sortMode2: SortMode = { category: SortCategory.None, descending: false }; // Secondary sort, since that kinda matters.
  sortedList: string[] = Object.keys(this.ingredientsService.ingredients)

  constructor(
    public ingredientsService: IngredientsService,
  ) { }

  
  changeSortMode(category: SortCategory){
    if (this.sortMode.category == category) {
      this.sortMode.descending = !this.sortMode.descending;
    } else {
      this.sortMode2 = this.sortMode;
      this.sortMode = { category: category, descending: false } as SortMode;
    }
  }
  
  /** Sorts ingredients using optional SortMode object.
   * @param sortMode An object that decides how the ingredients are sorted. Defaults to the sortMode member.
  */
  ingredientSort(sortMode: SortMode = this.sortMode) {
    if (!sortMode.descending) {
      switch (sortMode.category) {
        case SortCategory.Name:
          this.sortedList.sort((a, b) => a < b ? -1 : a == b ? 0 : 1);
          break;
        case SortCategory.A:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].A - this.ingredientsService.ingredients[b].A);
          break;
        case SortCategory.B:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].B - this.ingredientsService.ingredients[b].B);
          break;
        case SortCategory.C:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].C - this.ingredientsService.ingredients[b].C);
          break;
        case SortCategory.D:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].D - this.ingredientsService.ingredients[b].D);
          break;
        case SortCategory.E:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].E - this.ingredientsService.ingredients[b].E);
          break;
        case SortCategory.Cost:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].cost - this.ingredientsService.ingredients[b].cost);
          break;
        case SortCategory.Total:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Total - this.ingredientsService.ingredients[b].Total);
          break;
        case SortCategory.Taste:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Taste - this.ingredientsService.ingredients[b].Taste);
          break;
        case SortCategory.Touch:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Touch - this.ingredientsService.ingredients[b].Touch);
          break;
        case SortCategory.Smell:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Smell - this.ingredientsService.ingredients[b].Smell);
          break;
        case SortCategory.Sight:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Sight - this.ingredientsService.ingredients[b].Sight);
          break;
        case SortCategory.Sound:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Sound - this.ingredientsService.ingredients[b].Sound);
          break;
        case SortCategory.Rarity:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Rarity < this.ingredientsService.ingredients[b].Rarity ? 
            -1 : this.ingredientsService.ingredients[a].Rarity == this.ingredientsService.ingredients[b].Rarity ? 0 : 1);
          break;
        case SortCategory.Location:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Location < this.ingredientsService.ingredients[b].Location ? 
            -1 : this.ingredientsService.ingredients[a].Location == this.ingredientsService.ingredients[b].Location ? 0 : 1);
          break;
        case SortCategory.Type:
          this.sortedList.sort((a, b) => this.ingredientsService.ingredients[a].Type < this.ingredientsService.ingredients[b].Type ? 
            -1 : this.ingredientsService.ingredients[a].Type == this.ingredientsService.ingredients[b].Type ? 0 : 1);
          break;
      }

    } else {
      switch (sortMode.category) {
        case SortCategory.Name:
          this.sortedList.sort((a, b) => a < b ? -1 : a == b ? 0 : 1);
          break;
        case SortCategory.A:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].A - this.ingredientsService.ingredients[b].A);
          break;
        case SortCategory.B:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].B - this.ingredientsService.ingredients[b].B);
          break;
        case SortCategory.C:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].C - this.ingredientsService.ingredients[b].C);
          break;
        case SortCategory.D:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].D - this.ingredientsService.ingredients[b].D);
          break;
        case SortCategory.E:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].E - this.ingredientsService.ingredients[b].E);
          break;
        case SortCategory.Cost:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].cost - this.ingredientsService.ingredients[b].cost);
          break;
        case SortCategory.Total:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Total - this.ingredientsService.ingredients[b].Total);
          break;
        case SortCategory.Taste:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Taste - this.ingredientsService.ingredients[b].Taste);
          break;
        case SortCategory.Touch:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Touch - this.ingredientsService.ingredients[b].Touch);
          break;
        case SortCategory.Smell:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Smell - this.ingredientsService.ingredients[b].Smell);
          break;
        case SortCategory.Sight:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Sight - this.ingredientsService.ingredients[b].Sight);
          break;
        case SortCategory.Sound:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Sound - this.ingredientsService.ingredients[b].Sound);
          break;
        case SortCategory.Rarity:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Rarity < this.ingredientsService.ingredients[b].Rarity ? 
            -1 : this.ingredientsService.ingredients[a].Rarity == this.ingredientsService.ingredients[b].Rarity ? 0 : 1);
          break;
        case SortCategory.Location:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Location < this.ingredientsService.ingredients[b].Location ? 
            -1 : this.ingredientsService.ingredients[a].Location == this.ingredientsService.ingredients[b].Location ? 0 : 1);
          break;
        case SortCategory.Type:
          this.sortedList.sort((b, a) => this.ingredientsService.ingredients[a].Type < this.ingredientsService.ingredients[b].Type ? 
            -1 : this.ingredientsService.ingredients[a].Type == this.ingredientsService.ingredients[b].Type ? 0 : 1);
          break;
      }
    }
  }

  
}
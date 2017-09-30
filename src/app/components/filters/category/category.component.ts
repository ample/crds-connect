import { Component, OnInit } from '@angular/core';

import { Category } from '../../../models';

import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'category',
  templateUrl: 'category.component.html'
})


export class CategoryComponent implements OnInit {
  private selected: boolean = false;
  private categories: Category[];

  constructor(private lookupService: LookupService,
    private filterService: FilterService) { }

  public ngOnInit(): void {
    this.initializeCategories();
  }

  public clickToSelect(value: string) {
    this.setSelection(value);
    this.setFilterString();
  }

  private initializeCategories(): void {
    this.lookupService.getCategories().subscribe(
      cats => {
        this.categories = cats;
        this.setSelectedCategories();
      }
    );
  }

  private setSelectedCategories(): void {
    const selectedCategories = this.filterService.getSelectedCategories();
    if (selectedCategories) {
      selectedCategories.map(cat => this.setSelection(cat));
    }
  }

  private setSelection(selectedValue: string) {
    const group = this.categories.find(i => i.name === selectedValue);
    if (group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringCategories(this.categories);
  }

  public reset() {
    for (const cat of this.categories) {
      cat.selected = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';

import { Category } from '../../../models/category';

import { awsFieldNames } from '../../../shared/constants';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'category',
  templateUrl: 'category.component.html'
})


export class CategoryComponent implements OnInit {
  private selected: boolean = false;
  private categories: Category[];

  constructor( private appSettings: AppSettingsService,
               private lookupService: LookupService,
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
    if (this.filterService.filterStringCategories != null) {
      const selectedCategories = this.filterService.filterStringCategories.replace(/\(or|'|prefix|field|=|[() ]/g, '').split('groupcategory');
      selectedCategories.forEach(element => {
        this.setSelection(element);
      });
    }
  }

  private setSelection(selectedValue: string) {
    let group = this.categories.find(i => i.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringCategories(this.categories);
  }

  public reset() {
    for (let cat of this.categories) {
      cat.selected = false;
    }
  }
}

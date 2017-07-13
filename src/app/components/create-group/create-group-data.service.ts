import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address, Group } from '../../models';
import { Category } from '../../models/category';
import { LookupService } from '../../services/lookup.service';

@Injectable()
export class CreateGroupService {
    public meetingTimeType: string = 'specific';
    private pageOneInitialized: boolean = false;
    public categories: Category[] = [];
    public group: Group = Group.overload_Constructor_One(0, []);

    constructor(private lookupService: LookupService) {}

    public setGroupAddress(address: Address): void {
        this.group.address = address;
    }

    public initializePageOne(): Observable<Category[]> {
        if (!this.pageOneInitialized) {
            return this.lookupService.getCategories()
            .do((cats: Category[]) => {
                this.categories = cats;
                this.pageOneInitialized = true;
            });
        } else {
            return Observable.of(this.categories);
        }
    }

    public validateCategories(): boolean {
        let selectedCategories = this.categories.filter((category) => {
            return category.selected === true;
        });

        return (selectedCategories.length > 0 && selectedCategories.length < 3);
    }

}


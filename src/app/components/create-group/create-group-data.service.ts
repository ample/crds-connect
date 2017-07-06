import { Address, Group } from '../../models';
import { Category } from '../../models/category';
import { LookupService } from '../../services/lookup.service';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class CreateGroupService {
    private pageOneInitialized: boolean = false;
    public categories: Category[] = [];
    private groupData = new Group();

    constructor(private lookupService: LookupService) {}

    public setGroupAddress(address: Address): void {
        this.groupData.address = address;
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

}


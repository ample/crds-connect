import { Address, Group } from '../../models';
import { Category } from '../../models/category';

import { Injectable } from '@angular/core';

@Injectable()
export class CreateGroupService {
    private initialized: boolean = false;
    private groupData = new Group();
    private selectedCategories: Category[] = [];

    public initialize() {
        this.groupData = new Group();
        this.selectedCategories = Array<Category>();
        this.initialized = true;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public setCategories(categories: Category[]): void {
        this.selectedCategories = categories;
    }

    public getCategories(): Category[] {
        return this.selectedCategories;
    }

    public setGroupAddress(address: Address): void {
        this.groupData.address = address;
    }

}


import { Address, Group } from '../../models';

import { Injectable } from '@angular/core';

@Injectable()
export class CreateGroupService {
    private initialized: boolean = false;
    private groupData = new Group();

    public setGroupAddress(address: Address): void {
        this.groupData.address = address;
    }

}

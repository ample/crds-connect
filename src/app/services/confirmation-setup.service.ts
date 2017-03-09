import { Injectable } from '@angular/core';

import { ConfirmationSetup } from '../models/confirmation-setup';

@Injectable()
export class ConfirmationSetupService {
    
    private confirmationSetup
    
    constructor() { }

    public setConfirmationSetup(cs: ConfirmationSetup) {
        this.confirmationSetup = cs;
    }

    public getConfirmationSetup(){
        let cs = this.confirmationSetup; 
        //clear setup for later use
        this.confirmationSetup = null;
        return cs;
    }
}
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Category, LookupTable, AttributeType } from '../models';
import { CacheableService } from './base-service/cacheable.service';
import { SessionService } from './session.service';

import { attributeTypes } from '../shared/constants';

@Injectable()
export class ProfileService {
    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    constructor(private session: SessionService) { }


    public getProfileData() {
        return this.session.get(`${this.baseUrl}api/profile`);
    }
}

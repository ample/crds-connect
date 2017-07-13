import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Category } from '../models/category';
import { AgeGroup } from '../models/age-group';
import { CacheableService } from './base-service/cacheable.service';
import { SessionService } from './session.service';

import { Observable } from 'rxjs';

import { attributeTypes } from '../shared/constants';

@Injectable()
export class LookupService {
    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    constructor(private session: SessionService) {}

    public getCategories(): Observable<Category[]> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/group-tool/categories`)
        .map((res: Category[]) => {
            return res as Category[];
        });
    }

    public getAgeGroups(): Observable<any> {
      return this.session.get(`${this.baseUrl}api/v1.0.0/attribute-type/${attributeTypes.AgeGroupAttributeTypeId}`);
    }

    public getGroupTypes(): Observable<any> {
      return this.session.get(`${this.baseUrl}api/v1.0.0/attribute-type/${attributeTypes.GroupTypeAttributeTypeId}`);
    }

}

import { Category } from '../models/category';
import { AgeGroup } from '../models/age-group';
import { AgeGroupAttributeTypeId } from '../shared/constants';
import { CacheableService } from './base-service/cacheable.service';
import { SessionService } from './session.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class LookupService {
    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    constructor(private session: SessionService) {}

    public getCategories(): Observable<Category[]> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/group-tool/categories`);
    }

    public getAgeGroups(): Observable<any> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/attribute-type/${AgeGroupAttributeTypeId}`);
    }
}

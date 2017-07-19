import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Category, LookupTable, AttributeType } from '../models';
import { CacheableService } from './base-service/cacheable.service';
import { SessionService } from './session.service';

import { attributeTypes } from '../shared/constants';

@Injectable()
export class LookupService {
    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    constructor(private session: SessionService) { }

    public getCategories(): Observable<Category[]> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/group-tool/categories`)
        .map((res: Category[]) => {
            return res as Category[];
        });
    }

    public getAgeRanges(): Observable<AttributeType> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/attribute-type/${attributeTypes.AgeRangeAttributeTypeId}`);
    }

    public getGroupGenderMixTypes(): Observable<AttributeType> {
        console.log(attributeTypes.GroupGenderMixTypeAttributeId);
        return this.session.get(`${this.baseUrl}api/v1.0.0/attribute-type/${attributeTypes.GroupGenderMixTypeAttributeId}`);
    }

    public getDaysOfTheWeek(): Observable<LookupTable[]> {
        return this.session.get(`${this.baseUrl}api/v1.0.0/lookup/meetingdays`)
            .map((response: LookupTable[]) => {
                return response.sort((day1, day2) => {
                    if (day1.dp_RecordID < day2.dp_RecordID) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            });
    }
}

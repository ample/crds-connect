/* tslint:disable:no-construct */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { endpoint, categories } from '../shared/constants';

@Injectable()
export class ContentService {
  categories: Array<string> = categories;
  endpoint: string = endpoint;
  contentBlocks: Array<any> = new Array();

  constructor(private http: Http) {}

  loadData() {
    this.getContentBlocks().subscribe(contentBlocks => {
      this.contentBlocks = contentBlocks;
    });
  }

  buildUrl() {
    if (Array.isArray(this.categories) && this.categories.length > 0) {
      return this.categories.reduce((accumulator, category, index) => `${accumulator}${index === 0 ? '?' : '&'}category[]=${category}`, `${this.endpoint}api/contentblock`);
    }
  }

  getContentBlocks() {
    return this.http.get(this.buildUrl())
      .map(res => {
        return res.json().contentblocks;
      })
      .catch(this.handleError);
  }

  getContent(contentBlockTitle) {
    const cb = this.contentBlocks.find( (c) => c.title && c.title === contentBlockTitle );
    return cb && cb.content ? cb.content : '';
  }

  private handleError (error: any) {
    return [[]];
  }
}

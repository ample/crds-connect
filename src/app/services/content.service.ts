import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';
import { BodyOutputType } from 'angular2-toaster';
import { ContentBlock } from '../models/content-block';

@Injectable()
export class ContentService {

  private contentBlockTitle: string;
  contentBlocks: ContentBlock[];

  constructor(private http: Http) {}

  loadData(categories = Array('common', 'main')) {
    // call for each type of content block used in the app
    this.getContentBlocks(categories).subscribe(contentBlocks => {
      this.contentBlocks = contentBlocks;
    });
  }

  getContentBlocks (categories: Array<string>) {
    let url = process.env.CRDS_CMS_ENDPOINT + 'api/contentblock';
    if (Array.isArray(categories) && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        let pre = '&';
        if (i === 0) {
          pre = '?';
        }
        url += pre + 'category[]=' + categories[i];
      }
    }  
    return this.http.get(url)
      .map(res => {
        console.log(res.json().contentblocks);
        return res.json().contentblocks;
      })
      .catch(this.handleError);                
  }

  getContent (contentBlockTitle) {
    return this.contentBlocks.find(x => x.title === contentBlockTitle).content;
  }

  private handleError (error: any) {    
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}

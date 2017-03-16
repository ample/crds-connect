import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';
import { BodyOutputType } from 'angular2-toaster';
import { ContentBlock } from '../models/content-block';

@Injectable()
export class ContentService {

  private isContentBlocksAvailable: boolean;
  private contentBlockTitle: string;
  public contentBlocks: ContentBlock[];

  constructor(private http: Http) {}

  loadData(categories = Array('common', 'main', 'finder')): void {
    // call for each type of content block used in the app
     this.getContentBlocks(categories).subscribe(contentBlocks => {
       this.contentBlocks = contentBlocks;
       this.isContentBlocksAvailable = true;
     });
  }

  getContentBlocks (categories: Array<string>): Observable<any> {
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
        return res.json().contentblocks;
      })
      .catch(this.handleError);
  }

  getContent (contentBlockTitle): string {
    if (this.isContentBlocksAvailable || this.contentBlocks !== undefined) {
      return this.contentBlocks.find(x => x.title === contentBlockTitle).content;
    }
  }

  private handleError (error: any): Observable<any>  {
    return Observable.throw(error.json().error || 'Server error');
  }

}

import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { Meta } from '@angular/platform-browser';

import { Group } from '../../../../models/group';

@Component({
  selector: 'social-media',
  templateUrl: './social-media.component.html'
})
export class SocialMediaComponent implements OnInit  {

  @Input() gathering: Group;

  constructor(private toast: ToastsManager, private metaService: Meta) { }

  public ngOnInit() {
    /* <meta property="og:url"           content="http://www.your-domain.com/your-page.html" />
    <meta property="og:type"          content="website" />
    <meta property="og:title"         content="Your Website Title" />
    <meta property="og:description"   content="Your description" /> */

     this.metaService.addTags([
      { property: 'og:url',         content: 'https://int.crossroads.net/groupsv2/search/small-group/180654' },
      { property: 'og:type',        content: 'website' },
      { property: 'og:title',       content: 'Phil-080217 Group' },
      { property: 'og:description', content: 'Please join the 080217 group. The name says it all!' },
      { property: 'og:image',       content: 'https://unsplash.it/200/200'}
    ]); 
  }


  public getFBURL(): string {
    let a = 'https://www.facebook.com/dialog/share?app_id=482474212114603&display=popup&href=' + encodeURI('https://int.crossroads.net/groupsv2/search/small-group/180654') + '&redirect_uri=' + encodeURI('https://int.crossroads.net/groupsv2/search/small-group/180654');
    return a;
  }

  public getURL(): string {
    return window.location.href;
  }

  public copyURL(url: string): void {
    this.displayCopiedToClipboardToast(url);
  }

  public displayCopiedToClipboardToast(url: string): void {
    let toastMsg: string = `${url} copied to clipboard!`;
    this.toast.success(toastMsg);
  }
}

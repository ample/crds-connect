import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

import { Group } from '../../../../models/group';

@Component({
  selector: 'social-media',
  templateUrl: './social-media.component.html'
})
export class SocialMediaComponent  {

  @Input() gathering: Group;

  constructor(private toast: ToastsManager) { }

  public shareGroupOnFacebook(){

    console.log(document.location.href);

    var titleMeta = document.createElement('meta');
    var descMeta = document.createElement('meta');

    titleMeta.setAttribute('property', 'og:title');
    titleMeta.setAttribute('content', 'The Rock');

    descMeta.setAttribute('property', 'og:description');
    descMeta.setAttribute('content', 'Foo Description');

    document.getElementsByTagName('head')[0].appendChild(titleMeta);
    document.getElementsByTagName('head')[0].appendChild(descMeta);

    window.open('http://www.facebook.com/sharer/sharer.php?u=www.google.com');
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

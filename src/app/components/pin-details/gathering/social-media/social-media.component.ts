import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'social-media',
  templateUrl: './social-media.component.html'
})
export class SocialMediaComponent  {

  constructor(private toast: ToastsManager) { }

  public getURL(): string {
    return window.location.href;
  }

  public copyURL(url: string): void {
    this.displayCopiedToClipboardToast(url);
  }

  public displayCopiedToClipboardToast(url: string): void {
    const toastMsg: string = `${url} copied to clipboard!`;
    this.toast.success(toastMsg);
  }
}

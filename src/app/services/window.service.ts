// https://juristr.com/blog/2016/09/ng2-get-window-ref/

import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  public get nativeWindow(): any {
    return window;
  }
}

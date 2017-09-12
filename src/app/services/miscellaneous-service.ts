import { Injectable } from '@angular/core';

@Injectable()
export class MiscellaneousService {

  constructor() {
  }

  public reEnableScrollingInCaseFauxdalDisabledIt(): void {
    document.querySelector('body').style.overflowY = 'scroll';
  }

}

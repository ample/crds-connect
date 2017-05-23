import { Injectable} from '@angular/core';
import { AppType } from '../shared/constants';

@Injectable()
export class AppSettingsService {

  public finderType: string;

  constructor() {}

  setAppSettings(appType: AppType) {
      switch (appType) {
          case AppType.Connect:
            this.finderType = 'CONNECT';
            console.log('Settings for Connect');
            break;
          case AppType.Groups:
            this.finderType = 'SMALL_GROUPS';
            console.log('Settings for Groups');
            break;
      }
  }
}

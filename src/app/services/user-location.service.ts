import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { StateService } from './state.service';

@Injectable()
export class UserLocationService {

  public is_loading: boolean = false;

  public getUserLocationFromUserId(userId: number) {
    
  }

  public getUserLocationFromIp(ipaddress: string) {

  }

  public getUserLocationFromDefault() {

  }

}

import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  public is_loading: boolean = false;

  public setLoading(val: boolean) {
    console.log('Setting loading to: ' + val);
    this.is_loading = val;
  }

}

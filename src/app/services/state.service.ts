import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  public is_loading: boolean = false;

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

}

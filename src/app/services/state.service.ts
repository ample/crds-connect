import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  public hasBrandBar: boolean = true;
  public is_loading: boolean = false;
  private mapOrListView: string = 'map';

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

  public setCurrentView(view: string) {
    this.mapOrListView = view;
  }

  public getCurrentView(): string {
    return this.mapOrListView;
  }
}

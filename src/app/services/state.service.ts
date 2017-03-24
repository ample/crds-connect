import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  public is_loading: boolean = false;
  private mapOrListView: string = 'map';
  private showingPinCount: number = 10;
  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  private myViewOrWorldView: string = 'world';

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

  public setCurrentView(view: string) {
    this.mapOrListView = view;
  }

  public getCurrentView(): string {
    return this.mapOrListView;
  }

  public setShowingPinCount(count: number) {
    this.showingPinCount = count;
  }

  public getShowingPinCount() {
    return this.showingPinCount;
  }

  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  public setMyViewOrWorldView(view: string) {
    this.myViewOrWorldView = view;
  }

  public getMyViewOrWorldView(): string {
    return this.myViewOrWorldView;
  }

}

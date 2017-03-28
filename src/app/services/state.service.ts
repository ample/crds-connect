import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  public is_loading: boolean = false;
  private mapOrListView: string = 'map';
  private showingPinCount: number = 10;
  private zoomToUse: number = -1;

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

  public setUseZoom(zoom: number) {
    this.zoomToUse = zoom;
  }

  public getUseZoom() {
    return this.zoomToUse;
  }
}

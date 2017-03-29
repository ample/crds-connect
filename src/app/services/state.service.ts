import { Injectable } from '@angular/core';
import { MapView } from '../models/map-view';

@Injectable()
export class StateService {

  public is_loading: boolean = false;
  private mapOrListView: string = 'map';
  private showingPinCount: number = 10;
  private zoomToUse: number = -1;
  private savedMapView: MapView;

  public setMapView(mv: MapView) {
    this.savedMapView = mv;
  }

  public getMapView() {
    return this.savedMapView;
  }

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

import { Component, Input, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { MiscellaneousService } from '../../services/miscellaneous-service';
import { NeighborsHelperService } from  '../../services/neighbors-helper.service';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-listview',
  templateUrl: 'list-view.component.html'
})
export class ListViewComponent implements OnInit {
  @Input() searchResults: PinSearchResultsDto;

  public showing_increment: number = 10;

  constructor(private miscellaneousService: MiscellaneousService,
              public neighborsHelperService: NeighborsHelperService,
              public stateService: StateService,
              private appSettings: AppSettingsService) {
  }

  public ngOnInit() {
    this.miscellaneousService.reEnableScrollingInCaseFauxdalDisabledIt();
    this.neighborsHelperService.changeEmitter.subscribe(() => {
      this.stateService.setShowingPinCount(10);
    });
  }

  public pinsToShow(): Pin[] {

    let showing: number = this.stateService.getShowingPinCount();

    if (this.searchResults == null) {
      return new Array<Pin>();
    }

    return this.searchResults.pinSearchResults.filter((item, index) => index < showing );

  }

  public pinsToShowCountings() {
    let showing: number = this.stateService.getShowingPinCount();
    if (this.searchResults && (this.searchResults.pinSearchResults.length < showing)) {
      showing = this.searchResults.pinSearchResults.length;
    }
    if (showing === 1) {
      return '1 result';
    } else {
      return showing + ' results';
    }
  }

  public showMore() {
    this.stateService.setShowingPinCount(this.stateService.getShowingPinCount() + this.showing_increment);
  }

  public isMyStuffView(): boolean {
    return this.stateService.getMyViewOrWorldView() === 'my';
  }

}

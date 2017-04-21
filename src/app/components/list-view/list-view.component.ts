import { Component, Input } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { NeighborsHelperService } from  '../../services/neighbors-helper.service';

@Component({
  selector: 'app-listview',
  templateUrl: 'list-view.component.html'
})
export class ListViewComponent {
  @Input() searchResults: PinSearchResultsDto;

  public showing_increment: number = 10;

  constructor(private neighborsHelperService: NeighborsHelperService,
              private stateService: StateService) {
    neighborsHelperService.changeEmitter.subscribe(() => {
      stateService.setShowingPinCount(10);
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

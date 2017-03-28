import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { UserLocationService } from  '../../services/user-location.service';
import { NeighborsHelperService } from  '../../services/neighbors-helper.service';

@Component({
  selector: 'app-listview',
  templateUrl: 'list-view.component.html'
})
export class ListViewComponent implements OnInit {
  @Input() searchResults: PinSearchResultsDto;

  public showing_increment: number = 10;

  constructor( private userLocationService: UserLocationService,
               private api: APIService,
               private neighborsHelperService: NeighborsHelperService,
               private stateService: StateService) {
    neighborsHelperService.changeEmitter.subscribe(() => {
      stateService.setShowingPinCount(10);
    });
  }

  public ngOnInit(): void {}

  public pinsToShow(): Pin[] {
    let showing: number = this.stateService.getShowingPinCount();
    return this.searchResults.pinSearchResults.filter((item, index) => index < showing )
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
}

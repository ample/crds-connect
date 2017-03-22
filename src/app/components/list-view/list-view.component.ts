import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { UserLocationService } from  '../../services/user-location.service';
import { NeighborsHelperService } from  '../../services/neighbors-helper.service';

@Component({
  selector: 'app-listview',
  templateUrl: 'list-view.component.html',
  styleUrls: ['list-view.component.css']
})
export class ListViewComponent implements OnInit {
  @Input() searchResults: PinSearchResultsDto;

  public showing_increment : number = 10;
  public showing : number = 10;

  constructor( private userLocationService: UserLocationService,
               private api: APIService,
               private neighborsHelperService: NeighborsHelperService) {
      neighborsHelperService.changeEmitter.subscribe(() => {
      this.showing = 10;
    })
  }

  public ngOnInit(): void {
    if (!this.searchResults) {
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
        }
      );
    };
  }

  public pinsToShow(): Pin[] {
    return this.searchResults.pinSearchResults.filter((item, index) => index < this.showing)
  }

  public showMore() {
    this.showing += this.showing_increment;
  }
}

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { UserLocationService } from  '../../services/user-location.service';

@Component({
  selector: 'app-listview',
  templateUrl: 'list-view.component.html'
})
export class ListViewComponent implements OnInit {
  @Input() searchResults: PinSearchResultsDto;

  constructor( private userLocationService: UserLocationService,
               private api: APIService) {}

  public ngOnInit(): void {
    console.log(this.searchResults);
    if (!this.searchResults) {
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          // this.api.getPinsAddressSearchResults('placeholder', pos.lat, pos.lng).subscribe(
          //   pinSearchResults => {
          //     let results: PinSearchResultsDto = pinSearchResults as PinSearchResultsDto;
          //     this.searchResults = results;
          //   }
          // );
        }
      );
    };
  }
}

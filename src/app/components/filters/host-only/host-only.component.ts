import { FilterService } from '../../../services/filter.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-host-only',
  templateUrl: './host-only.component.html',
  styleUrls: ['./host-only.component.scss']
})
export class HostOnlyComponent implements OnInit {
  public onlyShowHosts: boolean = false;
  constructor(private filterService: FilterService) { }

  ngOnInit() {
    this.onlyShowHosts = this.filterService.getIsHostOnlyFiltered();
  }

  public onClick(value: boolean) {
    this.onlyShowHosts = value;
    this.filterService.setFilterStringHostOnly(value);
  }

  public reset() {
    this.onlyShowHosts = false;
    this.filterService.setFilterStringHostOnly(this.onlyShowHosts);
  }

}

/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';

import { ListHelperService } from '../../services/list-helper.service';
import { MapFooterComponent } from './map-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';

describe('Component: Map Footer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapFooterComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ListHelperService,
        StateService,
        BlandPageService
      ]
    });
    this.fixture = TestBed.createComponent(MapFooterComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});




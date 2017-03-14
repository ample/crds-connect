/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';

import { ListHelperService } from '../../services/list-helper.service';
import { MapFooterComponent } from './map-footer.component';
import { RouterTestingModule } from '@angular/router/testing';

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
        ListHelperService
      ]
    });
    this.fixture = TestBed.createComponent(MapFooterComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});




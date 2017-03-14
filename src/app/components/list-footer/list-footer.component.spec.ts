/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'angular2-cookie/core';

import { ContentService } from '../../services/content.service';
import { ListHelperService } from '../../services/list-helper.service';
import { ListFooterComponent } from './list-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../services/session.service';

describe('Component: List Footer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListFooterComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ListHelperService,
        SessionService,
        CookieService,
        ContentService
      ]
    });
    this.fixture = TestBed.createComponent(ListFooterComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});




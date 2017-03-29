/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'angular2-cookie/core';

import { ContentService } from '../../services/content.service';
import { ListHelperService } from '../../services/list-helper.service';
import { ListFooterComponent } from './list-footer.component';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';

describe('Component: List Footer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListFooterComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([]),
        ContentBlockModule.forRoot({ category: 'main' })
      ],
      providers: [
        CookieService,
        ContentService,
        ListHelperService,
        LoginRedirectService,
        StateService,
        SessionService,
        BlandPageService
      ]
    });
    this.fixture = TestBed.createComponent(ListFooterComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});




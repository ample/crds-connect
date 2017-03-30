/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'angular2-cookie/core';

import { ListHelperService } from '../../services/list-helper.service';
import { ListFooterComponent } from './list-footer.component';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

describe('Component: List Footer', () => {
  let mockContentService;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);

    TestBed.configureTestingModule({
      declarations: [
        ListFooterComponent
      ],
      imports: [
        HttpModule,
        ContentBlockModule.forRoot({ categories: ['common'] }),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        CookieService,
        { provide: ContentService, useValue: mockContentService},
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




/* tslint:disable:no-unused-variable */
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationStart } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { PreloaderModule } from './preloader/preloader.module';
import { IFrameParentService } from './services/iframe-parent.service';
import { StateService } from './services/state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionService } from './services/session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2, Angulartics2GoogleTagManager, Angulartics2GoogleAnalytics, Angulartics2Segment } from 'angulartics2';
import { HeaderComponent } from './layout/header/header.component';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppSettingsService } from './services/app-settings.service';
import { APP_BASE_HREF } from '@angular/common';

describe('App: CrdsConnect', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      imports: [
        PreloaderModule,
        RouterTestingModule.withRoutes([]),
        HttpModule,
        JsonpModule,
        ReactiveFormsModule
      ],
      providers: [
        IFrameParentService,
        SessionService,
        CookieService,
        StateService,
        ContentService,
        Angulartics2,
        Angulartics2GoogleTagManager,
        Angulartics2GoogleAnalytics,
        Angulartics2Segment,
        ToastsManager,
        ToastOptions,
        AppSettingsService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should know that its in the connect flow', () => {
    let testAppRoute: string = 'connect';
    let testRoot: string = 'https://int.crossroads.net/';
    let testUrl: string = 'https://int.crossroads.net/connect/';
    let isConnectApp: boolean = component.isInSpecifiedApp(testAppRoute, testRoot, testUrl);

    expect(isConnectApp).toBe(true);
  });

  it('should know that its in the connect flow given redundant entries', () => {
    let testAppRoute: string = 'connect';
    let testRoot: string = 'https://int.crossroads.net/';
    let testUrl: string = 'https://int.crossroads.net/connect/connect';
    let isConnectApp: boolean = component.isInSpecifiedApp(testAppRoute, testRoot, testUrl);

    expect(isConnectApp).toBe(true);
  });


  it('should know that its in the groups flow', () => {
    let testAppRoute: string = 'groupsv2';
    let testUrl: string = 'https://int.crossroads.net/groupsv2/';
    let testRoot: string = 'https://int.crossroads.net/';
    let isInGroupsApp: boolean = component.isInSpecifiedApp(testAppRoute, testRoot, testUrl);

    expect(isInGroupsApp).toBe(true);
  });

  it('should know that its in the groups flow given redundant entries', () => {
    let testAppRoute: string = 'groupsv2';
    let testUrl: string = 'https://int.crossroads.net/groupsv2/groupsv2';
    let testRoot: string = 'https://int.crossroads.net/';
    let isInGroupsApp: boolean = component.isInSpecifiedApp(testAppRoute, testRoot, testUrl);

    expect(isInGroupsApp).toBe(true);
  });

  it('should remove fauxdal body classes', () => {
    // Start fresh...
    document.querySelector('body').classList.remove('fauxdal-open');

    expect(document.querySelector('body').classList).not.toContain('fauxdal-open');
    document.querySelector('body').classList.add('fauxdal-open');
    expect(document.querySelector('body').classList).toContain('fauxdal-open');

    let obj = new NavigationStart(123, '/something');
    component.removeFauxdalClasses(obj);
    expect(document.querySelector('body').classList).not.toContain('fauxdal-open');

    // Cleanup...
    document.querySelector('body').classList.remove('fauxdal-open');
  });

});

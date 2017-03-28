/* tslint:disable:no-unused-variable */
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { PreloaderModule } from './preloader/preloader.module';
import { IFrameParentService } from './services/iframe-parent.service';
import { StateService } from './services/state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionService } from './services/session.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2, Angulartics2GoogleTagManager } from 'angulartics2';
import { ContentService } from './services/content.service';
import { HeaderComponent } from './layout/header/header.component';

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
        Angulartics2GoogleTagManager
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

});

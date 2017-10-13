import { AppSettingsService } from '../../services/app-settings.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HeaderComponent } from './header.component';
import { Location } from '@angular/common';
import { MockComponent } from '../../shared/mock.component';
import { NavigationStart, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../services/state.service';

fdescribe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let comp: HeaderComponent;
  let el;
  let mockState, mockAppSettings, mockRouter, mockLocation;

  beforeEach(() => {
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockState.hasPageHeader = false;
    mockState.title = 'title';
    mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appsettings', ['a']);
    mockLocation = jasmine.createSpyObj<Location>('loc', ['back']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [
        HeaderComponent,
        MockComponent({ selector: 'app-map-footer', inputs: [] })
      ],
      providers: [
        { provide: StateService, useValue: mockState },
        { provide: AppSettingsService, useValue: mockAppSettings },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter create an instance', () => {
    spyOn(comp, 'listenForRouteChange');
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should changeRoute to a specific ', () => {
    comp.changeRoute('thisRoute');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['thisRoute']);
  });

  it('should changeRoute to location', () => {
    comp.changeRoute('BACK');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockLocation.back).toHaveBeenCalledTimes(1);
  });

  it('should init', () => {
    spyOn(comp, 'listenForRouteChange');
    comp.ngOnInit();
    expect(comp['listenForRouteChange']).toHaveBeenCalledTimes(1);
  });

});

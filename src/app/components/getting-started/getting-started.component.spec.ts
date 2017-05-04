import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { ElementRef, Renderer } from '@angular/core';
import { GettingStartedComponent } from './getting-started.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { StateService } from '../../services/state.service';

describe('Component: GettingStarted', () => {
  let fixture: ComponentFixture<GettingStartedComponent>;
  let comp: GettingStartedComponent;
  let mockStateService;

  beforeEach(() => {
    mockStateService = {constructor: jest.fn() };
    TestBed.configureTestingModule({
      declarations: [
        GettingStartedComponent
      ],
      providers: [
        { provide: StateService, useValue: mockStateService }
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(GettingStartedComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });
});

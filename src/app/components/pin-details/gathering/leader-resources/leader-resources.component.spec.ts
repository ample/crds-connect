/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';

import { LeaderResourcesComponent } from './leader-resources.component';

describe('LeaderResourcesComponent', () => {
  let fixture: ComponentFixture<LeaderResourcesComponent>;
  let comp: LeaderResourcesComponent;
  const mockRouter = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [
        LeaderResourcesComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(LeaderResourcesComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('LeaderResourcesComponent should exist', () => {
    expect(comp).toBeTruthy();
  });
});

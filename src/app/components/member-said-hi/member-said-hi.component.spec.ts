/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'angular2-select';

import { ContentService } from '../../services/content.service';
import { MemberSaidHiComponent } from './member-said-hi.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: Member Said Hi', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MemberSaidHiComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        ContentService
      ]
    });
    this.fixture = TestBed.createComponent(MemberSaidHiComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});


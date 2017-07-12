
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Angulartics2 } from 'angulartics2';
import 'rxjs/add/observable/of';
import { ToastsManager } from 'ng2-toastr';

import { EmailParticipantsComponent } from '../../components/email-participants/email-participants.component';


describe('Component: Map', () => {
      let mockToastr, mockAngulartics2;

  beforeEach(() => {

    mockToastr = jasmine.createSpyObj<ToastsManager>('toastr', ['success', 'error']);
    mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['constructor']);

    TestBed.configureTestingModule({
      declarations: [
        EmailParticipantsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ToastsManager, useValue: mockToastr },
        { provide: Angulartics2, useValue: mockAngulartics2 }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    this.fixture = TestBed.createComponent(EmailParticipantsComponent);
    this.component = this.fixture.componentInstance;

  });

  fit('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});

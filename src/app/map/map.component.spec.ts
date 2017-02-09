import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

import { MapComponent } from './map.component';

describe('Component: Map', () => {

  // let fixture: AuthenticationComponent,
  //     router: Router,
  //     redirectService: LoginRedirectService,
  //     stateService: StateService,
  //     store: StoreService,
  //     fb: FormBuilder,
  //     api: APIService;
  //
  // beforeEach(() => {
  //
  //   api = jasmine.createSpyObj<APIService>('api', ['getRegisteredUser', 'postLogin']);
  //   fb = new FormBuilder();
  //   router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
  //   stateService = jasmine.createSpyObj<StateService>(
  //     'stateService',
  //     [
  //       'getNextPageToShow',
  //       'getPrevPageToShow',
  //       'hidePage',
  //       'setLoading'
  //     ]
  //   );
  //   store = jasmine.createSpyObj<StoreService>(
  //     'store', [
  //       'loadUserData',
  //       'validateRoute'
  //     ]
  //   );
  //   fixture = new AuthenticationComponent(
  //     api,
  //     fb,
  //     router,
  //     redirectService,
  //     stateService,
  //     store
  //   );
  //   fixture.ngOnInit();
  // });
  //
  // function setForm( email, password ) {
  //   fixture.form.setValue({ email: email, password: password});
  // }

  // describe('#ngOnInit', () => {
  //   it('should initialize the component', () => {
  //     expect(fixture).toBeTruthy();
  //   });
  // });

});

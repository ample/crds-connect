/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DonationFundService } from '../services/donation-fund.service';
import { ExistingPaymentInfoService } from '../services/existing-payment-info.service';
import { StoreService } from '../services/store.service';
import { ParamValidationService } from '../services/param-validation.service';
import { AmountComponent } from './amount.component';
import { StateService } from '../services/state.service';
import { PaymentService } from '../services/payment.service';
import { LoginService } from '../services/login.service';
import { HttpClientService } from '../services/http-client.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Amount', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        ExistingPaymentInfoService,
        DonationFundService,
        StoreService,
        ParamValidationService,
        StateService,
        PaymentService,
        LoginService,
        HttpClientService,
        CookieService
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.store.type = 'payment';
    this.component.store.minPayment = 1;
    this.component.store.totalCost = 400;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect non-numeric values to invalidate', () => {

    this.component.onCustomAmount('034adfdf');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts higher than the total cost to invalidate', () => {

    this.component.onCustomAmount('400.01');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts lower than the total cost to validate', () => {

    this.component.onCustomAmount('399.99');
    expect(this.component.store.validAmount()).toBeTruthy();

  });

  it('should expect amounts higher than 999,999.99 to invalidate', () => {

    this.component.onCustomAmount('1000000');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

  it('should expect amounts with leading zeros to invalidate', () => {

    this.component.onCustomAmount('01');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

});

describe('Component: Donation', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        ExistingPaymentInfoService,
        DonationFundService,
        StoreService,
        ParamValidationService,
        StateService,
        LoginService,
        PaymentService,
        HttpClientService,
        CookieService
      ]
    });
    this.fixture = TestBed.createComponent(AmountComponent);
    this.component = this.fixture.componentInstance;

    this.component.store.type = 'donation';
    this.component.store.previousAmount = 53.17;
    this.component.store.fundId = 1;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should expect a valid amount to validate', () => {

    this.component.onCustomAmount('300.01');
    expect(this.component.store.validAmount()).toBeTruthy();

  });

  it('should expect an invalid amount to invalidate', () => {

    this.component.onCustomAmount('300.01adfdf');
    expect(this.component.store.validAmount()).toBeFalsy();

  });

});

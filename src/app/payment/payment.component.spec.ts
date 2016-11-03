/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from "@angular/forms";

import { PaymentComponent } from './payment.component';
import { GivingStore } from "../giving-state/giving.store";
import { GiftService } from "../services/gift.service";

class MockGivingStore { public subscribe() {}; }
class MockRouter { public navigate() {}; }

describe('Component: Payment', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule
      ],
      providers: [
        { provide: GivingStore, useClass: MockGivingStore },
        GiftService
      ]
    });
    this.fixture = TestBed.createComponent(PaymentComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
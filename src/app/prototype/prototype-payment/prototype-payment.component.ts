import { Component, Inject } from '@angular/core';
import { PrototypeStore } from '../prototype-state/prototype.store';
import * as PrototypeActions from '../prototype-state/prototype.action-creators';
import { PrototypeGiftService } from '../prototype-gift.service';

@Component({
  selector: 'app-prototype-payment',
  templateUrl: './prototype-payment.component.html',
  styleUrls: ['./prototype-payment.component.css']
})
export class PrototypePaymentComponent {

  constructor(@Inject(PrototypeStore) private store: any,
              private gift: PrototypeGiftService) {}

  back() {
    this.store.dispatch(PrototypeActions.render('details'));
    return false;
  }

  next() {
    this.store.dispatch(PrototypeActions.render('summary'));
    return false;
  }

}

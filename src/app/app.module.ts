import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PreloaderModule } from './preloader/preloader.module';

import { HostApplicationComponent } from './host-application/host-application.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent} from './register/register.component';

import { APIService } from './services/api.service';
import { IFrameParentService } from './services/iframe-parent.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { StoreService } from './services/store.service';
import { ContentService } from './services/content.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { FormatPaymentNumberDirective } from './directives/format-payment-number.directive';

@NgModule({
  imports: [
    AlertModule,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    BrowserModule,
    ButtonsModule,
    CollapseModule,
    CommonModule,
    DatepickerModule,
    HttpModule,
    PreloaderModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    HostApplicationComponent,
    AppComponent,
    AuthenticationComponent,
    CreditCardFormatDirective,
    CurrencyFormatDirective,
    CvvFormatDirective,
    ExpiryFormatDirective,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    RegisterComponent,
    FormatPaymentNumberDirective
  ],
  providers: [
    appRoutingProviders,
    ContentService,
    CookieService,
    APIService,
    IFrameParentService,
    SessionService,
    StateService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

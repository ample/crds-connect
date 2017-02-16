import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PreloaderModule } from './preloader/preloader.module';

import { HostApplicationComponent } from './host-application/host-application.component';
import { PinDetailsComponent } from './pin-details/pin-details.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent} from './register/register.component';

import { APIService } from './services/api.service';
import { ContentService } from './services/content.service';
import { IFrameParentService } from './services/iframe-parent.service';
import { LocationService } from './services/location.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { PinService } from './services/pin.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { StoreService } from './services/store.service';
import { UserLocationService } from './services/user-location.service';

import { PinResolver } from './resolves/pin-resolver.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { FormatPaymentNumberDirective } from './directives/format-payment-number.directive';

@NgModule({
  imports: [
    AlertModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
    }),
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
    MapComponent,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    PinDetailsComponent,
    RegisterComponent,
    FormatPaymentNumberDirective
  ],
  providers: [
    appRoutingProviders,
    ContentService,
    CookieService,
    APIService,
    IFrameParentService,
    LoginRedirectService,
    LocationService,
    PinService,
    PinResolver,
    SessionService,
    StateService,
    StoreService,
    UserLocationService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

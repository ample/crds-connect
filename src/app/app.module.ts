import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PreloaderModule } from './preloader/preloader.module';
import { SelectModule } from 'angular2-select';

import { HostApplicationComponent } from './components/host-application/host-application.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { GatheringComponent } from './components/pin-details/gathering/gathering.component';
import { GatheringRequestsComponent } from './components/pin-details/gathering/gathering-requests/gathering-requests.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ListFooterComponent } from './components/list-footer/list-footer.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { MapComponent } from './components/map/map.component';
import { MapContentComponent } from './components/map-content/map-content.component';
import { MapFooterComponent } from './components/map-footer/map-footer.component'
import { NowAPinComponent } from './components/now-a-pin/now-a-pin.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ParticipantsListComponent } from './components/pin-details/participants-list/participants-list.component';
import { ParticipantCardComponent } from './components/pin-details/participants-list/participant-card/participant-card.component';
import { PersonComponent } from './components/pin-details/person/person.component';
import { PinHeaderComponent } from './components/pin-details/pin-header/pin-header.component';
import { PinLoginActionsComponent } from './components/pin-details/pin-login-actions/pin-login-actions.component';
import { RegisterComponent} from './components/register/register.component';
import { ReadonlyAddressComponent } from './components/pin-details/readonly-address/readonly-address.component';
import { SayHiComponent } from './components/pin-details/say-hi/say-hi.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { AddMeToTheMapHelperService } from './services/add-me-to-map-helper.service'
import { APIService } from './services/api.service';
import { ContentService } from './services/content.service';
import { IFrameParentService } from './services/iframe-parent.service';
import { GoogleMapService } from './services/google-map.service';
import { GroupService } from './services/group.service';
import { LocationService } from './services/location.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { PinService } from './services/pin.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { StoreService } from './services/store.service';
import { UserLocationService } from './services/user-location.service';

import { PinResolver } from './route-resolvers/pin-resolver.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { FormatPaymentNumberDirective } from './directives/format-payment-number.directive';

import { LoggedInGuard } from './route-guards/logged-in-guard';

import { StateListResolver } from './route-resolvers/state-list-resolver';
import { UserDataResolver } from './route-resolvers/user-data-resolver';
import { MemberSaidHiComponent } from './components/member-said-hi/member-said-hi.component';

import { GoogleMapClusterDirective } from './directives/google-map-cluster.directive';

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
    SelectModule,
    routing
  ],
  declarations: [
    NowAPinComponent,
    MemberSaidHiComponent,
    AddMeToMapComponent,
    AddressFormComponent,
    HostApplicationComponent,
    AppComponent,
    AuthenticationComponent,
    CreditCardFormatDirective,
    CurrencyFormatDirective,
    CvvFormatDirective,
    ExpiryFormatDirective,
    GatheringComponent,
    GatheringRequestsComponent,
    ListViewComponent,
    ListFooterComponent,
    MapComponent,
    MapContentComponent,
    MapFooterComponent,
    NeighborsComponent,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    ParticipantsListComponent,
    ParticipantCardComponent,
    PersonComponent,
    PinDetailsComponent,
    PinHeaderComponent,
    PinLoginActionsComponent,
    RegisterComponent,
    ReadonlyAddressComponent,
    SayHiComponent,
    SearchBarComponent,
    FormatPaymentNumberDirective,
    GoogleMapClusterDirective
  ],
  providers: [
    AddMeToTheMapHelperService,
    appRoutingProviders,
    ContentService,
    CookieService,
    APIService,
    GoogleMapsAPIWrapper,
    GoogleMapService,
    GroupService,
    IFrameParentService,
    LoginRedirectService,
    LocationService,
    LoggedInGuard,
    PinService,
    PinResolver,
    SessionService,
    StateListResolver,
    StateService,
    StoreService,
    UserLocationService,
    UserDataResolver
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

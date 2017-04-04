import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

export class CustomOptions extends ToastOptions {
  animate = 'fade';
  dismiss = 'auto';
  showCloseButton = true;
  newestOnTop = true;
  // messageClass = '';
  // titleClass = '';
}

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { AlertModule, ButtonsModule, CollapseModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { PreloaderModule } from './preloader/preloader.module';
import { SelectModule } from 'angular2-select';

import { HeaderComponent } from './layout/header/header.component';

import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { BlandPageComponent } from './components/bland-page/bland-page.component'
import { CanvasMapOverlayComponent } from './components/canvas-map-overlay/canvas-map-overlay.component';
import { GatheringComponent } from './components/pin-details/gathering/gathering.component';
import { GatheringRequestsComponent } from './components/pin-details/gathering/gathering-requests/gathering-requests.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { InviteSomeoneComponent } from './components/pin-details/gathering/invite-someone/invite-someone.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ListFooterComponent } from './components/list-footer/list-footer.component';
import { ListHelperService } from './services/list-helper.service';
import { ListEntryComponent } from './components/list-entry/list-entry.component';
import { MapComponent } from './components/map/map.component';
import { MapContentComponent } from './components/map-content/map-content.component';
import { MapFooterComponent } from './components/map-footer/map-footer.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ParticipantsListComponent } from './components/pin-details/participants-list/participants-list.component';
import { ParticipantCardComponent } from './components/pin-details/participants-list/participant-card/participant-card.component';
import { PersonComponent } from './components/pin-details/person/person.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { PinHeaderComponent } from './components/pin-details/pin-header/pin-header.component';
import { PinLoginActionsComponent } from './components/pin-details/pin-login-actions/pin-login-actions.component';
import { ReadonlyAddressComponent } from './components/pin-details/readonly-address/readonly-address.component';
import { RegisterComponent} from './components/register/register.component';
import { SayHiComponent } from './components/pin-details/say-hi/say-hi.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchLocalComponent } from './components/search-local/search-local.component';

import { AddressService } from './services/address.service';
import { AddMeToTheMapHelperService } from './services/add-me-to-map-helper.service';
import { BlandPageService } from './services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { IFrameParentService } from './services/iframe-parent.service';
import { GatheringService } from './services/gathering.service'
import { GoogleMapService } from './services/google-map.service';
import { GroupService } from './services/group.service';
import { IPService } from './services/ip.service';
import { LocationService } from './services/location.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { NeighborsHelperService } from './services/neighbors-helper.service';
import { ParticipantService } from './services/participant.service';
import { PinLabelService } from './services/pin-label.service';
import { PinService } from './services/pin.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { StoreService } from './services/store.service';
import { UserLocationService } from './services/user-location.service';
import { SearchLocalService } from './services/search-local.service';

import { PinResolver } from './route-resolvers/pin-resolver.service';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { CurrencyFormatDirective } from './directives/currency-format.directive';
import { CvvFormatDirective } from './directives/cvv-format.directive';
import { ExpiryFormatDirective } from './directives/expiry-format.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { FormatPaymentNumberDirective } from './directives/format-payment-number.directive';

import { LoggedInGuard } from './route-guards/logged-in-guard';
import { BlandPageGuard } from './route-guards/bland-page-guard';
import { WhatsAHostGuard } from './route-guards/whats-a-host-guard';

import { UserDataResolver } from './route-resolvers/user-data-resolver';

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
    ToastModule.forRoot(),
    routing,
    ContentBlockModule.forRoot({ categories: Array('finder', 'main', 'common') })
  ],
  declarations: [
    AddMeToMapComponent,
    AddressFormComponent,
    AppComponent,
    AuthenticationComponent,
    BlandPageComponent,
    CanvasMapOverlayComponent,
    CreditCardFormatDirective,
    CurrencyFormatDirective,
    CvvFormatDirective,
    ExpiryFormatDirective,
    FormatPaymentNumberDirective,
    GatheringComponent,
    GatheringRequestsComponent,
    GettingStartedComponent,
    HeaderComponent,
    HostApplicationComponent,
    InviteSomeoneComponent,
    ListViewComponent,
    ListFooterComponent,
    ListEntryComponent,
    MapComponent,
    MapContentComponent,
    MapFooterComponent,
    NeighborsComponent,
    NoResultsComponent,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    ParticipantsListComponent,
    ParticipantCardComponent,
    PersonComponent,
    PinDetailsComponent,
    PinHeaderComponent,
    PinLoginActionsComponent,
    ReadonlyAddressComponent,
    RegisterComponent,
    SayHiComponent,
    SearchBarComponent,
    SearchLocalComponent,
    FormatPaymentNumberDirective,
    GoogleMapClusterDirective
  ],
  providers: [
    AddressService,
    AddMeToTheMapHelperService,
    appRoutingProviders,
    BlandPageGuard,
    BlandPageService,
    ContentService,
    CookieService,
    IPService,
    GatheringService,
    GoogleMapsAPIWrapper,
    GoogleMapService,
    GroupService,
    IFrameParentService,
    ListHelperService,
    LoginRedirectService,
    LocationService,
    LoggedInGuard,
    NeighborsHelperService,
    ParticipantService,
    PinLabelService,
    PinService,
    PinResolver,
    SearchLocalService,
    SessionService,
    StateService,
    StoreService,
    { provide: ToastOptions, useClass: CustomOptions },
    UserLocationService,
    UserDataResolver,
    WhatsAHostGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

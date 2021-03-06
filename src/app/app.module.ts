import { FinderContentBlockConfig } from './app.contentblock.config';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { CustomOptions } from './app.toast.options';
import { environment } from '../environments/environment';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { CookieModule } from 'ngx-cookie';
import { TextMaskModule } from 'angular2-text-mask';

import {
  Angulartics2Module,
  Angulartics2GoogleTagManager,
  Angulartics2GoogleAnalytics,
  Angulartics2Segment
} from 'angulartics2';
import {
  AlertModule,
  ButtonsModule,
  CollapseModule,
  DatepickerModule,
  AccordionModule,
  TimepickerModule,
  BsDropdownModule
} from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app-routing.module';

import { ClipboardModule } from 'ngx-clipboard';
import { PreloaderModule } from './preloader/preloader.module';
import { SelectModule } from 'ng-select';

import { HeaderComponent } from './layout/header/header.component';

import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { BlandPageComponent } from './components/bland-page/bland-page.component';
import { ContactLeaderComponent } from './components/contact-leader/contact-leader.component';
import { CreateGroupSummaryComponent } from './components/create-group/create-group-summary/create-group-summary.component';
import { CreateGroupPage1Component } from './components/create-group/page-1/create-group-page-1.component';
import { CreateGroupPage2Component } from './components/create-group/page-2/create-group-page-2.component';
import { CreateGroupPage3Component } from './components/create-group/page-3/create-group-page-3.component';
import { CreateGroupPage4Component } from './components/create-group/page-4/create-group-page-4.component';
import { CreateGroupPage5Component } from './components/create-group/page-5/create-group-page-5.component';
import { CreateGroupPage6Component } from './components/create-group/page-6/create-group-page-6.component';
import { CreateGroupPreviewComponent } from './components/create-group/preview/create-group-preview.component';
import { FiltersComponent } from './components/filters/filters.component';
import { KidsWelcomeComponent } from './components/filters/kids-welcome/kids-welcome.component';
import { AgeGroupsComponent } from './components/filters/age-groups/age-groups.component';
import { CategoryComponent } from './components/filters/category/category.component';

import { EmailParticipantsComponent } from './components/email-participants/email-participants.component';
import { EndGroupConfirmationComponent } from './components/pin-details/gathering/end-group/end-group-confirmation.component';
import { GatheringComponent } from './components/pin-details/gathering/gathering.component';
import { GatheringEditComponent } from './components/pin-details/gathering/edit/gathering-edit.component';
import { GatheringRequestsComponent } from './components/pin-details/gathering/gathering-requests/gathering-requests.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { GroupTypeComponent } from './components/filters/group-type/group-type.component';
import { HandleInviteComponent } from './components/handle-invite/handle-invite.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { HostOnlyComponent } from './components/filters/host-only/host-only.component';
import { InviteSomeoneComponent } from './components/pin-details/gathering/invite-someone/invite-someone.component';
import { AddSomeoneComponent } from './components/pin-details/gathering/add-someone/add-someone.component';
import { LeaderResourcesComponent } from './components/pin-details/gathering/leader-resources/leader-resources.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ListFooterComponent } from './components/list-footer/list-footer.component';
import { ListHelperService } from './services/list-helper.service';
import { ListEntryComponent } from './components/list-entry/list-entry.component';
import { MapComponent } from './components/map/map.component';
import { MapContentComponent } from './components/map-content/map-content.component';
import { MapFooterComponent } from './components/map-footer/map-footer.component';
import { MeetingDayComponent } from './components/filters/meeting-day/meeting-day.component';
import { MeetingFrequencyComponent } from './components/filters/meeting-frequency/meeting-frequency.component';
import { MeetingTimeComponent } from './components/filters/meeting-time/meeting-time.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { OnlineOrPhysicalGroupComponent } from './components/filters/online-or-physical-group/online-or-physical-group.component';
import { ParticipantDetailsComponent } from './components/pin-details/gathering/participant-details/participant-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ParticipantCardComponent } from './components/pin-details/gathering/participant-card/participant-card.component';
import { ParticipantRemoveComponent } from './components/pin-details/gathering/participant-remove/participant-remove.component';
import { PersonComponent } from './components/pin-details/person/person.component';
import { PersonEditComponent } from './components/pin-details/person/edit/person-edit.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { PinHeaderComponent } from './components/pin-details/pin-header/pin-header.component';
import { PinLoginActionsComponent } from './components/pin-details/pin-login-actions/pin-login-actions.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { ReadonlyAddressComponent } from './components/pin-details/readonly-address/readonly-address.component';
import { RegisterComponent } from './components/register/register.component';
import { SayHiComponent } from './components/pin-details/say-hi/say-hi.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LocationBarComponent } from './components/search-bar/location-bar/location-bar.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchLocalComponent } from './components/search-local/search-local.component';
import { StuffNotFoundComponent } from './components/stuff-not-found/stuff-not-found.component';
import { TryGroupRequestConfirmationComponent } from './components/try-group/try-group-request-confirmation/try-group-request-confirmation.component';
import { RemovePersonPinComponent } from './components/pin-details/person/remove-person-pin/remove-person-pin.component';
import { CreateGroupFooterComponent } from './components/create-group/create-group-footer/create-group-footer.component';

import { AddressService } from './services/address.service';
import { AppSettingsService } from './services/app-settings.service';
import { AnalyticsService } from './services/analytics.service';
import { BlandPageService } from './services/bland-page.service';
import { ContentService, ContentBlockConfig } from 'crds-ng2-content-block';
import { CreateGroupService } from './components/create-group/create-group-data.service';
import { FilterService } from './services/filter.service';
import { SiteAddressService } from './services/site-address.service';
import { GoogleMapService } from './services/google-map.service';
import { GroupInquiryService } from './services/group-inquiry.service';
import { IPService } from './services/ip.service';
import { GeoLocationService } from './services/geo-location.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { LookupService } from './services/lookup.service';
import { MiscellaneousService } from './services/miscellaneous-service';
import { NeighborsHelperService } from './services/neighbors-helper.service';
import { ParticipantService } from './services/participant.service';
import { PinCollectionProcessingService } from './services/pin-collection-processing.service';
import { PinLabelService } from './services/pin-label.service';
import { PinService } from './services/pin.service';
import { ProfileService } from './services/profile.service';
import { SessionService } from './services/session.service';
import { StateService } from './services/state.service';
import { SayHiService } from './services/say-hi.service';
import { StoreService } from './services/store.service';
import { UserLocationService } from './services/user-location.service';
import { SearchService } from './services/search.service';

import { DetailedUserDataResolver } from './route-resolvers/detailed-user-data-resolver';
import { GroupResolver } from './route-resolvers/group-resolver';
import { PinResolver } from './route-resolvers/pin-resolver.service';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { GoogleMapClusterDirective } from './directives/google-map-cluster.directive';
import { OnlyTheseKeysDirective } from './directives/only-these-keys.directive';
import { UtcTimeFormatPipe } from './pipes/utc-time-format.pipe';
import { StripTagsPipe } from './pipes/strip-tags.pipe';

import { BlandPageGuard } from './route-guards/bland-page-guard';
import { GroupLeaderGuard } from './route-guards/group-leader.guard';
import { GroupLeaderApprovedGuard } from './route-guards/group-leader-approved.guard';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { HostNextStepsGuard } from './route-guards/host-next-steps-guard';
import { PageNotFoundGuard } from './route-guards/page-not-found-guard';
import { WhatsAHostGuard } from './route-guards/whats-a-host-guard';

import { SocialMediaComponent } from './components/pin-details/gathering/social-media/social-media.component';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    AlertModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
    }),
    RouterModule.forRoot(appRoutingProviders),
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager, Angulartics2GoogleAnalytics, Angulartics2Segment]),
    BrowserModule,
    BrowserAnimationsModule,
    ButtonsModule,
    CollapseModule,
    CommonModule,
    CookieModule.forRoot(),
    DatepickerModule,
    HttpModule,
    ClipboardModule,
    PreloaderModule,
    ReactiveFormsModule,
    FormsModule,
    AccordionModule.forRoot(),
    SelectModule,
    TextMaskModule,
    ToastModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    routing,
    ContentBlockModule
  ],
  declarations: [
    AddMeToMapComponent,
    AddressFormComponent,
    AppComponent,
    AuthenticationComponent,
    BlandPageComponent,
    ClickOutsideDirective,
    ContactLeaderComponent,
    CreateGroupSummaryComponent,
    CreateGroupPage1Component,
    CreateGroupPage2Component,
    CreateGroupPage3Component,
    CreateGroupPage4Component,
    CreateGroupPage5Component,
    CreateGroupPage6Component,
    CreateGroupPreviewComponent,
    EmailParticipantsComponent,
    EndGroupConfirmationComponent,
    FiltersComponent,
    KidsWelcomeComponent,
    AgeGroupsComponent,
    CategoryComponent,
    GatheringComponent,
    GatheringEditComponent,
    GatheringRequestsComponent,
    GettingStartedComponent,
    GroupTypeComponent,
    HandleInviteComponent,
    HeaderComponent,
    HostApplicationComponent,
    InviteSomeoneComponent,
    AddSomeoneComponent,
    ListViewComponent,
    ListFooterComponent,
    ListEntryComponent,
    LocationBarComponent,
    MapComponent,
    MapContentComponent,
    MapFooterComponent,
    MeetingDayComponent,
    MeetingFrequencyComponent,
    MeetingTimeComponent,
    NeighborsComponent,
    NoResultsComponent,
    OnlineOrPhysicalGroupComponent,
    OnlyTheseKeysDirective,
    PageNotFoundComponent,
    ParticipantCardComponent,
    ParticipantDetailsComponent,
    ParticipantRemoveComponent,
    PersonComponent,
    PersonEditComponent,
    PinDetailsComponent,
    PinHeaderComponent,
    PinLoginActionsComponent,
    ProfilePictureComponent,
    ReadonlyAddressComponent,
    RegisterComponent,
    RemovePersonPinComponent,
    SayHiComponent,
    SearchBarComponent,
    SearchFilterComponent,
    SearchLocalComponent,
    StuffNotFoundComponent,
    TryGroupRequestConfirmationComponent,
    LeaderResourcesComponent,
    GoogleMapClusterDirective,
    CreateGroupFooterComponent,
    SocialMediaComponent,
    UtcTimeFormatPipe,
    HostOnlyComponent,
    StripTagsPipe
  ],
  providers: [
    AddressService,
    AppSettingsService,
    appRoutingProviders,
    AnalyticsService,
    BlandPageGuard,
    BlandPageService,
    ContentService,
    { provide: ContentBlockConfig, useClass: FinderContentBlockConfig },
    CreateGroupService,
    DetailedUserDataResolver,
    GroupResolver,
    IPService,
    SiteAddressService,
    FilterService,
    GoogleMapsAPIWrapper,
    GoogleMapService,
    GroupLeaderGuard,
    GroupLeaderApprovedGuard,
    Angulartics2GoogleAnalytics,
    Angulartics2Segment,
    GeoLocationService,
    GroupInquiryService,
    ListHelperService,
    LoginRedirectService,
    LoggedInGuard,
    LookupService,
    MiscellaneousService,
    NeighborsHelperService,
    ParticipantService,
    PinLabelService,
    PinCollectionProcessingService,
    PageNotFoundGuard,
    PinService,
    PinResolver,
    ProfileService,
    SayHiService,
    SearchService,
    SessionService,
    StateService,
    StoreService,
    StripTagsPipe,
    { provide: ToastOptions, useClass: CustomOptions },
    UserLocationService,
    UserDataResolver,
    WhatsAHostGuard,
    HostNextStepsGuard,
    UtcTimeFormatPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

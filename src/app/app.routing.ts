import {
  ParticipantDetailsComponent
} from './components/pin-details/gathering/participant-details/participant-details.component';
import { StuffNotFoundComponent } from './components/stuff-not-found/stuff-not-found.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
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
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { MapComponent } from './components/map/map.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TryGroupRequestConfirmationComponent } from './components/try-group/try-group-request-confirmation/try-group-request-confirmation.component';
import { TryGroupRequestSuccessComponent } from './components/try-group/try-group-request-success/try-group-request-success.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { HandleInviteComponent } from './components/handle-invite/handle-invite.component';
import { PersonEditComponent } from './components/pin-details/person/edit/person-edit.component';
import { GatheringEditComponent } from './components/pin-details/gathering/edit/gathering-edit.component';
import { RemovePersonPinComponent } from './components/pin-details/person/remove-person-pin/remove-person-pin.component';
import { ParticipantRemoveComponent } from './components/pin-details/gathering/participant-remove/participant-remove.component';

import { DetailedUserDataResolver } from './route-resolvers/detailed-user-data-resolver';
import { PinResolver } from './route-resolvers/pin-resolver.service';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

import { BlandPageGuard } from './route-guards/bland-page-guard';
import { GroupLeaderGuard } from './route-guards/group-leader.guard';
import { GroupLeaderApprovedGuard } from './route-guards/group-leader-approved.guard';
import { HostNextStepsGuard } from './route-guards/host-next-steps-guard';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { WhatsAHostGuard } from './route-guards/whats-a-host-guard';



import { PageNotFoundGuard } from './route-guards/page-not-found-guard';

const appRoutes: Routes = [
  { path: '', component: NeighborsComponent },
  {
    path: 'add-me-to-the-map',
    component: AddMeToMapComponent,
    canActivate: [
      LoggedInGuard
    ],
    resolve: {
      userData: UserDataResolver
    }
  }, {
    path: 'accept-invite/:groupId/:guid',
    component: HandleInviteComponent,
    canActivate: [
      LoggedInGuard,
    ],
    data: [{
      accept: true
    }]
  }, {
    path: 'create-group',
    canActivate: [
      LoggedInGuard,
      GroupLeaderApprovedGuard
    ],
    children: [
      {
        path: '',
        component: CreateGroupSummaryComponent
      },
      {
        path: 'page-1',
        component: CreateGroupPage1Component
      },
      {
        path: 'page-2',
        component: CreateGroupPage2Component
      },
      {
        path: 'page-3',
        component: CreateGroupPage3Component
      },
      {
        path: 'page-4',
        component: CreateGroupPage4Component
      },
      {
        path: 'page-5',
        component: CreateGroupPage5Component
      },
      {
        path: 'page-6',
        component: CreateGroupPage6Component
      },
      {
        path: 'preview',
        component: CreateGroupPreviewComponent
      }
    ]
  }, {
    path: 'try-group-request-confirmation/:groupId',
    component: TryGroupRequestConfirmationComponent,
    canActivate: [
      LoggedInGuard
    ]
  }, {
    path: 'try-group-request-success/:groupId',
    component: TryGroupRequestSuccessComponent,
    canActivate: [
      LoggedInGuard
    ]
  }, {
    path: 'contact-leader/:groupId',
    component: ContactLeaderComponent,
    canActivate: [
      LoggedInGuard,
    ]
  }, {
    path: 'decline-invite/:groupId/:guid',
    component: HandleInviteComponent,
    canActivate: [
      LoggedInGuard,
    ],
    data: [{
      accept: false
    }]
  }, {
    path: 'invite-declined',
    component: BlandPageComponent,
    canActivate: [
      BlandPageGuard
    ]
  }, {
    path: 'invite-accepted',
    component: BlandPageComponent,
    canActivate: [
      BlandPageGuard,
    ]
  }, {
    path: 'add',
    redirectTo: '/add-me-to-the-map',
    pathMatch: 'full'
  },
  {
    path: 'error',
    component: BlandPageComponent,
    canActivate: [
      BlandPageGuard
    ],
    data: [{
      isFauxdal: true
    }]
  },
  {
    path: 'success',
    component: BlandPageComponent,
    canActivate: [
      BlandPageGuard
    ],
    data: [{
      isFauxdal: true
    }]
  },
  {
    path: 'host-signup',
    component: HostApplicationComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      userData: DetailedUserDataResolver
    }
  },
  { path: 'groups-not-found', component: StuffNotFoundComponent },
  { path: 'connections-not-found', component: StuffNotFoundComponent },
  { path: 'neighbors', component: NeighborsComponent },
  { path: 'no-results', component: NoResultsComponent },
  {
    path: 'remove-person-pin/:participantId',
    component: RemovePersonPinComponent,
    resolve: {
      pin: PinResolver
    }
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent,
  },
  {
    path: 'host-next-steps',
    component: BlandPageComponent,
    canActivate: [
      HostNextStepsGuard
    ]
  },
  {
    path: 'whats-a-host',
    component: BlandPageComponent,
    canActivate: [
      WhatsAHostGuard
    ],
    data: [{
      isFauxdal: true
    }]
  },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'gathering/:groupId',
    component: PinDetailsComponent,
    resolve: {
      pin: PinResolver,
      user: UserDataResolver
    }
  }, {
    path: 'small-group/:groupId',
    component: PinDetailsComponent,
    resolve: {
      pin: PinResolver,
      user: UserDataResolver
    }
  }, {
    path: 'small-group/:groupId/:approved/:trialMemberId',
    component: PinDetailsComponent,
    resolve: {
      pin: PinResolver,
      user: UserDataResolver
    },
    canActivate: [LoggedInGuard, GroupLeaderGuard]
  }, {
    path: 'small-group/:groupId/participant-detail/:groupParticipantId',
    component: ParticipantDetailsComponent,
    canActivate: [LoggedInGuard, GroupLeaderGuard]
  }, {
    path: 'small-group/:groupId/participant-detail/:groupParticipantId/remove-self/:removeSelf',
    component: ParticipantRemoveComponent,
    canActivate: [LoggedInGuard]
  }, {
    path: 'small-group/:groupId/participant-detail/:groupParticipantId/remove',
    component: ParticipantRemoveComponent,
    canActivate: [LoggedInGuard, GroupLeaderGuard]
  }, {
    path: 'gathering/:groupId/participant-detail/:groupParticipantId/remove',
    component: ParticipantRemoveComponent,
    canActivate: [LoggedInGuard, GroupLeaderGuard]
  }, {
    path: 'gathering/:groupId/participant-detail/:groupParticipantId',
    component: ParticipantDetailsComponent,
    canActivate: [LoggedInGuard, GroupLeaderGuard]
  }, {
    path: 'gathering/:groupId/edit',
    component: GatheringEditComponent,
    resolve: {
      pin: PinResolver
    },
    canActivate: [LoggedInGuard]
  },
  {
    path: 'person/:participantId',
    component: PinDetailsComponent,
    resolve: {
      pin: PinResolver,
      user: UserDataResolver
    }
  }, {
    path: 'person/:participantId/edit',
    component: PersonEditComponent,
    resolve: {
      pin: PinResolver
    }
  },
  { path: 'register', component: RegisterComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: '**', canActivate: [PageNotFoundGuard], component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

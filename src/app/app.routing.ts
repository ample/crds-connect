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
import { FiltersComponent } from './components/filters/filters.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { MapComponent } from './components/map/map.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
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
    component: CreateGroupSummaryComponent,
    canActivate: [
      LoggedInGuard,
      GroupLeaderApprovedGuard
    ]
  }, {
    path: 'create-group/page-1',
    component: CreateGroupPage1Component,
    canActivate: [
      LoggedInGuard,
      GroupLeaderApprovedGuard
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
  { path: 'stuff-not-found', component: StuffNotFoundComponent },
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

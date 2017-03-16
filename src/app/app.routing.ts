import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { BlandPageComponent } from './components/bland-page/bland-page.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { MapComponent } from './components/map/map.component';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { NowAPinComponent } from './components/now-a-pin/now-a-pin.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { WhatsAHostComponent } from  './components/whats-a-host/whats-a-host.component';

import { PinResolver } from './route-resolvers/pin-resolver.service';
import { UserDataResolver } from './route-resolvers/user-data-resolver';
import { MemberSaidHiComponent } from './components/member-said-hi/member-said-hi.component';

const appRoutes: Routes = [
  { path: '', component: NeighborsComponent },
  { path: 'add-me-to-the-map',
    component: AddMeToMapComponent,
    canActivate: [
      LoggedInGuard
    ],
    resolve: {
      userData: UserDataResolver
    }
  },
  { path: 'error', component: BlandPageComponent },
  { path: 'success', component: BlandPageComponent },
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'map', component: NeighborsComponent },
  { path: 'member-said-hi', component: MemberSaidHiComponent },
  { path: 'neighbors', component: NeighborsComponent },
  { path: 'no-results', component: NoResultsComponent },
  { path: 'now-a-pin', component: NowAPinComponent },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'whats-a-host', component: WhatsAHostComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pin-details/:participantId',
    component: PinDetailsComponent,
    resolve:  {
      pin: PinResolver,
      user: UserDataResolver
    }
  },
  { path: 'register', component: RegisterComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

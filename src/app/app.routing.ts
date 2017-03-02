import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeToMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { NeighborsComponent } from './components/neighbors/neighbors.component';
import { MapComponent } from './components/map/map.component';
import { NowAPinComponent } from './components/now-a-pin/now-a-pin.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PinDetailsComponent } from './components/pin-details/pin-details.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { PinResolver } from './route-resolvers/pin-resolver.service';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

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
  { path: 'now-a-pin', component: NowAPinComponent },
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'map', component: MapComponent },
  { path: 'pin-details/:participantId',
    component: PinDetailsComponent,
    resolve:  {
      pin: PinResolver,
      user: UserDataResolver
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

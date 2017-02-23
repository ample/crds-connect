import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeToMapMapComponent } from './components/add-me-to-map/add-me-to-map.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HostApplicationComponent } from './components/host-application/host-application.component';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { MapComponent } from './components/map/map.component';
import { NowAPinComponent } from './components/now-a-pin/now-a-pin.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PinDetailsComponent } from './pin-details/pin-details.component';
import { RegisterComponent } from './register/register.component';

import { PinResolver } from './route-resolvers/pin-resolver.service';
import { StateListResolver } from './route-resolvers/state-list-resolver';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

const appRoutes: Routes = [
  { path: '', component: MapComponent },
  { path: 'add-me-to-the-map',
    component: AddMeToMapMapComponent,
    canActivate: [
      LoggedInGuard
    ],
    resolve: {
      userData: UserDataResolver,
      stateList: StateListResolver
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
      pin: PinResolver
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeToMapMapComponent } from './add-me-to-map/add-me-to-map.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HostApplicationComponent } from './host-application/host-application.component';
import { LoggedInGuard } from './route-guards/logged-in-guard';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { RegisterComponent } from './register/register.component';

import { StateListResolver } from './route-resolvers/state-list-resolver';
import { UserDataResolver } from './route-resolvers/user-data-resolver';

const appRoutes: Routes = [
  { path: '', component: AddMeToMapMapComponent },
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
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'map', component: MapComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

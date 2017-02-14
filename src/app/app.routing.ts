import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HostApplicationComponent } from './host-application/host-application.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MapComponent } from './map/map.component';
import { RegisterComponent } from './register/register.component';
import { PersonDetailsComponent } from './person-details/person-details.component';

const appRoutes: Routes = [
  { path: '', component: MapComponent },
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'map', component: MapComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

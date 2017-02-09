import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HostApplicationComponent } from './host-application/host-application.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MapComponent } from './map/map.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [
  { path: '', component: HostApplicationComponent },
  { path: 'host-signup', component: HostApplicationComponent },
  { path: 'signin', component: AuthenticationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'map', component: MapComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

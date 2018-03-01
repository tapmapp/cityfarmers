import { Routes, CanActivate } from '@angular/router';

import { ContactComponent } from './components/contact';
import { ChartComponent } from './components/chart';
import { FarmerComponent } from './components/farmer';
import { FarmersComponent } from './components/farmers';
import { FarmerInfoComponent } from './components/farmer-info';
import { FarmsComponent } from './components/farms';
import { FarmInfoComponent } from './components/farm-info';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { FarmComponent } from './components/farm';

// AUTH GARD SERVICE
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'farmer', component: FarmerComponent, canActivate: [AuthGuardService] },
  { path: 'farmers', component: FarmersComponent, canActivate: [AuthGuardService] },
  { path: 'farmers/:farmerId', component: FarmerInfoComponent, canActivate: [AuthGuardService] },
  { path: 'farm/:farmId', component: FarmComponent, canActivate: [AuthGuardService] },
  { path: 'farms', component: FarmsComponent, canActivate: [AuthGuardService] },
  { path: 'farms/:farmId', component: FarmInfoComponent, canActivate: [AuthGuardService] }
];

import { Routes, CanActivate } from '@angular/router';
import { HomeComponent } from './components/home';
import { ChartComponent } from './components/chart';
import { FarmerComponent } from './components/farmer';
import { FarmersComponent } from './components/farmers';
import { FarmsComponent } from './components/farms';
import { LoginComponent } from './components/login';
import { FarmComponent } from './components/farm';

// AUTH GARD SERVICE
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'farmer', component: FarmerComponent, canActivate: [AuthGuardService] },
  { path: 'farmers', component: FarmersComponent, canActivate: [AuthGuardService] },
  { path: 'farms', component: FarmsComponent, canActivate: [AuthGuardService] },
  { path: 'farm/:farmId', component: FarmComponent, canActivate: [AuthGuardService] },
];

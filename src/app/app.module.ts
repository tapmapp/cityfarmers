import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

// CHART LIBRARY
import { ChartsModule } from 'ng2-charts';

// LOCAL STORAGE
import { LocalStorageModule } from 'angular-2-local-storage';

// COMPONENTS
import { AppComponent } from './app.component';
import { ContactComponent } from './components/contact';
import { ChartComponent } from './components/chart';
import { FarmerComponent } from './components/farmer';
import { FarmersComponent } from './components/farmers';
import { FarmComponent } from './components/farm';
import { FarmInfoComponent } from './components/farm-info';
import { FarmsComponent } from './components/farms';
import { FarmerInfoComponent } from './components/farmer-info';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { HowItWorksComponent } from './components/how-it-works';
import { HomeComponent } from './components/home';
import { HomeNavComponent } from './components/home-nav';
import { LoginComponent } from './components/login';
import { SocketComponent } from './components/socket';

// SERVICES
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { ChartService } from './services/chart/chart.service';
import { EnvironmentService } from './services/environment/environment.service';
import { FarmService } from './services/farm/farm.service';
import { FormatValueService } from './services/format-value/format-value.service';
import { FarmerService } from './services/farmer/farmer.service';
import { LoginService } from './services/login/login.service';
import { NoteService } from './services/note/note.service';
import { SocketService } from './services/socket/socket.service';
import { TokenService } from './services/token/token.service';

// ROUTES
import { ROUTES } from './app.routes';

// STYLES
import '../assets/css/styles.css';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ContactComponent,
    ChartComponent,
    FarmerComponent,
    FarmersComponent,
    FarmComponent,
    FarmsComponent,
    FarmInfoComponent,
    FarmerInfoComponent,
    FooterComponent,
    HeaderComponent,
    HowItWorksComponent,
    HomeComponent,
    HomeNavComponent,
    LoginComponent,
    SocketComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpModule,
    SocketIoModule,
    LocalStorageModule.withConfig({
        prefix: 'cityfarmers-app',
        storageType: 'localStorage'
    }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    AuthGuardService,
    ChartService,
    EnvironmentService,
    FarmService,
    FormatValueService,
    FarmerService,
    LoginService,
    NoteService,
    SocketService,
    TokenService
  ]
})
export class AppModule {

  constructor() {}

}
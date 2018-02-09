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
import { ChartComponent } from './components/chart';
import { FarmerComponent } from './components/farmer';
import { HeaderComponent } from './components/header';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { FarmComponent } from './components/farm';
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
import '../styles.css';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ChartComponent,
    FarmerComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    FarmComponent,
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
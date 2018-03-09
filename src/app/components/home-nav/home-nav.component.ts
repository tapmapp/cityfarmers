import { Component, OnInit } from '@angular/core';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'home-nav-app',
  providers: [],
  styleUrls: [ './home-nav.component.css' ],
  templateUrl: './home-nav.component.html'
})
export class HomeNavComponent {

  farmerName: string;
  farmerId: string;

  constructor(
    private loginService: LoginService,
    private localStorage: LocalStorageService) {
    if(this.localStorage.get('farmerName') !== null && this.localStorage.get('farmerId') !== null) {
      this.farmerName = this.localStorage.get('farmerName').toString();
      this.farmerId = this.localStorage.get('farmerId').toString();
    }
  }

  // LOG OUT
  logOut() {
    this.loginService.logOut();
  }

}

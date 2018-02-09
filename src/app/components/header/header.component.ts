import { Component, OnInit } from '@angular/core';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'header',
  providers: [],
  styleUrls: [ './header.component.css' ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  farmerName: string;
  farmerId: string;

  constructor(
    private loginService: LoginService,
    private localStorage: LocalStorageService) {

    this.farmerName = this.localStorage.get('farmerName');
    this.farmerId = this.localStorage.get('farmerId');

  }

  // LOG OUT
  logOut() {
    this.loginService.logOut();
  }

}

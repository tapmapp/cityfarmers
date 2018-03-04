import { Component, OnInit } from '@angular/core';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'home-nav-app',
  providers: [],
  styleUrls: [ './home-nav.component.css' ],
  templateUrl: './home-nav.component.html'
})
export class HomeNavComponent {

  farmerName: string;
  farmerId: string;

  constructor(private localStorage: LocalStorageService) {
    this.farmerName = this.localStorage.get('farmerName').toString();
    this.farmerId = this.localStorage.get('farmerId').toString();
  }

}

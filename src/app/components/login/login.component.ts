import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { LoginService } from '../../services/login/login.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'login',
  providers: [],
  styleUrls: [ './login.component.css' ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  error: string = '';

  activeEmail: boolean = false;
  activePassword: boolean = false;

  newEmail: string;
  newPassword: string;

  errorData: Observable<any>;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private loginService: LoginService) {

    if(localStorage.getItem('cityfarmers-app.token')) {
      this.router.navigate(['farmer']);
    }

  }

  // FOCUS EMAIL FUNCTION
  focusEmail() {
    this.activeEmail = true;
  }

  // FOCUS OUT EMAIL FUNCTION
  focusOutEmail() {
    if(this.email.length == 0) {
      this.activeEmail = false;
    } 
  }
  
  // FOCUS PASSWORD FUNCTION
  focusPassword() {
    this.activePassword = true;
  }
  
  // FOCUS OUT PASSWORD FUNCTION
  focusOutPassword() {
    if(this.password.length == 0) {
      this.activePassword = false;
    } 
  }

  logIn(event) {
    if((event.keyCode == 13 || event.type == 'click') && (this.email.length > 0 && this.password.length > 0)) {
      this.loginService.logIn(this.email, this.password);
    }
  }

  ngOnInit() {
    
    // ERROR DATA SUBSCRIBER
    this.errorData = this.loginService.error;
    this.errorData.subscribe(data => {
        this.error = data;
    });

  }

}

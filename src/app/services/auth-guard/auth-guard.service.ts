import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Location } from '@angular/common';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private location: Location,
    private localStorage: LocalStorageService,
    private router: Router) {}

  canActivate(): boolean {

    if(!this.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    } 
    
    return true;

  }

  public isAuthenticated(): boolean {

    const token = this.localStorage.get('token');

    if(token) {
      return true;
    } 
    return false;
    
  }
  
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// INTERFACES
import { Farmer } from '../../interfaces/farmer';

@Injectable()
export class TokenService {

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<string>;
    private _error: BehaviorSubject<string>;
    private errorStore: { error: string };

    constructor(
        private route: Router,
        private localStorage: LocalStorageService) {}

    
    clearToken() {

        this.localStorage.remove('token');
        this.localStorage.remove('farmerId');
        this.localStorage.remove('farmerName');

        // REDIRECT TO LOGIN
        this.route.navigate(['login']);

    }

    setToken(response: any) {

        // SET TOKEN
        this.localStorage.set('token', response.token);
        this.localStorage.set('farmerId', response.farmerId);
        this.localStorage.set('farmerName', response.farmerName);

        // NAVIGATE TO FARMER FARM
        this.route.navigate(['farmer']);

    }

}
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// SERVICES
import { TokenService } from '../token/token.service';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// ENVIRONMENT
//import { Environment } from '../../environment.ts';

@Injectable()
export class LoginService {

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<string>;
    private _error: BehaviorSubject<string>;
    private errorStore: { error: '' };

    constructor(
        private http: Http,
        private localStorage: LocalStorageService,
        private tokenService: TokenService) {

        // ERROR INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();

    }

    // GET CSRF TOKEN
    logIn(email: string, password: string) {

        // TRADE API URL
        //let loginUrl = Environment.environment.apiUrl + '/farmer/login';
        let loginUrl = 'https://cityfarmers-api.herokuapp.com/farmer/login';

        this.http.post(loginUrl, { email: email, password: password }).subscribe(data => {
 
            if(data.status == 200) {

                var response = JSON.parse(data.text());

                // SET TOKEN SESSION AND NAVIGATE TO FARMER PROFILE
                this.tokenService.setToken(response);

            }

        }, err => {
            
            if(err.status == 401) {

                var error = JSON.parse(err.text());
                this.errorStore.error = error.message;  
                this._error.next(this.errorStore.error);
                
            }

        });

    }

    logOut() {

        // CLEAR TOKEN AND NAVIGATE TO LOGIN
        this.tokenService.clearToken();

    }

}
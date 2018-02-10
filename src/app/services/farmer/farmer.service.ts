import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// SERVICE
import { TokenService } from '../token/token.service'; 

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// INTERFACES
import { Farmer } from '../../interfaces/farmer';

@Injectable()
export class FarmerService {

    // FARM OBSERVABLE SERVICE CONFIGURATION VARIABLES
    farmer: Observable<Array<Farmer>>;
    private _farmer: BehaviorSubject<Array<Farmer>>;
    private farmerStore: { farmer: Array<Farmer> };

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<string>;
    private _error: BehaviorSubject<string>;
    private errorStore: { error: string };

    constructor(
        private http: Http,
        private localStorage: LocalStorageService,
        private tokenService: TokenService) {

        // FARM INITIALIZATION VARIABLES
        this.farmerStore = { farmer: [] };
        this._farmer = new BehaviorSubject(this.farmerStore.farmer);
        this.farmer = this._farmer.asObservable();

        // ERROR INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();
        
        // GET FARMER
        this.getFarmer(this.localStorage.get('farmerId'), this.localStorage.get('token'));

    }

    // GET FARMER
    getFarmer(farmerId: string, token: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let farmerUrl = 'https://cityfarmers-api.herokuapp.com/farmer/' + farmerId;

        this.http.get(farmerUrl, options).subscribe(data => {
            
            if(data.status == 200) {

                // SEND FARMER TO SUBSCRIBERS
                this.farmerStore.farmer.length = 0;
                this.farmerStore.farmer.push(JSON.parse(data.text()));
                this._farmer.next(this.farmerStore.farmer);

            }

        }, err => {
            
            if(err.status == 401 || err.status == 404 ) {

                // CLEAR TOKEN AND REDIRECT TO LOGIN
                this.tokenService.clearToken();

            }

        });

    }

}
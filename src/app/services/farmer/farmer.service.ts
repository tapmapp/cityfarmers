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

    // FARM OBSERVABLE SERVICE CONFIGURATION VARIABLES
    farmers: Observable<Array<Farmer>>;
    private _farmers: BehaviorSubject<Array<Farmer>>;
    private farmersStore: { farmers: Array<Farmer> };

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

        // FARMERS INITIALIZATION VARIABLES
        this.farmersStore = { farmers: [] };
        this._farmers = new BehaviorSubject(this.farmersStore.farmers);
        this.farmers = this._farmers.asObservable();

        // ERROR INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();
        
        // GET ALL FARMERS
        this.getAllFarmers();

        // GET FARMER
        this.getFarmer(this.localStorage.get('farmerId').toString());

    }

    // GET FARMER
    getAllFarmers(): void {
        
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let farmersUrl = 'https://cityfarmers-api.herokuapp.com/farmer/';

        this.http.get(farmersUrl, options).subscribe(data => {
            
            if(data.status == 200) {

                // SEND FARMER TO SUBSCRIBERS
                this.farmersStore.farmers.length = 0;
                this.farmersStore.farmers = JSON.parse(data.text());
                this._farmers.next(this.farmersStore.farmers);

            }

        }, err => {
            
            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

    }

    // GET FARMER
    getFarmer(farmerId: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token').toString()
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
            
            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

    }

}
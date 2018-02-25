import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { ChartService } from '../chart/chart.service';
import { TokenService } from '../token/token.service';

// INTERFACES
import { Farm } from '../../interfaces/farm';

@Injectable()
export class FarmService {

    // FARM OBSERVABLE SERVICE CONFIGURATION VARIABLES
    farm: Observable<Array<Farm>>;
    private _farm: BehaviorSubject<Array<Farm>>;
    private farmStore: { farm: Array<Farm> };

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<String>;
    private _error: BehaviorSubject<String>;
    private errorStore: { error: String };

    constructor(
        private chartService: ChartService,
        private http: Http,
        private localStorage: LocalStorageService,
        private route: ActivatedRoute,
        private tokenService: TokenService) {

        // FARM INITIALIZATION VARIABLES
        this.farmStore = { farm: [] };
        this._farm = new BehaviorSubject(this.farmStore.farm);
        this.farm = this._farm.asObservable();

        // ERROR INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();

        // GET FARMER
        this.getFarms(this.localStorage.get('farmerId').toString());

    }

    // CREATE FARM
    createFarm(farmerId: string, farmName: string, farmCity: string, farmCountry: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let createFarmUrl = Environment.environment.apiUrl + '/farm/create-farm';
        let createFarmUrl = 'https://cityfarmers-api.herokuapp.com/farm/create-farm';
        
        this.http.post(createFarmUrl, { farmerId: farmerId, farmName: farmName, farmCity: farmCity, farmCountry: farmCountry }, options).subscribe(data => {

            if(data.status == 200) {

                // GETTING NEW FARM LIST
                this.getFarms(farmerId);
                
            }

        }, err => {

            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

    }

    // GET FARMS
    getFarms(farmerId: string): void {
        
        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let farmerFarmsUrl = 'https://cityfarmers-api.herokuapp.com/farm/farms';

        this.http.post(farmerFarmsUrl, { farmerId: farmerId }, options).subscribe(data => {
            
            if(data.status == 200) {

                // SENDING FARMS TO SUBSCRIBERS
                this.farmStore.farm = JSON.parse(data.text());
                this._farm.next(this.farmStore.farm);

            }

        }, err => {

            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

    }
    
    // SET LIGHTING 
    setLighting(farmId: string, lightingOn: string, lightingOff: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // SET FARM URL
        let setLightingUrl = 'https://cityfarmers-api.herokuapp.com/farm/set-lighting';

        this.http.post(setLightingUrl, { farmerId: this.localStorage.get('farmerId').toString(), farmId: farmId, lightingOn: lightingOn, lightingOff: lightingOff }, options).subscribe(data => {
            
            if(data.status == 201) {
                setLighting(farmId, lightingOn, lightingOff, this.farmStore.farm, this._farm);
            }

        }, err => {

            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

        // SET VENTILATION TEMPERATURE
        function setLighting(farmId: string, lightingOn: string, lightingOff: string, farms: Array<Farm>, farmSubscriber: BehaviorSubject<Array<Farm>>): void {
            for(let i = 0; i < farms.length; i++) {
                if(farms[i]._id == farmId) {

                    // SET NEW LIGHTING CONFIGURATION
                    farms[i].lightingOn = lightingOn;
                    farms[i].lightingOff = lightingOff;

                    // SEND FARMS TO SUBSCRIBERS
                    farmSubscriber.next(farms);

                }
            }
        }
    }

    // SET TEMPERATURE
    setTemperature(farmId: string, temperature: number): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // FARM TEMPERATURE URL
        let farmTemperatureUrl = 'https://cityfarmers-api.herokuapp.com/farm/set-temperature';

        this.http.post(farmTemperatureUrl, { farmerId: this.localStorage.get('farmerId').toString(), farmId: farmId, temperature: temperature }, options).subscribe(data => {
            
            if(data.status == 201) {
                setVentilationTemperatue(farmId, temperature, this.farmStore.farm, this._farm);
            }

        }, err  => {

            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

        // SET VENTILATION TEMPERATURE
        function setVentilationTemperatue(farmId: string, temperature: number, farms: Array<Farm>, farmSubscriber: BehaviorSubject<Array<Farm>> ): void {
            for(let i = 0; i < farms.length; i++) {
                if(farms[i]._id == farmId) {

                    // SET NEW FARM VENTILATION TEMPERATURE
                    farms[i].temperatureVent = temperature;

                    // SEND FARMS TO SUBSCRIBERS
                    farmSubscriber.next(farms);

                }
            }
        }
    }

    // SET WATERING
    setWatering(farmId: String, watering: number): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // FARM WATERING URL
        let farmTemperatureUrl = 'https://cityfarmers-api.herokuapp.com/farm/set-watering';

        this.http.post(farmTemperatureUrl, { farmerId: this.localStorage.get('farmerId'), farmId: farmId, watering: watering }, options).subscribe(data => {
            
            if(data.status == 201) {
                setWateringPeriod(farmId, watering, this.farmStore.farm, this._farm);
            }

        }, err => {

            // CLEAR TOKEN AND REDIRECT TO LOGIN
            this.tokenService.clearToken();

        });

        // SET WATERING PERIOD
        function setWateringPeriod(farmId: String, watering: number, farms: Array<Farm>, farmSubscriber: BehaviorSubject<Array<Farm>>): void {
            for(let i = 0; i < farms.length; i++) {
                if(farms[i]._id == farmId) {

                    // SET NEW WATERING PERIOD
                    farms[i].watering = watering;

                    // SEND FARMS TO SUBSCRIBERS
                    farmSubscriber.next(farms);

                }
            }
        }
    }
}
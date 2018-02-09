import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// SERVICE
import { TokenService } from '../token/token.service'; 

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// INTERFACES
import { Environment } from '../../interfaces/environment';

@Injectable()
export class ChartService {

    // DATA PERIOD OBSERVABLE SERVICE
    dataPeriod: Observable<Array<Environment>>;
    private _dataPeriod: BehaviorSubject<Array<Environment>>;
    private dataPeriodStore: { dataPeriod: Array<Environment> };

    constructor(
        private localStorage: LocalStorageService,
        private http: Http,
        private tokenService: TokenService) {

        // DATA PERIOD OBSERVABLE SERVICE INITIALIZATION VARIABLES
        this.dataPeriodStore = { dataPeriod: [] };
        this._dataPeriod = new BehaviorSubject(this.dataPeriodStore.dataPeriod);
        this.dataPeriod = this._dataPeriod.asObservable();

    }

    // GET FARMER
    getChartData(farmId: string, fromDate: string, toDate: string): void {
        
        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        // let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let periodUrl = 'https://cityfarmers-api.herokuapp.com/environment/period';

        this.http.post(periodUrl, { farmId: farmId, fromDate: fromDate, toDate: toDate }, options).subscribe(data => {

            if(data.status == 200) {

                var response = JSON.parse(data.text());
                

                if(this.localStorage.get('chartData-' + farmId)) {

                    var chartData:Array<Environment> = this.localStorage.get('chartData-' + farmId);
                    
                    if(response.length > 0) {

                        for(let i = response.length - 1; i >= 0; i--) {
                            chartData.unshift(response[i]);
                        }
                        
                        // SAVE CHART DATA ON LOCAL STORAGE
                        this.localStorage.set('chartData-' + farmId, chartData);                        

                    }

                } else {

                    // SAVE CHART DATA ON LOCAL STORAGE
                    this.localStorage.set('chartData-' + farmId, response);

                }                

            }

        }, err => {
            
            if(err.status == 400) {

                // CLEAR TOKEN AND REDIRECT TO LOGIN
                this.tokenService.clearToken();

            }

        });

    }

}
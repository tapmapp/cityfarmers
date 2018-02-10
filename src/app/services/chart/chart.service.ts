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
    chartData: Observable<Array<Environment>>;
    private _chartData: BehaviorSubject<Array<Environment>>;
    private chartDataStore: { chartData: Array<Environment> };

    constructor(
        private localStorage: LocalStorageService,
        private http: Http,
        private tokenService: TokenService) {

        // DATA PERIOD OBSERVABLE SERVICE INITIALIZATION VARIABLES
        this.chartDataStore = { chartData: [] };
        this._chartData = new BehaviorSubject(this.chartDataStore.chartData);
        this.chartData = this._chartData.asObservable();

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
                var chartData: Array<Environment> = this.localStorage.get('chartData-' + farmId);

                if(chartData !== null) {

                    if(response.length > 0) {

                        for(let i = 0; i < response.length; i++) {
                            let newTime = new Date(chartData[i].date);
                            chartData.push(response[i]);
                        }        

                    }

                    // SAVE CHART DATA ON LOCAL STORAGE
                    this.localStorage.set('chartData-' + farmId, chartData);                

                    // SEND CHART DATA TO SUBSCRIBERS
                    this.chartDataStore.chartData = chartData;
                    this._chartData.next(this.chartDataStore.chartData);

                } else {

                    // SAVE CHART DATA ON LOCAL STORAGE
                    this.localStorage.set('chartData-' + farmId, response);

                    // SEND CHART DATA TO SUBSCRIBERS
                    this.chartDataStore.chartData = response;
                    this._chartData.next(this.chartDataStore.chartData);

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
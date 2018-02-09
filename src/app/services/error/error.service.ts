import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ErrorService {

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<string>;
    private _error: BehaviorSubject<string>;
    private errorStore: { error: string };

    constructor() {

        // ERROR OBSERVABLE SERVICE INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();
    
    }

    // SET ERROR
    setError(error) {
        this.errorStore.error = error;
    }

    // GET ERRROR
    getError() {
        return this.errorStore.error;
    }

    // SEND ERROR
    sendError(error) {
        this.errorStore.error = error;
        this._error.next(this.errorStore.error);
    }

}
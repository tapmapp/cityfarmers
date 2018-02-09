import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Farmer } from '../../interfaces/farmer';

@Injectable()
export class SocketService {

    // FARM OBSERVABLE SERVICE CONFIGURATION VARIABLES
    environment: Observable<any>;
    private _environment: BehaviorSubject<any>;
    private environmentStore: { environment: any };

    constructor() {

        // FARM INITIALIZATION VARIABLES
        this.environmentStore = { environment: [] };
        this._environment = new BehaviorSubject(this.environmentStore.environment);
        this.environment = this._environment.asObservable();

    }

    sendEnvironment(status) {
        this.environmentStore.environment.length = 0;
        this.environmentStore.environment.push(status);
        this._environment.next(this.environmentStore.environment);
    }

}
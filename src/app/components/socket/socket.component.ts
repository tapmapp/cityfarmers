import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { FarmService } from '../../services/farm/farm.service';
import { SocketService } from '../../services/socket/socket.service';

// INTERFACES
import { Farm } from '../../interfaces/farm';

@Component({
    selector: 'socket',
    template: ''
})
export class SocketComponent {

    socket: SocketIOClient.Socket;

    farms: Array<Farm> = [];

    // SUBSCRIBERS
    farmsData: Observable<any>;

    // ENVIRONMENT OBSERVABLE SERVICE CONFIGURATION VARIABLES
    environment: Observable<any>;
    private _environment: BehaviorSubject<any>;
    private environmentStore: { environment: any };

    constructor(
        private farmService: FarmService,
        private localStorage: LocalStorageService,
        private socketService: SocketService) {

        this.socket = io.connect('https://cityfarmers-api.herokuapp.com/' + this.localStorage.get('farmerId') );

    }

    // SUBSCRIBE TO FARMS
    subscribeToFarms(farmsData) {

        for(let i = 0; i < farmsData.length; i++) {

            // SUBSCRIBE TO FARM SOCKETS
            this.socket.emit('subscribe', farmsData[i]._id);

        }
    
    }

    onEnvironment(status) {
        this.socketService.sendEnvironment(status);
    }

    // SET FARM STATUS
    setFarmStatus(status) {
        
    }

    farmDisconnect() {
        
    }

    ngOnInit() {

        // SOCKET CONNECT
        this.socket.on('connect', function() {
            console.log('connected!');    
        });

        // SOCKET STATUS EVENT
        this.socket.on('status', this.setFarmStatus.bind(this));

        // SOCKET PLATFORM ENVIRONMENT
        this.socket.on('platform-environment', this.onEnvironment.bind(this));

        // SOCKET DISCONNECT
        this.socket.on('disconnect', this.farmDisconnect.bind(this));

        // FARMS SUBSCRIBER
        this.farmsData = this.farmService.farm;
        this.farmsData.subscribe(data => {
            this.subscribeToFarms(data);
        });

    }

}
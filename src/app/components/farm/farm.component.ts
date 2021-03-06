import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { LoginService } from '../../services/login/login.service';
import { FarmService } from '../../services/farm/farm.service';
import { SocketService } from '../../services/socket/socket.service';

// INTERFACES
import { Farm } from '../../interfaces/farm';
import { MinLengthValidator } from '@angular/forms/src/directives/validators';
import { Environment } from '../../interfaces/environment';

@Component({
  selector: 'farm',
  providers: [],
  styleUrls: [ './farm.component.css', './farm-resp.component.css' ],
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit {

  // ID ROUTE PARAM
  farmId: string;

  farmerName: string;

  temperatureVent: Number = 0;
  humidity: Number = 0;

  farm: Array<Farm> = [];
  farmChartData: Array<Environment> = [];

  // SUBSCRIBERS
  farmsData: Observable<any>;
  socketData: Observable<any>;

  routeSubscriber: any;

  socket: SocketIOClient.Socket;

  fanStatus: Boolean = true;
  wateringStatus: Boolean = true;

  // LIGHTING VARIABLES
  hoursOn: string = '0';
  minutesOn: string = '0';

  hoursOff: string = '0';
  minutesOff: string = '0';

  // TIMER VARIABLES
  hours: string = '0';
  minutes: string = '0';
  timer = null;

  constructor(
    private farmService: FarmService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private socketService: SocketService) {

    // SOCKET CONNECTION
    this.socket = io.connect('https://cityfarmers-api.herokuapp.com/' + this.localStorage.get('farmerId') );

    // FARMER NAME
    this.farmerName = this.localStorage.get('farmerName').toString();

    // LAUNCH TIMER
    this.clock();

  }

  // SWITH LIGHT
  switchLight(room, status) {
    this.socket.emit('switch-light', { room: room, status: status });
  }

  // SWITCH FAN
  switchFan(room, status) {
    this.fanStatus = status;
    this.socket.emit('switch-light', { room: room, status: status });
  }

  // SWITCH WATERING
  switchWatering(room, status) {
    this.wateringStatus = status;
    this.socket.emit('switch-light', { room: room, status: status });
  }

  // SUBSCRIBRE TO FARMS
  subscribeToFarm(farmsData) {

    for(let i = 0; i < farmsData.length; i++) {
      if(this.farmId == farmsData[i]._id) {
        
        if(this.farm.length > 0) {

          this.farm = [{
            _id: farmsData[i]._id,
            farmer: farmsData[i].farmer,
            name: farmsData[i].name,
            system: farmsData[i].system,
            city: farmsData[i].city,
            country: farmsData[i].country,
            temperatureVent: farmsData[i].temperatureVent,
            watering: farmsData[i].watering,
            temperature: this.farm[0].temperature,
            humidity: this.farm[0].humidity,
            state: false,
            status: false,
            lightingOn: farmsData[i].lightingOn,
            lightingOff: farmsData[i].lightingOff,
            created: farmsData[i].created
          }];

        } else {

          this.farm.push({
            _id: farmsData[i]._id,
            farmer: farmsData[i].farmer,
            name: farmsData[i].name,
            system: farmsData[i].system,
            city: farmsData[i].city,
            country: farmsData[i].country,
            temperatureVent: farmsData[i].temperatureVent,
            watering: farmsData[i].watering,
            temperature: 0,
            humidity: 0,
            state: false,
            status: false,
            lightingOn: farmsData[i].lightingOn,
            lightingOff: farmsData[i].lightingOff,
            created: farmsData[i].created
          });

        }
        

      }
    }

  }

  // TEMPERATURE UP
  temperatureUp() {
    if(this.farm[0].temperatureVent < 42) {

      this.farm[0].temperatureVent += 1;

      if(this.timer !== null) {

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          this.farmService.setTemperature(this.farm[0]._id, this.farm[0].temperatureVent);
        }, 1500);
      
      } else {

        this.timer = setTimeout(() => {
          this.farmService.setTemperature(this.farm[0]._id, this.farm[0].temperatureVent);
        }, 1500);

      }
    }
  }

  // TEMPERATURE DOWN
  temperatureDown() {
    if(this.farm[0].temperatureVent > 18) {

      this.farm[0].temperatureVent -= 1;

      if(this.timer !== null) {

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          this.farmService.setTemperature(this.farm[0]._id, this.farm[0].temperatureVent);
        }, 1500);
      
      } else {

        this.timer = setTimeout(() => {
          this.farmService.setTemperature(this.farm[0]._id, this.farm[0].temperatureVent);
        }, 1500);

      }
    }
  }

  // WATERING UP
  wateringUp() {
    if(this.farm[0].watering < 15) {

      this.farm[0].watering += 1;

      if(this.timer !== null) {

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          this.farmService.setWatering(this.farm[0]._id, this.farm[0].watering);
        }, 1500);
      
      } else {

        this.timer = setTimeout(() => {
          this.farmService.setWatering(this.farm[0]._id, this.farm[0].watering);
        }, 1500);

      }
    }
  }

  // WATERING DOWN
  wateringDown() {
    if(this.farm[0].watering > 1) {

      this.farm[0].watering -= 1;
      
      if(this.timer !== null) {

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          this.farmService.setWatering(this.farm[0]._id, this.farm[0].watering);
        }, 1500);
      
      } else {

        this.timer = setTimeout(() => {
          this.farmService.setWatering(this.farm[0]._id, this.farm[0].watering);
        }, 1500);

      }
    }
  }
  
  // SET FARM STATUS
  setFarmStatus(status) {
    for(let i = 0; i < this.farm.length; i++) {
      if(this.farm[i]._id == status.room && status.status == 'connected') {
        this.farm[i].status = true;
      }
    }
  }

  // FARM DISCONNECT
  farmDisconnect() {
    for(let i = 0; i < this.farm.length; i++) {
        this.farm[i].status = false;
    }
  }

  // SET ENVIRONMENT
  setEnvironment(status) {
    for(let i = 0; i < this.farm.length; i++) {
      if(this.farm[i]._id == status[0].room) {
        this.farm[i].humidity = status[0].humidity;
        this.farm[i].temperature = status[0].temperature;
      }
    }
  }

  // TIMER FUNCTION
  clock() {

    const time = new Date();

    this.hours = formater(time.getHours());
    this.minutes = formater(time.getMinutes());

    function formater(timeValue: Number) {

      let value: string;

      if (timeValue < 10) {
        return value = '0' + timeValue;
      } else {
        value = timeValue.toString();
        return value;
      }

    }

    setTimeout(() => {
      this.clock();
    }, 1000);

  }

  // ADD TIME LIGHTING ON
  addTimeOn(time: string) {

    const newTime = time.split(':');

    let hours = parseInt(newTime[0]);
    let minutes = parseInt(newTime[1]);

    minutes += 15;

    if(minutes >= 60) {

      minutes = 0;
      hours += 1;

      if (hours == 24) {
        hours = 0;
      }
      
    }

    // FORMAT TIME
    let newHours = this.formatTime(hours);
    let newMinutes = this.formatTime(minutes);

    this.farm[0].lightingOn = newHours + ':' + newMinutes;

    if(this.timer !== null) {

      console.log('hi1');

      clearTimeout(this.timer);

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff) 
      }, 1500);

    } else {

      console.log('hi2');

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff) 
      }, 1500);
      
    }

  }

  // LOW TIME LIGHTING ON
  lowTimeOn(time: string) {

    const newTime = time.split(':');

    let hours = parseInt(newTime[0]);
    let minutes = parseInt(newTime[1]);

    minutes -= 15;

    if(minutes < 0) {

      minutes = 45;
      hours -= 1;

      if (hours < 0) {
        hours = 23;
      }

    }

    // FORMAT TIME
    let newHours = this.formatTime(hours);
    let newMinutes = this.formatTime(minutes);

    this.farm[0].lightingOn = newHours + ':' + newMinutes;

    if(this.timer !== null) {

      clearTimeout(this.timer);

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    } else {

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    }

  }

  // ADD TIME LIGHTING OFF
  addTimeOff(time: string) {

    const newTime = time.split(':');

    let hours = parseInt(newTime[0]);
    let minutes = parseInt(newTime[1]);

    minutes += 15;

    if (minutes >= 60) {

      minutes = 0;
      hours += 1;

      if (hours == 24) {
        hours = 0;
      }

    }

    // FORMAT TIME
    const newHours = this.formatTime(hours);
    const newMinutes = this.formatTime(minutes);

    this.farm[0].lightingOff = newHours + ':' + newMinutes;

    if(this.timer !== null) {

      clearTimeout(this.timer);

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    } else {

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    }

  }

  // LOW TIME LIGHTING OFF
  lowTimeOff(time: string) {

    const newTime = time.split(':');

    let hours = parseInt(newTime[0]);
    let minutes = parseInt(newTime[1]);

    minutes -= 15;

    if (minutes < 0) {

      minutes = 45;
      hours -= 1;

      if (hours < 0) {
        hours = 23;
      }

    }

    // FORMAT TIME
    const newHours = this.formatTime(hours);
    const newMinutes = this.formatTime(minutes);

    this.farm[0].lightingOff = newHours + ':' + newMinutes;

    if(this.timer !== null) {

      clearTimeout(this.timer);

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    } else {

      // SET LIGHTING
      this.timer = setTimeout(() => {
        this.farmService.setLighting(this.farmId, this.farm[0].lightingOn, this.farm[0].lightingOff);
      }, 1500);

    }


  }

  // FORMAT TIME
  formatTime(value: number) {

    let newValue: string;

    if (value < 10) {
      newValue = '0' + value;
    } else {
      newValue = value.toString();
    }

    return newValue;

  }

  ngOnInit() {

    // ROUTE PARAM SUBSCRIBER
    this.routeSubscriber = this.route.params.subscribe(params => {
      this.farmId = params.farmId;
    });

    // FARMS SUBSCRIBER
    this.farmsData = this.farmService.farm;
    this.farmsData.subscribe(data => {
      this.subscribeToFarm(data);
    });

    // SOCKET DATA
    this.socketData = this.socketService.environment;
    this.socketData.subscribe(data => {

      if (data.length > 0) {
        this.setEnvironment(data);
      }

    });

  }

}

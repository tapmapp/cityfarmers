import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { ChartService } from '../../services/chart/chart.service';
import { FarmService } from '../../services/farm/farm.service';
import { NoteService } from '../../services/note/note.service';

// INTERFACES
import { Farm } from '../../interfaces/farm'; 
import { Farmer } from '../../interfaces/farmer'; 
import { FarmerService } from '../../services/farmer/farmer.service';
import { SocketService } from '../../services/socket/socket.service';
import { Environment } from '../../interfaces/environment';

@Component({
  selector: 'farmers',
  providers: [],
  styleUrls: [ './farmers.component.css' ],
  templateUrl: './farmers.component.html'
})
export class FarmersComponent implements OnInit {

  socket: SocketIOClient.Socket;

  farmers: Array<Farmer> = [];

  loaderStatus: Boolean = true;

  // SUBSCRIBERS
  farmersData: Observable<Array<Farmer>>;
  socketData: Observable<any>;

  constructor(
    private localStorage: LocalStorageService,
    private farmerService: FarmerService,
    private socketService: SocketService) {}

  ngOnInit() {

    // FARMER SUBSCRIBER
    this.farmersData = this.farmerService.farmers;
    this.farmersData.subscribe(data => {

      if(data.length > 0) {
        this.farmers = data;
        this.loaderStatus = false;
      }
      
    });

    // SOCKET SUBSCRIBER
    this.socketData = this.socketService.environment;
    this.socketData.subscribe(data => {
      if(data.length > 0) {
        //this.setEnvironment(data);
      } 
    });

  }

}

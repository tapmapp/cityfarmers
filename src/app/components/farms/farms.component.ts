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
  selector: 'farms',
  providers: [],
  styleUrls: [ './farms.component.css', 'farms-resp.component.css' ],
  templateUrl: './farms.component.html'
})
export class FarmsComponent implements OnInit {

  socket: SocketIOClient.Socket;

  farms: Array<Farm> = [];

  loaderStatus: Boolean = true;

  // SUBSCRIBERS

  farmsData: Observable<Array<Farm>>;
  socketData: Observable<any>;

  constructor(
    private localStorage: LocalStorageService,
    private farmService: FarmService,
    private socketService: SocketService) {}

  ngOnInit() {

    // FARMS SUBSCRIBER
    this.farmsData = this.farmService.farms;
    this.farmsData.subscribe(data => {

      if(data.length > 0) {
        this.farms = data;
        this.loaderStatus = false;
      }

    });

    // SOCKET SUBSCRIBER
    this.socketData = this.socketService.environment;
    this.socketData.subscribe(data => {
      if(data.length > 0) {
        
      } 
    });

  }

}

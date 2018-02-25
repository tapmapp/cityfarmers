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
  selector: 'farmer',
  providers: [],
  styleUrls: [ './farmer.component.css' ],
  templateUrl: './farmer.component.html'
})
export class FarmerComponent implements OnInit {

  socket: SocketIOClient.Socket;

  farms: Array<Farm> = [];
  farmer: Array<Farmer> = [];

  city: string = '';
  country: string = '';

  farmName: string = '';
  farmCity: string = '';
  farmCountry: string = '';

  noteTitle: string = '';
  noteContent: string = '';

  selectedfarmName: string = '';

  activeFarmName: Boolean = false;
  activeCity: Boolean = false;
  activeCountry: Boolean = false;

  activeTitle: Boolean = false;
  activeContent: Boolean = false;

  addNoteStatus: Boolean = false;
  noteContainerStatus: Boolean = true;
  farmListState: Boolean = false;

  loaderStatus: Boolean = true;

  // SUBSCRIBERS
  farmerData: Observable<Array<Farmer>>;
  farmsData: Observable<Array<Farm>>;
  socketData: Observable<any>;
  temperatureVentData: Observable<Object>;
  wateringData: Observable<Object>;

  constructor(
    private chartService: ChartService,
    private localStorage: LocalStorageService,
    private farmService: FarmService,
    private farmerService: FarmerService,
    private noteService: NoteService,
    private socketService: SocketService) {

    }

  // CREATE FARM
  createFarm(): void {
    this.farmService.createFarm(this.localStorage.get('farmerId').toString(), this.farmName, this.farmCity, this.farmCountry);
  }

  // FOCUS FARM NAME FUNCTION
  focusFarmName(): void {
    this.activeFarmName = true;
  }

  // FOCUS OUT FARM NAME FUNCTION
  focusOutFarmName(): void {
    if(this.farmName.length == 0) {
      this.activeFarmName = false;
    } 
  }
  
  // FOCUS CITY FUNCTION
  focusCity(): void {
    this.activeCity = true;
  }
  
  // FOCUS OUT CITY FUNCTION
  focusOutCity(): void {
    if(this.farmCity.length == 0) {
      this.activeCity = false;
    } 
  }

  // FOCUS COUNTRY FUNCTION
  focusCountry(): void {
    this.activeCountry = true;
  }
  
  // FOCUS OUT COUNTRY FUNCTION
  focusOutCountry(): void {
    if(this.farmCountry.length == 0) {
      this.activeCountry = false;
    } 
  }

  // FOCUS NOTE TITLE FUNCTION
  focusNoteTitle(): void {
    this.activeTitle = true;
  }

  // FOCUS OUT NOTE TITLE FUNCTION
  focusOutNoteTitle(): void {
    if(this.noteTitle.length == 0) {
      this.activeTitle = false;
    } 
  }

  // FOCUS CONTENT FUNCTION
  focusContent(): void {
    this.activeContent= true;
  }

  // FOCUS OUT CONTENT FUNCTION
  focusOutContent(): void {
    if(this.noteContent.length == 0) {
      this.activeContent = false;
    } 
  }

  // SET FARMS
  setFarms(farms: Array<Farm>): void {

    for(let i = 0; i < farms.length; i++) {

      if(i == 0) {
        this.selectedfarmName = farms[i].name;
      }

      farms[i].status = false;
      farms[i].humidity = 0;
      farms[i].temperature = 0;
      
      var chartData: Array<any> = this.localStorage.get('chartData-' + farms[i]._id);
      
      if(chartData) {
        
        if(chartData.length > 0) {

          let fromDate = new Date(chartData[chartData.length - 1].date);
          let toDate = new Date();

          let formatFromDate = fromDate.getFullYear() + '-' + formatValue(fromDate.getMonth() + 1) + '-' + formatValue(fromDate.getDate()) + ' ' + formatValue(fromDate.getHours()) + ':' + formatValue(fromDate.getMinutes()) + ':' + formatValue(fromDate.getSeconds());
          let formatToDate = toDate.getFullYear() + '-' + formatValue(toDate.getMonth() + 1) + '-' +  formatValue(toDate.getDate()) + ' ' + formatValue(toDate.getHours()) + ':' + formatValue(toDate.getMinutes()) + ':' + formatValue(toDate.getSeconds());

          this.chartService.getChartData(farms[i]._id, formatFromDate, formatToDate);

        } else {

          let fromDate = new Date(farms[i].created);
          let toDate = new Date();

          let formatFromDate = fromDate.getFullYear() + '-' + formatValue(fromDate.getMonth() + 1) + '-' + formatValue(fromDate.getDate()) + ' ' + formatValue(fromDate.getHours()) + ':' + formatValue(fromDate.getMinutes()) + ':' + formatValue(fromDate.getSeconds());
          let formatToDate = toDate.getFullYear() + '-' + formatValue(toDate.getMonth() + 1) + '-' +  formatValue(toDate.getDate()) + ' ' + formatValue(toDate.getHours()) + ':' + formatValue(toDate.getMinutes()) + ':' + formatValue(toDate.getSeconds());

          this.chartService.getChartData(farms[i]._id, formatFromDate, formatToDate);

        }

      } else {
        
        let fromDate = new Date(farms[i].created);
        let toDate = new Date();

        let formatFromDate = fromDate.getFullYear() + '-' + formatValue(fromDate.getMonth() + 1) + '-' + formatValue(fromDate.getDate()) + ' ' + formatValue(fromDate.getHours()) + ':' + formatValue(fromDate.getMinutes()) + ':' + formatValue(fromDate.getSeconds());
        let formatToDate = toDate.getFullYear() + '-' + formatValue(toDate.getMonth() + 1) + '-' +  formatValue(toDate.getDate()) + ' ' + formatValue(toDate.getHours()) + ':' + formatValue(toDate.getMinutes()) + ':' + formatValue(toDate.getSeconds());

        this.chartService.getChartData(farms[i]._id, formatFromDate, formatToDate);

      }
      
    }
    
    this.farms = farms;

    // LOADER OFF
    setTimeout(()=> {
      this.loaderStatus = false;
    },1000);
    
    function formatValue(value: number) {

      let newValue: String;

      if(value < 10) {
        return newValue = '0' + value;
      } else {
        return newValue = value.toString();
      }
      
    }


  }

  // DISPLAY ADD NOTE CONTAINER
  addNote(): void {
    this.addNoteStatus = true;
    this.noteContainerStatus = false;
  }

  // DISPLAY NOTES LIST
  showNotes(): void {
    this.noteContainerStatus = true;
    this.addNoteStatus = false;
  }

  // SET ENVIRONMENT
  setEnvironment(status): void {
    for(let i = 0; i < this.farms.length; i++) {
      if(this.farms[i]._id == status[0].room) {
        this.farms[i].humidity = status[0].humidity;
        this.farms[i].temperature = status[0].temperature;
        this.farms[i].status = true;
      }
    }
  }

  // SET FARM STATE
  selectFarm(farmId: String) {
    for(let i = 0; i < this.farms.length; i++) {

      this.farms[i].state = false;
      
      if(this.farms[i]._id == farmId) {

        this.selectedfarmName = this.farms[i].name;
        this.farmListState = false

        // LOAD FARM NOTES
        // this.noteService.getNotes(this.farms[i]._id);

      }
    }
  }

  // DISPLAY FARMS LIST
  displayFarms() {
    if(this.farmListState) {
      this.farmListState = false
    } else {
      this.farmListState = true;
    }
  }

  // CREATE NOTE
  createNote():void {
    //createNote(farmerId: String, farmId: String, noteTitle: String, noteContent: String, noteImg: String)
    //this.noteService.createNote(this.noteTitle, this.noteContent);
  }

  ngOnInit() {

    // FARMER SUBSCRIBER
    this.farmerData = this.farmerService.farmer;
    this.farmerData.subscribe(data => {
      this.farmer = data;
    });

    // FARMS SUBSCRIBER
    this.farmsData = this.farmService.farm;
    this.farmsData.subscribe(data => {
      if(data.length > 0) {
        this.setFarms(data);
      }
    });

    // SOCKET SUBSCRIBER
    this.socketData = this.socketService.environment;
    this.socketData.subscribe(data => {
      if(data.length > 0) {
        this.setEnvironment(data);
      } 
    });

  }

}

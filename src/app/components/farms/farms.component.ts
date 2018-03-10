import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { ChartService } from '../../services/chart/chart.service';
import { FarmService } from '../../services/farm/farm.service';

// INTERFACES
import { Farm } from '../../interfaces/farm'; 
import { Farmer } from '../../interfaces/farmer'; 
import { FarmerService } from '../../services/farmer/farmer.service';

@Component({
  selector: 'farms',
  providers: [],
  styleUrls: [ './farms.component.css', 'farms-resp.component.css' ],
  templateUrl: './farms.component.html'
})
export class FarmsComponent implements OnInit {

  farms: Array<Farm> = [];
  farmers: Array<Farmer> = [];

  loaderStatus: Boolean = true;

  // SUBSCRIBERS

  farmsData: Observable<Array<Farm>>;
  farmersData: Observable<Array<Farmer>>;


  constructor(
    private localStorage: LocalStorageService,
    private farmService: FarmService,
    private farmerService: FarmerService) {}

  ngOnInit() {

    // FARMS SUBSCRIBER
    this.farmsData = this.farmService.farms;
    this.farmsData.subscribe(data => {

      if(data.length > 0) {
        this.farms = data;
        this.loaderStatus = false;
      }

    });

    // FARMER SUBSCRIBER
    this.farmersData = this.farmerService.farmers;
    this.farmersData.subscribe(data => {

      if(data.length > 0) {
        this.farmers = data;
        this.loaderStatus = false;
      }
      
    });


  }

}

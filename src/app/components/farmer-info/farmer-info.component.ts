import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { FarmerService } from '../../services/farmer/farmer.service';

// INTERFACES
import { Farmer } from '../../interfaces/farmer';

@Component({
  selector: 'farmer-info',
  providers: [],
  styleUrls: [ './farmer-info.component.css' ],
  templateUrl: './farmer-info.component.html'
})
export class FarmerInfoComponent implements OnInit {

  // SUBSCRIBERS
  farmerData: Observable<Array<Farmer>>;
  routeSubscriber: any;
  
  // FARMER ID
  farmerId: string;

  // FARMER INFO
  farmer: Farmer;

  // LOADER STATUS
  loaderStatus: Boolean = true;

  constructor(
    private farmerService: FarmerService,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {

    // ROUTE PARAM SUBSCRIBER
    this.routeSubscriber = this.route.params.subscribe(params => {
      this.farmerId = params.farmerId;
    });

    // FARMERS SUBSCRIBERS
    this.farmerData = this.farmerService.farmers;
    this.farmerData.subscribe(data => {

      if(data.length > 0) {
        for(let i = 0; i < data.length; i++) {
          if(this.farmerId == data[i]._id) {
            this.farmer = data[i];
            this.loaderStatus = false;
          }
        }
      }

    });

  }

}

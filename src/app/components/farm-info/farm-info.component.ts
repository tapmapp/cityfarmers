import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { FarmService } from '../../services/farm/farm.service';

// INTERFACES
import { Farm } from '../../interfaces/farm';

@Component({
  selector: 'farm-info',
  providers: [],
  styleUrls: [ './farm-info.component.css' ],
  templateUrl: './farm-info.component.html'
})
export class FarmInfoComponent implements OnInit {

  // FARMER ID
  farmId: string;

  // FARMS
  farm: Farm;

  // SUBSCRIBERS
  routeSubscriber: any;
  farmsData: Observable<Array<Farm>>;

  // LOADER STATUS
  loaderStatus: Boolean = true;

  constructor(
    private farmService: FarmService,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {

    // ROUTE PARAM SUBSCRIBER
    this.routeSubscriber = this.route.params.subscribe(params => {
      this.farmId = params.farmId;
      this.loaderStatus = false;
    });

    // FARMS SUBSCRIBER
    this.farmsData = this.farmService.farms;
    this.farmsData.subscribe(data => {
      if(data.length > 0) {
        for(let i = 0; i < data.length; i++) {
          if(this.farmId == data[i]._id) {
            this.farm = data[i];
            console.log(this.farm);
          }
        }
      }
    });

  }

}

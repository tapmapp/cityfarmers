import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'products',
  providers: [],
  styleUrls: [ './products.component.css', 'products-resp.component.css' ],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  loaderStatus: Boolean = true;

  constructor() {}

  ngOnInit() {
    
    this.loaderStatus = false;

  }

}

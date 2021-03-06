import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'contact',
  providers: [],
  styleUrls: [ './contact.component.css', 'contact-resp.component.css' ],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  loaderStatus: Boolean = true;

  constructor() {}

  ngOnInit() {

    this.loaderStatus = false;
  }

}

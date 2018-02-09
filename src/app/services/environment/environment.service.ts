import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class EnvironmentService {

    constructor(private http: Http) {}

}
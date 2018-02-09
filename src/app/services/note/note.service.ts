import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { TokenService } from '../token/token.service';

// INTERFACES
import { Farm } from '../../interfaces/farm';
import { Farmer } from '../../interfaces/farmer';
import { Note } from '../../interfaces/note';

@Injectable()
export class NoteService {

    // NOTES OBSERVABLE SERVICE CONFIGURATION VARIABLES
    notes: Observable<Array<Note>>;
    private _notes: BehaviorSubject<Array<Note>>;
    private notesStore: { notes: Array<Note> };

    // ERROR OBSERVABLE SERVICE CONFIGURATION VARIABLES
    error: Observable<string>;
    private _error: BehaviorSubject<string>;
    private errorStore: { error: string };
    
    constructor(
        private http: Http,
        private localStorage: LocalStorageService,
        private tokenService: TokenService) {

        // NOTES INITIALIZATION VARIABLES
        this.notesStore = { notes: [] };
        this._notes = new BehaviorSubject(this.notesStore.notes);
        this.notes = this._notes.asObservable();

        // ERROR INITIALIZATION VARIABLES
        this.errorStore = { error: '' };
        this._error = new BehaviorSubject(this.errorStore.error);
        this.error = this._error.asObservable();

    }

    // CREATE NOTE
    createNote(farmerId: string, farmId: string, noteTitle: string, noteContent: string, noteImg: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let createFarmUrl = Environment.environment.apiUrl + '/farm/create-farm';
        let createNoteUrl = 'https://cityfarmers-api.herokuapp.com/notes/add-note';
        
        this.http.post(createNoteUrl, { farmerId: farmerId, farmId: farmId, noteTitle: noteTitle, noteContent: noteContent, noteImg: noteImg }, options).subscribe(data => {

            if(data.status == 200) {

                // GETTING NEW FARM LIST
                this.getNotes(farmId);

            }

        }, err => {
            
            if(err.status == 401) {

                // CLEAR TOKEN AND REDIRECT TO LOGIN
                this.tokenService.clearToken();
            
            }

        });

    }

    // GET NOTES
    getNotes(farmId: string): void {

        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let farmerFarmsUrl = 'https://cityfarmers-api.herokuapp.com/notes/get-notes/' + farmId;

        this.http.get(farmerFarmsUrl, options).subscribe(data => {
            
            if(data.status == 200) {

                // SENDING FARMS TO SUBSCRIBERS
                this.notesStore.notes = JSON.parse(data.text());
                this._notes.next(this.notesStore.notes);

            }

        }, err => {

            if(err.status == 401) {

                // CLEAR TOKEN AND REDIRECT TO LOGIN
                this.tokenService.clearToken();
            
            }

        });

    }

    // GET NOTES
    deleteNote(farmId, noteId: string): void {
    
        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.localStorage.get('token')
        });

        let options = new RequestOptions({ headers: headers });

        // TRADE API URL
        //let farmerFarmsUrl = Environment.environment.apiUrl + '/farm/farms';
        let deleteNoteUrl = 'https://cityfarmers-api.herokuapp.com/notes/delete-note/' + noteId;

        this.http.get(deleteNoteUrl, options).subscribe(data => {

            if(data.status == 200) {

                // REFRESH NOTE LIST
                this.getNotes(farmId);

            }

        }, err => {

            if(err.status == 401) {
                
                // SEND ERROR TO SUBSCRIBERS
                this.errorStore.error = err;
                this._error.next(this.errorStore.error);
            
            }

        });

    }

    // RETURN NOTES
    returnNotes(): Array<Note> {
        return this.notesStore.notes;
    }
    
}
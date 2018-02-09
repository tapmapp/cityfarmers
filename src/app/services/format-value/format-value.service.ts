import { Injectable } from '@angular/core';

@Injectable()
export class FormatValueService {

    constructor() {

    }
        
    formatValue(value: number) {

        let newValue: string;
    
        if(value < 10) {
          return newValue = '0' + value;
        } else {
          return newValue = value.toString();
        }
        
      }


}
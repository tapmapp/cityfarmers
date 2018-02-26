import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { ChartService } from '../../services/chart/chart.service';
import { FormatValueService } from '../../services/format-value/format-value.service';
import { SocketService } from '../../services/socket/socket.service';

// INTERFACES
import { Environment } from '../../interfaces/environment';
import { Farm } from '../../interfaces/farm';

@Component({
  selector: 'chart',
  providers: [],
  styleUrls: [ './chart.component.css' ],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {
  
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // FARM ID
  @Input() farm: Array<Farm> = [];
  
  // SELECTED DATA PERIOD
  selectedDataPeriod: string = 'minutes';

  // LOADER 
  loaderStatus: Boolean = true;

  allChartData: Array<Environment> = [];

  // SUBSCRIBERS
  socketData: Observable<any>;
  chartData: Observable<Array<Environment>>;

  constructor(
    private chartService: ChartService,
    private formatValueService: FormatValueService,
    private localStorage: LocalStorageService,
    private socketService: SocketService) {

    // SET CHART DATA
    this.setChartData();    

  }

  // CHART
  public lineChartData: Array<any> = [
    { data: [], label: 'Temp: ', yAxisID: 'A' },
    { data: [], label: 'Hum ', yAxisID: 'B'}
  ];

  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          padding: 30,
          min: 0,
          max: 45
        },
        //type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'left',
        id: 'A',
        gridLines: {
          display: false,
          color: 'transparent'
        }
      }, 
      {
        ticks: {
          padding: 30,
          min: 0,
          max: 100
        },
        //type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'right',
        id: 'B',
        // grid line settings
        gridLines: {
            display: false, // only want the grid lines for one axis to show up
            color: 'transparent'
        }
      }],
      xAxes: [{
        display: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 8,
          maxRotation: 0,
          minRotation: 0
        },
        gridLines: {
          display: false, // only want the grid lines for one axis to show up
          color: 'transparent'
        }
      }],
    },
    layout: {
      padding: {
          left: 30,
          right: 30,
          top: 15,
          bottom: 30
      }
    },
    elements: { point: { radius: 0 } }
  };

  public lineChartColors:Array<any> = [
    { // temperature
      backgroundColor: 'rgba(160,0,0,0)',
      borderColor: 'rgba(160,0,0,1)',
      pointBackgroundColor: 'rgba(160,0,0,1)',
      pointBorderColor: 'rgba(160,0,0,1)',
      pointHoverBackgroundColor: 'rgba(160,0,0,1)',
      pointHoverBorderColor: 'rgba(160,0,0,1)'
    },
    { // humidity
      backgroundColor: 'rgba(0,120,160,0)',
      borderColor: 'rgba(0,120,160,1)',
      pointBackgroundColor: 'rgba(0,120,160,1)',
      pointBorderColor: 'rgba(0,120,160,1)',
      pointHoverBackgroundColor: 'rgba(0,120,160,1)',
      pointHoverBorderColor: 'rgba(0,120,160,1)'
    }
  ];

  public lineChartLegend: Boolean = false;
  public lineChartType: string = 'line';
 
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
 
  public chartHovered(e: any): void {
    console.log(e);
  }

  // SELECT CHART PERIOD
  selectPeriod(period: string) {

      // LOADER ON
      this.loaderStatus = true;

      // SET CHART PERIOD
      this.selectedDataPeriod = period;

      this.setChartData();
  
  }

  // PUSH NEW DATA TO THE CHART
  pushNewData(data: any): void {

    if(!this.chart.chart) {

      setTimeout(()=> {
        this.pushNewData(data);
      }, 100);

    } else {

      let newTime = new Date();

      if(this.selectedDataPeriod == 'minutes') {

        if(this.lineChartLabels[this.lineChartLabels.length - 1] == formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes())) {

          let actualTemp = ((this.lineChartData[0].data[this.lineChartData[0].data.length - 1] + parseFloat(data[0].temperature)) / 2).toFixed(1);
          let actualHum = ((this.lineChartData[1].data[this.lineChartData[1].data.length - 1] + parseFloat(data[0].humidity)) / 2).toFixed(1);

          this.lineChartData[0].data[this.lineChartData[0].data.length - 1] = parseFloat( actualTemp );
          this.lineChartData[1].data[this.lineChartData[1].data.length - 1] = parseFloat( actualHum );

        } else {

          // ADD NEW DATA
          this.lineChartData[0].data.push(parseFloat(data[0].temperature));
          this.lineChartData[1].data.push(parseFloat(data[0].humidity));

          // ADD NEW TIME DATA
          this.lineChartLabels.push(formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes()));

          // REMOVE FIRST ELEMENT OF THE DATA ARRAY
          if(this.lineChartData[0].data.length > 60) this.lineChartData[0].data.shift();
          if(this.lineChartData[1].data.length > 60) this.lineChartData[1].data.shift();

          // REMOVE FIRST ELEMENT OF THE TIME ARRAY
          if(this.lineChartLabels.length > 60) this.lineChartLabels.shift();

        }
      }

      if(this.selectedDataPeriod == 'hours') {

        if(this.lineChartLabels[this.lineChartLabels.length - 1] == formatValue(newTime.getHours()) + 'h') {

          let actualTemp = ((this.lineChartData[0].data[this.lineChartData[0].data.length - 1] + parseFloat(data[0].temperature)) / 2).toFixed(1);
          let actualHum = ((this.lineChartData[1].data[this.lineChartData[1].data.length - 1] + parseFloat(data[0].humidity)) / 2).toFixed(1);

          this.lineChartData[0].data[this.lineChartData[0].data.length - 1] = parseFloat( actualTemp );
          this.lineChartData[1].data[this.lineChartData[1].data.length - 1] = parseFloat( actualHum );

        } else {

          // ADD NEW DATA
          this.lineChartData[0].data.push(parseFloat(data[0].temperature));
          this.lineChartData[1].data.push(parseFloat(data[0].humidity));

          // ADD NEW TIME DATA
          this.lineChartLabels.push(formatValue(newTime.getHours()) + 'h');

          // REMOVE FIRST ELEMENT OF THE DATA ARRAY
          if(this.lineChartData[0].data.length > 24) this.lineChartData[0].data.shift();
          if(this.lineChartData[1].data.length > 24) this.lineChartData[1].data.shift();

          // REMOVE FIRST ELEMENT OF THE TIME ARRAY
          if(this.lineChartLabels.length > 24) this.lineChartLabels.shift();

        }

      }

      if(this.selectedDataPeriod == 'days') {

        if(this.lineChartLabels[this.lineChartLabels.length - 1] == formatValue(newTime.getDate()) + '/' + formatValue(newTime.getMonth())) {

          let actualTemp = ((this.lineChartData[0].data[this.lineChartData[0].data.length - 1] + parseFloat(data[0].temperature)) / 2).toFixed(1);
          let actualHum = ((this.lineChartData[1].data[this.lineChartData[1].data.length - 1] + parseFloat(data[0].humidity)) / 2).toFixed(1);

          this.lineChartData[0].data[this.lineChartData[0].data.length - 1] = parseFloat( actualTemp );
          this.lineChartData[1].data[this.lineChartData[1].data.length - 1] = parseFloat( actualHum );

        } else {

          // ADD NEW DATA
          this.lineChartData[0].data.push(parseFloat(data[0].temperature));
          this.lineChartData[1].data.push(parseFloat(data[0].humidity));

          // ADD NEW TIME DATA
          this.lineChartLabels.push(formatValue(newTime.getDate()) + '/' + formatValue(newTime.getMonth()));

          // REMOVE FIRST ELEMENT OF THE DATA ARRAY
          if(this.lineChartData[0].data.length > 31) this.lineChartData[0].data.shift();
          if(this.lineChartData[1].data.length > 31) this.lineChartData[1].data.shift();

          // REMOVE FIRST ELEMENT OF THE TIME ARRAY
          if(this.lineChartLabels.length > 31) this.lineChartLabels.shift();

        }

      }

      this.chart.chart.update();

    }

    function formatValue(value: number) {

      let newValue: string;
  
      if(value < 10) {
        return newValue = '0' + value;
      } else {
        return newValue = value.toString();
      }
      
    }

  }
  
  // SET CHART DATA
  setChartData() {

    if(this.farm.length == 0) {

      setTimeout(() => {
        this.setChartData();
      }, 100);

    } else {

      let chartData: Array<Environment> = this.localStorage.get('chartData-' + this.farm[0]._id);

      if(chartData !== null) {

        // DATE OF THE LAST VALUE OF THE STORED DATA
        let fromDate = new Date(chartData[chartData.length - 1].date);
        fromDate.setSeconds(fromDate.getSeconds() + 1);
        
        // DATE OF TODAY
        let toDate = new Date();

        // GET DATA SINCE THE DATE OF THE LAST STORED VALUE
        this.chartService.getChartData(this.farm[0]._id, fromDate.toString(), toDate.toString());

      } else {

        let fromDate = new Date(this.farm[0].created);
        let toDate = new Date();

        // GET ALL STORED DATA SINCE THE CREATION OF THE FARM
        this.chartService.getChartData(this.farm[0]._id, fromDate.toString(), toDate.toString());

      }
      
    }

    function formatValue(value: number) {

      let newValue: string;
  
      if (value < 10) {
        return newValue = '0' + value;
      } else {
        return newValue = value.toString();
      }
      
    }

  }
  
  renderChartData(lineChartData: Array<any>, lineChartLabels: Array<any>, chart: any) {
    
    var lastTime: number = new Date(this.allChartData[this.allChartData.length - 1].date).getTime();
    var fromTime: number;

    // EMPTY CHART DATA ARRAYS
    lineChartData[0].data.length = 0;
    lineChartData[1].data.length = 0;
    lineChartLabels.length = 0;

    var timePeriod = [];
    var dataPeriod = [];
    var actualDataPeriod = [];

    if(this.selectedDataPeriod == 'minutes') {

      // 1 HOUR IN MILLY SECONDS
      const hourMilly = 3600 * 1000;
      
      // CALCULATING INTERVAL
      fromTime = new Date(lastTime - hourMilly).getTime();

    }

    if(this.selectedDataPeriod == 'hours') {

      // CREATE TODAY DATE OBJECT
      let actualDate = new Date(lastTime);

      // CALCULATING INTERVAL
      fromTime = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 0, 0, 0).getTime();
      
    }

    if(this.selectedDataPeriod == 'days') {
      
      // MONTH IN MILLY SECONDS
      const monthMilly = 31 * 24 * 3600 * 1000;

      // CALCULATING INTERVAL
      fromTime = new Date(lastTime - monthMilly).getTime();

    }
    
    let chartDateLength = this.allChartData.length;

    for(let i = 0; i < chartDateLength; i++) {
    
      let newTime = new Date(this.allChartData[i].date);

      if(newTime.getTime() > fromTime) {

        if(this.selectedDataPeriod == 'minutes') {

          let newTimeFormat = formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes());

          if(dataPeriod[newTimeFormat] !== undefined) {
            dataPeriod[newTimeFormat].push({ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity });
          } else {
            dataPeriod[newTimeFormat] = [{ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity }];
          }

        }
        
        if(this.selectedDataPeriod == 'hours') {

          let newTimeFormat = formatValue(newTime.getHours()) + 'h';

          if(dataPeriod[newTimeFormat] !== undefined) {
            dataPeriod[newTimeFormat].push({ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity });
          } else {
            dataPeriod[newTimeFormat] = [{ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity }];
          }

        }

        if(this.selectedDataPeriod == 'days') {
          
          let newTimeFormat = formatValue(newTime.getDate()) + '/' + formatValue((newTime.getMonth() + 1));

          if(dataPeriod[newTimeFormat] !== undefined) {
            dataPeriod[newTimeFormat].push({ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity });
          } else {
            dataPeriod[newTimeFormat] = [{ temp: this.allChartData[i].temperature, hum: this.allChartData[i].humidity }];
          }

        }

      }
    }

    let dataPeriodKeys = Object.keys(dataPeriod);

    // CALCULATE AVERAGE
    for(let i = 0; i < dataPeriodKeys.length; i++) {
      
      let dataPeriodDataKey = dataPeriod[dataPeriodKeys[i]];

      let temp = 0;
      let hum = 0;

      for(let j = 0; j < dataPeriodDataKey.length; j++) {
        temp += dataPeriodDataKey[j].temp;
        hum += dataPeriodDataKey[j].hum;
      }

      temp = parseFloat((temp / dataPeriodDataKey.length).toFixed(1));
      hum = parseFloat((hum / dataPeriodDataKey.length).toFixed(1));

      lineChartData[0].data.push(temp);
      lineChartData[1].data.push(hum);
      lineChartLabels.push(dataPeriodKeys[i]);

    }

    // UPDATE CHART DATA
    updateChart();
    
    // LOADER OFF
    setTimeout(() => {
      this.loaderStatus = false;
    }, 750);

    // UPDATE CHART DATA FUNCTION
    function updateChart() {

      if(chart.chart === undefined) {

        setTimeout(() => {
          updateChart();
        }, 100);

      } else {

        // UPDATE CHART DATA
        chart.chart.update();

      }
    }

    // FORMAT VALUE FUNCTION
    function formatValue(value: number) {

      let newValue: string;
  
      if(value < 10) {
        return newValue = '0' + value;
      } else {
        return newValue = value.toString();
      }
      
    }

  }

  ngOnInit() {

    // CHART DATA SUBSCRIBER
    this.chartData = this.chartService.chartData;
    this.chartData.subscribe(data => {

      if(data.length > 0) {

        this.allChartData.length = 0;
        this.allChartData = data;

        // RENDER CHART DATA
        this.renderChartData(this.lineChartData, this.lineChartLabels, this.chart);

      }

    });

    // SOCKET DATA 
    this.socketData = this.socketService.environment;
    this.socketData.subscribe(data => {

      if(data.length > 0) {
        this.pushNewData(data);
      }
      
    });

  }

}

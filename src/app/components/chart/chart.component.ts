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
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
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
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
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

      this.renderChartData(this.lineChartData, this.lineChartLabels, this.chart);
  
  }

  // PUSH NEW DATA TO THE CHART
  pushNewData(data: any): void {

    if(!this.chart.chart) {

      setTimeout(()=> {
        this.pushNewData(data);
      }, 100);

    } else {

      this.lineChartData[0].data.push(data[0].temperature);
      this.lineChartData[1].data.push(data[0].humidity);

      let newTime = new Date();

      this.lineChartLabels.push(formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes()) + ':' + formatValue(newTime.getSeconds()));

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

    if (this.farm.length == 0) {

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

    if(this.selectedDataPeriod == 'minutes') {

      // 1 HOUR IN MILLY SECONDS
      const hourMilly = 3600 * 1000;
      
      // CALCULATING INTERVAL
      fromTime = new Date(lastTime - hourMilly).getTime();

    }

    if(this.selectedDataPeriod == 'hours') {

      // 24 HOURS IN MILLY SECONDS
      const dayMilly = 24 * 3600 * 1000;

      // CALCULATING INTERVAL
      fromTime = new Date(lastTime - dayMilly).getTime();
      
    }

    if(this.selectedDataPeriod == 'days') {
      
      // MONTH IN MILLY SECONDS
      const monthMilly = 31 * 24 * 3600 * 1000;

      // CALCULATING INTERVAL
      fromTime = new Date(lastTime - monthMilly).getTime();

    }
    
    for(let i = 0; i < this.allChartData.length; i++) {
    
      let newTime = new Date(this.allChartData[i].date);

      if(newTime.getTime() > fromTime) {
        
        lineChartData[0].data.push(this.allChartData[i].temperature);
        lineChartData[1].data.push(this.allChartData[i].humidity);

        if(this.selectedDataPeriod == 'minutes') {
          lineChartLabels.push(formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes()) + ':' + formatValue(newTime.getSeconds()));
        }
        
        if(this.selectedDataPeriod == 'hours') {
          lineChartLabels.push(formatValue(newTime.getDate()) + '/' + formatValue(newTime.getMonth()) + ' ' + formatValue(newTime.getHours()) + ':' + formatValue(newTime.getMinutes()));
        }

        if(this.selectedDataPeriod == 'days') {
          lineChartLabels.push(formatValue(newTime.getDate()) + '/' + formatValue(newTime.getMonth() + 1));
        }

      } 

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

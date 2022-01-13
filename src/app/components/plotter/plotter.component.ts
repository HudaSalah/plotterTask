import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Column } from 'src/app/models/Column';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.scss'],
})
export class PlotterComponent implements OnInit {
  ColumnsObj: Column[] = [];
  echartOptions: EChartOption;

  constructor(private ApiService: ApiService) {}

  clearDimensionBox() {}
  clearMeasuresBox() {}

  getColumnsData() {
    this.ApiService.get('https://plotter-task.herokuapp.com/columns').subscribe(
      (res) => {
        this.ColumnsObj = res as Column[];
        console.log(this.ColumnsObj);
      }
    );
  }

  drawPlot(plotData){
    this.echartOptions = {
      legend: {
        data: [plotData[1].name]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        name:plotData[0].name,
        nameLocation : 'center',
        nameTextStyle:{
          color:'#1e8fff',
          fontWeight:'bold',
          fontSize :14,
        },
        type: 'category',
        boundaryGap: true,
        data: plotData[0].values,
        nameGap:20,
      },
      yAxis: {
        name:plotData[1].name,
        nameLocation : 'end',
        type: 'value',
        nameTextStyle:{
          color:'#1e8fff',
          fontWeight:'bold',
          fontSize :14,
        },
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
          return `<b>${params['name']}</b> : $ ${params['value']}`;
        }
      },
      series: [{
        name: plotData[1].name,
        type: 'line',
        stack: 'Total',
        data: plotData[1].values
      }]
    }
  }



 getPlotData(){
    let body = {
      measures:['Cost'],
      dimension: 'Product'
    }
   this.ApiService.post('https://plotter-task.herokuapp.com/data',body).subscribe(
      (res) => {
        this.drawPlot(res);
        console.log(res);
      }
    );
  }

  ngOnInit(): void {
    this.getColumnsData();
    // this.getPlotData();
  }
}

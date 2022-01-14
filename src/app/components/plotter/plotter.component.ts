import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Column } from 'src/app/models/Column';
import { EChartOption } from 'echarts';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.scss'],
})
export class PlotterComponent implements OnInit {
  ColumnsObj: Column[] = [];
  echartOptions: EChartOption;

  DimensionList: Array<any> = [];
  MeasureList: Array<any> = [];

  plotAxis = {
    measures: this.MeasureList,
    dimension: this.DimensionList,
  };
  constructor(private ApiService: ApiService) {}

  dropListEnterPredicate(list) {
    return function (drag: CdkDrag, drop: CdkDropList) {
      return list.length < 1;
    };
  }

  dimensionDrop(event: CdkDragDrop<string[]>) {
    let droppedEle =
      event.previousContainer.data[event.previousIndex]['function'];

    if (
      event.previousContainer !== event.container &&
      droppedEle == 'dimension'
    ) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.DimensionList);
    this.checkProperties(this.plotAxis)
  }

  checkProperties(obj) {
    if(obj.dimension.length>0 && obj.measures.length>0){
      let plotAxis = {
        measures: obj.measures.map(v => v.name),
        dimension: obj.dimension[0].name,
      };
      console.log(plotAxis)
      this.getPlotData(plotAxis)
    }
  }

  measuresDrop(event: CdkDragDrop<string[]>) {
    let droppedEle =
      event.previousContainer.data[event.previousIndex]['function'];

    if (
      event.previousContainer !== event.container &&
      droppedEle == 'measure'
    ) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.MeasureList);
    console.log(this.plotAxis);
    this.checkProperties(this.plotAxis)
  }

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

  drawPlot(plotData) {
    this.echartOptions = {
      legend: {
        data: [plotData[1].name],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        name: plotData[0].name,
        nameLocation: 'center',
        nameTextStyle: {
          color: '#1e8fff',
          fontWeight: 'bold',
          fontSize: 14,
        },
        type: 'category',
        boundaryGap: true,
        data: plotData[0].values,
        nameGap: 20,
      },
      yAxis: {
        name: plotData[1].name,
        nameLocation: 'end',
        type: 'value',
        nameTextStyle: {
          color: '#1e8fff',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
          return `<b>${params['name']}</b> : $ ${params['value']}`;
        },
      },
      series: [
        {
          name: plotData[1].name,
          type: 'line',
          stack: 'Total',
          data: plotData[1].values,
        },
      ],
    };
  }

  getPlotData(plotAxis) {
    this.ApiService.post(
      'https://plotter-task.herokuapp.com/data',
      plotAxis
    ).subscribe((res) => {
      this.drawPlot(res);
      console.log(res);
    });
  }

  ngOnInit(): void {
    this.getColumnsData();
  }
}

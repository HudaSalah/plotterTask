import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Column } from 'src/app/models/Column';
import { PlotData } from 'src/app/models/plot-data';
import { EChartOption } from 'echarts';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.scss'],
})
export class PlotterComponent implements OnInit {
  ColumnsObj: Column[] = [];
  PlotObjs: PlotData[] = [];
  echartOptions: EChartOption;

  DimensionList: Array<any> = [];
  MeasureList: Array<any> = [];

  plotAxis = {
    measures: this.MeasureList,
    dimension: this.DimensionList,
  };
  isShown: boolean = false;
  constructor(private ApiService: ApiService) {}

  dropListEnterPredicate(list) {
    return function (drag: CdkDrag, drop: CdkDropList) {
      return list.length < 1;
    };
  }

  onDrop(event: CdkDragDrop<string[]>, type) {
    let droppedEle =
      event.previousContainer.data[event.previousIndex]['function'];

    if (event.previousContainer !== event.container && droppedEle == type) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.checkFilledProperties(this.plotAxis);
    }
  }

  checkFilledProperties(obj) {
    if (obj.dimension.length > 0 && obj.measures.length > 0) {
      let plotAxis = {
        measures: obj.measures.map((v) => v.name),
        dimension: obj.dimension[0].name,
      };

      this.getPlotData(plotAxis);
    } else {
      // hide plot
      this.isShown = false;
    }
  }

  clearBox(list, type) {
    let oldList = list;
    if (type == 'dimension') {
      this.DimensionList = [];
      this.plotAxis.dimension = this.DimensionList;
    } else {
      this.MeasureList = [];
      this.plotAxis.measures = this.MeasureList;
    }
    this.ColumnsObj.push(...oldList);
    this.checkFilledProperties(this.plotAxis);
  }

  drawPlot(plotData) {
    let legend = [];
    let xAxisObj = plotData[0];
    //get yAxis valus & legend
    plotData.splice(0, 1);
    plotData = plotData.map((v) => ({
      name: v.name,
      data: v.values,
      type: 'line',
      stack: 'Total',
    }));

    plotData.forEach((element) => {
      legend.push(element.name);
    });

    this.isShown = true;
    this.echartOptions = {
      legend: {
        data: legend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        name: xAxisObj.name,
        nameLocation: 'center',
        nameTextStyle: {
          color: '#1e8fff',
          fontWeight: 'bold',
          fontSize: 14,
        },
        type: 'category',
        boundaryGap: true,
        data: xAxisObj.values,
        nameGap: 20,
      },
      yAxis: {
        type: 'value',
        // name: plotData[1].name,
        // nameLocation: 'end',
        // nameTextStyle: {
        //   color: '#1e8fff',
        //   fontWeight: 'bold',
        //   fontSize: 14,
        // },
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
          return `<b>${params['name']}</b> : $ ${params['value']}`;
        },
      },
      series: plotData,
    };
  }

  getPlotData(plotAxis) {
    this.ApiService.post(
      'https://plotter-task.herokuapp.com/data',
      plotAxis
    ).subscribe((res) => {
      this.PlotObjs = res as PlotData[];
      this.drawPlot(this.PlotObjs);
    },
    (err)=>{
      console.log(err)
    });
  }

  getColumnsData() {
    this.ApiService.get('https://plotter-task.herokuapp.com/columns').subscribe(
      (res) => {
        this.ColumnsObj = res as Column[];
      },
      (err)=>{
        console.log(err)
      }
    );
  }

  ngOnInit(): void {
    this.getColumnsData();
  }
}

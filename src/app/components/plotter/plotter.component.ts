import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Column } from 'src/app/models/Column';
@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.scss'],
})
export class PlotterComponent implements OnInit {
  ColumnsObj: Column[] = [];
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

  ngOnInit(): void {
    this.getColumnsData();
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlotterComponent } from './components/plotter/plotter.component';

const routes: Routes = [
  {
    path: '',
    component: PlotterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}


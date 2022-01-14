import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlotterComponent } from './components/plotter/plotter.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PlotterComponent,
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}


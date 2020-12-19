import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainGridComponent } from './main-grid.component';


const routes: Routes = [
  {
    path: '',
    component: MainGridComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainGridRoutingModule { }

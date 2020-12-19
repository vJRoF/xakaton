import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainGridRoutingModule } from './main-grid-routing.module';
import { MainGridComponent } from './main-grid.component';
import { GridModule } from '@progress/kendo-angular-grid';


@NgModule({
  declarations: [
    MainGridComponent
  ],
  imports: [
    CommonModule,
    MainGridRoutingModule,
    GridModule
  ]
})
export class MainGridModule { }

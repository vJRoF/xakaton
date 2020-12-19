import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainGridRoutingModule } from './main-grid-routing.module';
import { MainGridComponent } from './main-grid.component';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { DateRangeFilterCellComponent } from './date-range-filter-cell/date-range-filter-cell.component';
import { DateInputModule, DatePickerModule, DateRangeModule } from '@progress/kendo-angular-dateinputs';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CustomKendoMessageService } from '../../../core/misc/custom-kendo-message.service';


@NgModule({
  declarations: [
    MainGridComponent,
    DateRangeFilterComponent,
    DateRangeFilterCellComponent
  ],
  exports: [
    DateRangeFilterComponent,
    DateRangeFilterCellComponent,
    CommonModule,
    DateInputModule
  ],
  providers: [
    {
      provide: MessageService,
      useClass: CustomKendoMessageService
    },
  ],
  imports: [
    CommonModule,
    MainGridRoutingModule,
    GridModule,
    DateInputModule,
    DateRangeModule,
    FormsModule,
    DatePickerModule,
    ExcelModule,
    PDFModule
  ]
})
export class MainGridModule { }

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GridDataService } from '../../../core/services/grid-data.service';
import { Observable } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { IGridDataListRes } from '../../../core/models/grid-data.model';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainGridComponent implements OnInit {

  public state: State = {
    skip: 0,
    take: 40
  };

  constructor(
    private _gridDataService: GridDataService
  ) {
    this.loadItems();
  }

  get gridDataRes$(): Observable<IGridDataListRes> {
    return this._gridDataService.gridDataRes$;
  }

  get excelIsLoading$(): Observable<boolean> {
    return this._gridDataService.excelIsLoading$;
  }

  ngOnInit(): void {
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.loadItems();
  }

  private loadItems(): void {
    this._gridDataService.getGridDataList(this.state);
  }

  public exportToExcel(): void {
    this._gridDataService.exportToExcel(this.state);
  }
}

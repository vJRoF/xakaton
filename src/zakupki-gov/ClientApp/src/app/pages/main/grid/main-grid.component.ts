import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { GridDataService } from '../../../core/services/grid-data.service';
import { Observable, Subscription } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { IGridDataListRes } from '../../../core/models/grid-data.model';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type CompositeOrSimpleFilter = FilterDescriptor | CompositeFilterDescriptor;

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainGridComponent implements OnInit, OnDestroy {

  private _queryParamsSub: Subscription;

  public state: State = {
    skip: 0,
    take: 40
  };

  constructor(
    private _gridDataService: GridDataService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
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
    this._queryParamsSub = this._activatedRoute.queryParams
      .pipe(filter(res => !!res.take))
      .subscribe((res) => {
        this.state.filter = res.filter ? JSON.parse(res.filter) : res.filter;
        this.state.sort = res.sort ? JSON.parse(res.sort) : res.sort;
        this.state.group = res.group ? JSON.parse(res.group) : res.group;
        this.state.skip = res.skip ? JSON.parse(res.skip) : res.skip;
        this.state.take = res.take ? JSON.parse(res.take) : res.take;
        this.loadItems();
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    const gridFilter = state.filter ? { ...state.filter } : undefined;

    if (gridFilter) {
      this._transformFilters(gridFilter.filters);
    }

    this._router.navigate([], {
      queryParams: {
        take: state.take,
        skip: state.skip,
        sort: JSON.stringify(state.sort),
        filter: JSON.stringify(gridFilter),
        group: JSON.stringify(state.group)
      }
    });
  }

  private _transformFilters(filters: Array<CompositeOrSimpleFilter>): void {
    if (filters) {
      filters.forEach((f: CompositeOrSimpleFilter) => {
        if ((f as CompositeFilterDescriptor).filters) {
          this._transformFilters((f as CompositeFilterDescriptor).filters);
        } else {
          const v = (f as FilterDescriptor).value;
          if (v && v instanceof Date) {
            (f as FilterDescriptor).value = v.toISOString();
          }
        }
      });
    }
  }

  private loadItems(): void {
    this._gridDataService.getGridDataList(this.state);
  }

  public exportToExcel(): void {
    this._gridDataService.exportToExcel(this.state);
  }

  ngOnDestroy() {
    this._queryParamsSub.unsubscribe();
  }
}

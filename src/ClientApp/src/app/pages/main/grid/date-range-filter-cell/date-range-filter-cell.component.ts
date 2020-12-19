import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';

import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';

import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-date-range-filter-cell',
  templateUrl: './date-range-filter-cell.component.html',
  styleUrls: ['./date-range-filter-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeFilterCellComponent extends BaseFilterCellComponent implements OnDestroy {
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public field: string;

  private _destroy$ = new Subject<boolean>();

  private _start: Date;
  public get start(): Date {
    const first = this.findByOperator('gte');
    return first ? new Date(first.value) : null;
  }
  public set start(date: Date) {
    this._start =  date;
  }

  private _end: Date;
  public get end(): Date {
    const end = this.findByOperator('lte');
    return end ? new Date(end.value) : null;
  }
  public set end(date: Date) {
    this._end = date;
  }

  constructor(filterService: FilterService, private _cdr: ChangeDetectorRef) {
    super(filterService);
    this.filterService.changes
      .pipe(
        filter(f => !!f),
        map(filterDescriptor => filterDescriptor.filters),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe(res => {
        this._cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public filterRange(start: Date, end: Date): void {
    this.filter = this.removeFilter(this.field);

    const filters = [];

    if (start) {
      filters.push({
        field: this.field,
        operator: 'gte',
        value: start
      });
    }

    if (end) {
      const date = new Date(end.getTime());
      date.setHours(23, 59, 59, 999);
      filters.push({
        field: this.field,
        operator: 'lte',
        value: date
      });

    }

    const root = this.filter || {
      logic: 'and',
      filters: []
    };

    if (filters.length) {
      root.filters.push(...filters);
    }

    this.filterService.filter(root);
  }

  private findByOperator(op: string): FilterDescriptor {
    return this.filtersByField(this.field)
      .filter(({ operator }) => operator === op)[0];
  }

}

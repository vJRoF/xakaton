import { Component, Input, OnInit, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, SinglePopupService, PopupCloseEvent } from '@progress/kendo-angular-grid';
import { addDays } from '@progress/kendo-date-math';

import { Subscription } from 'rxjs';

const closest = (node: Node | Element, predicate: (a: Node | Element) => boolean): Node | Element => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  public start: Date;
  public end: Date;

  public get min(): Date {
    return this.start ? addDays(this.start, 1) : null;
  }

  public get max(): Date {
    return this.end ? addDays(this.end, -1) : null;
  }

  public popupSettings = {
    popupClass: 'date-range-filter'
  };

  private popupSubscription$: Subscription;

  constructor(private element: ElementRef,
              private popupService: SinglePopupService) {

    // Handle the service onClose event and prevent the menu from closing when the datepickers are still active.
    this.popupSubscription$ = popupService.onClose.subscribe((e: PopupCloseEvent) => {
      if (document.activeElement && closest(document.activeElement,
        node => node === this.element.nativeElement || (String(node['className']).indexOf('date-range-filter') >= 0))) {
        e.preventDefault();
      }
    });
  }

  public ngOnInit(): void {
    this.start = this._findValue('gte');
    this.end = this._findValue('lte');
  }

  public ngOnDestroy(): void {
    this.popupSubscription$.unsubscribe();
  }

  public onStartChange(value: Date): void {
    this._filterRange(value, this.end);
  }

  public onEndChange(value: Date): void {
    this._filterRange(this.start, value);
  }

  private _findValue(operator: string): Date {
    const filter = this.filter.filters.filter(x => x['field'] === this.field && x['operator'] === operator)[0];
    return filter ? new Date(filter['value']) : null;
  }

  private _filterRange(start: Date, end: Date): void {
    const filters = [];

    if (start && (!end || start < end)) {
      filters.push({
        field: this.field,
        operator: 'gte',
        value: start
      });
      this.start = start;
    }

    if (end && (!start || start < end)) {
      filters.push({
        field: this.field,
        operator: 'lte',
        value: end
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: 'and',
      filters
    });
  }

}

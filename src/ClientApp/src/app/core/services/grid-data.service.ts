import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IGridDataListRes } from '../models/grid-data.model';
import { toDataSourceRequestString } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private _gridDataRes$: Subject<IGridDataListRes> = new Subject();
  public gridDataRes$: Observable<IGridDataListRes> = this._gridDataRes$.asObservable();

  constructor(
    private _httpClient: HttpClient
  ) {}

  public getGridDataList(req: State): void {
    this._httpClient.get<IGridDataListRes>(`api/purchases/list?${toDataSourceRequestString(req)}`)
      .pipe(map(res => {
        return {
          total: res.total,
          aggregates: res.aggregates,
          data: res.data.map(d => {
            d.createdDate = new Date(d.createdAt);
            return d;
          })
        };
      }))
      .subscribe(res => this._gridDataRes$.next(res));
  }
}

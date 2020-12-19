import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IGridDataListRes } from '../models/grid-data.model';
import { toDataSourceRequestString } from '@progress/kendo-data-query';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private _gridDataRes$: Subject<IGridDataListRes> = new Subject();
  public gridDataRes$: Observable<IGridDataListRes> = this._gridDataRes$.asObservable();

  private _excelIsLoading$: Subject<boolean> = new Subject();
  public excelIsLoading$: Observable<boolean> = this._excelIsLoading$.asObservable();

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

  public exportToExcel(req: State): void {
    this._excelIsLoading$.next(true);
    this._httpClient
      .get(`api/purchases/export?${toDataSourceRequestString(req)}`, { responseType: 'arraybuffer', observe: 'response' })
      .pipe(tap((res: HttpResponse<any>) => {
        this._excelIsLoading$.next(false);
        const filename = 'zakupki.xlsx';
        const contentType = res.headers.get('content-type');
        const blob = new Blob([res.body], { type: contentType });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(
            blob,
            filename
          );
        } else {
          const a = document.createElement('a');
          const url = URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      })).subscribe();
  }
}

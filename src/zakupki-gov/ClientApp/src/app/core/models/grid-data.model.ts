export interface IGridDataListRes {
  data: Array<IGridDataList>;
  total: number;
  aggregates: Array<any>;
}

export interface  IGridDataList {
  id: number;
  description?:	string;
  url?: string;
  customerName?: string;
  puchaseSource?: string;
  createdAt: Date | string;
  sum: number;
  supplierName?: string;
  supplierINN?: string;
  loadID: string;
}

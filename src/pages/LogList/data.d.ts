export interface LogListItem {
  id?: number;
  message?: string;
  userInfo?: string;
  requestUrl?: string;
  responseStatus?: number;
  methodName?: string;
  logParameters?: [];
  date?: string;
  audit?: string;
  PageSize?: number;
  PageNumber?: number;
  TotalSize?:number;
  filter?: { [key: string]: any[] };
}

export interface GroupListItem {
  id?: number;
  name?: string;
  operationClaimIds?:number[];
  PageSize?: number;
  PageNumber?: number;
  TotalSize?:number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
}
export interface OperationClaim{
  id?:number;
  name?:string;
  groupId?:number;
}

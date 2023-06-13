export interface LanguageListItem {
  id?: number;
  token?:string;
  name?: string;
  abbreviationName?: string;
  status?: boolean;
  flagPath?: string;
  updatedAt?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  PageSize?: number;
  PageNumber?: number;
  TotalSize?: number;
  filter?: { [key: string]: any[] };
}

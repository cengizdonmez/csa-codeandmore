export interface SliderListItem {
  id?: number;
  languageId?: number;
  iconPath?: string;
  icon?:any;
  status?: boolean;
  rowNumber?: number;
  title?: string;
  color?: string;
  opacity?: number;
  createDate?: string;
  updateDate?: string;
  PageSize?: number;
  PageNumber?: number;
  TotalSize?:number;
  filter?: { [key: string]: any[] };
}

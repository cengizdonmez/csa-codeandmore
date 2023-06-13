import { message } from "antd";
export interface WebPageCreateFields {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  sort_Description?: string;
  html_Content?: string;
  html_History?: string;
  hit?: number;
  read_Count?: number;
  seo_Title?: string;
  seo_Keyword?: string;
  seo_Description?: string;
  create_Date?: string;
  last_Updated?: string;
  cover_Image?: string;
  thumbnail?: string;
  publish_Status?: number;
  setting?: string;
  similar_Webpage?: string;
  token?: string;
  pageTemplate?: number;
  contentType?: number;
  content?: string;
  themeType?: string;
  videoId?: string;
  sideBarStatus?: string;
  contentBarStatus?: string;
  standByStatus: boolean;
  coverImageStatus:boolean;
  variables:string;
  langCode: string;
}
export interface RouteContent {
  id?: number;
  slug?: string;
  fullUrl?: string;
  tableName?: string;
  pageName?: string;
  langCode?: string;
  status?: number;
  sideBarStatus?: string;
  contentBarStatus?: string;
  standByStatus?: boolean;
}
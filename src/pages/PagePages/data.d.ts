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

export interface WebPage {
  id?: number;
  name?: string;
  description?: string;
  slug?: string;
  create_Date?: string;
  publish_Status?: number;
  last_Update?: string;
}

export interface WebPageOne {
  id?: number;
  name?: string;
  slug?: string;
  fullUrl: string;
  description?: string;
  sort_Description?: null;
  langCode: string;
  html_Content?: string;
  html_History?: null;
  hit?: number;
  read_Count?: number;
  seo_Title?: string;
  seo_Keyword?: string;
  seo_Description?: string;
  create_Date?: string;
  last_Updated?: null;
  cover_Image?: null;
  thumbnail?: string;
  publish_Status?: number;
  setting?: null;
  similar_Webpage?: string;
  token?: string;
  pageTemplate?: number;
  redirectRouteId?: number;
  contentType?: number;
  content?: string;
  themeType?: string;
  videoId?: string;
  coverImageStatus: boolean;
  standByStatus: boolean;
  variables?:string;
}

export interface PendingPageRequest {
  fullUrl: string;
  LangCode: string;
}
export interface PendingPageResponse {
  data: WebPageOne;
  message: string;
  success: boolean;
}

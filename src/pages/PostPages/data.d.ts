export interface Post {
  id?: number;
  name?: string;
  slug?: string;
  fullUrl:string;
  langCode:string;
  description?: string;
  seo_Title?: string;
  seo_Keyword?: string;
  seo_Description?: string;
  create_Date?: Date;
  last_Updated?: Date;
  sort_Order?: number;
  cover_Image?: string;
  thumbnail?: string;
  publish_Status?: number;
  setting?: string;
  parent?: number;
  html_Content?: string;
  similar_Webpost?: string;
  token?: string;
  sort_Description?: string;
  author: string;
  standByStatus:boolean;
}
export interface PostCreateFields {
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
  create_Date?: Date;
  last_Updated?: Date;
  cover_Image?: string;
  thumbnail?: string;
  publish_Status?: number;
  setting?: string;
  similar_Webpost?: string;
  token?: string;
  author: string;
  sideBarStatus?: string;
  contentBarStatus?: string;
  componentArea?:string;
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
export interface CategoryCreateFields {
  id?: number;
  name: string;
  slug: string;
  description: string;
  seo_Title: string;
  seo_Keyword: string;
  seo_Description: string;
  cover_Image: string;
  thumbnail: string;
  publish_Status: number;
  setting?: string;
  parent?: number;
}

export interface Category {
  create_Date: string;
  description: string;
  id: number;
  last_Update: string;
  name: string;
  publish_Status: number;
  slug: string;
  fullUrl:string;
  langCode:string;
}

export interface CategoryOne {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  seo_Title?: string;
  seo_Keyword?: string;
  seo_Description?: string;
  create_Date?: Date;
  last_Updated?: null;
  sort_Order?: number;
  cover_Image?: string;
  thumbnail?: string;
  publish_Status?: number;
  setting?: null;
  parent?: number;
  token?:string;
}

export interface OrderCriteria {
  orderPostArea: Array<string>;
  orderPostCriterion: Array<string>;
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
export const menuUrls = {
  list: '/Menu/getall',
  add: '/Menu/add',
  edit: '/Menu/update',
  delete: '/Menu/delete?token=',
  listbylang: '/Menu/getbylangcode',
};
export interface Menu {
  id?: number;
  language_Code?: string;
  name?: string;
  positionValue?: string;
  slug?: string;
  setting?: string;
  createDate?: Date;
  updateDate?: Date;
  createdBy?: null;
  updatedBy?: string;
  langCode?: string;
  token?: string;
  items: string;
}

export interface MenuCreateField {
  id?: number;
  language_Code?: string;
  name?: string;
  positionValue?: string;
  slug?: string;
  setting?: string;
  createDate?: Date;
  updateDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  langCode?: string;
  token?: string;
  items: string;
}

export interface ThemeSettingData {
  theme_setting: ThemeSetting[];
}

export interface ThemeSetting {
  title: string;
  setting: Setting[];
  status: boolean;
  rownumber: number;
  ranking: boolean;
  hidden: boolean;
  key: string;
  type: 'form';
}

export interface Setting {
  description: string;
  title: string;
  status: boolean;
  itemlist?: Item[];
  key: string;
  value: string;
  itemtype: itemType;
}

export interface Item {
  key: string;
  name: string;
  type: itemType;
}

export type itemType =
  | 'textbox'
  | 'image'
  | 'textarea'
  | 'numeric'
  | 'color'
  | 'json_form'
  | 'selectbox_merkezler'
  | 'multiselect_doktorlar'
  | 'multiselect_tibbibirim'
  | 'multiselect_tibbibirim_list'
  | 'multiselect_kategoriler'
  | 'selectbox_pages'
  | 'texteditor';

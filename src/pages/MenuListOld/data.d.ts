export interface Menu {
  id?: number,
  language_Code?: string,
  name?: string,
  positionValue?: string,
  slug?: string,
  setting?: string,
  token?: string
}
export interface MenuItem {
  id?: number,
  name?: string,
  slug?: string,
  target?: string,
  icon?: string,
  color?: string,
  itemtype?: string,
  webmenu?: string,
  webcategories?: string,
  webpage?: string,
  parentId?: number,
  menuId?: number,
}

export interface Setting {
  id?: number;
  name?: string;
  jsonContent?: MenuPosition;
}
export interface MenuPosition {
  menuposition?: {
    description?: string;
    maxDepth?: number;
    menupositionid?: any;
    name?: string;
    relatives?: Relative[]
  }
}
export interface Relative {
  name?: string;
  value?: string;
}


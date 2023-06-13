import {Effect, Reducer} from 'umi';
import {
  addMenu,
  addMenuItem,
  addMenuItemList,
  getByIdMenu,
  getByNameSetting,
  getListByMenuId,
  queryMenu,
  queryMenuItem,
  querySetting,
  removeMenu,
  removeMenuItem,
  updateMenu,
  updateMenuItem,
  updateMenuItemList,
  updateSetting
} from './service';

import {Menu, MenuItem, Setting} from './data';

export interface MenuStateType {
  menuList?: Menu[];
  menuItemList?: MenuItem[];
  settingList?: Setting[];
  setting?: Setting;
  menu?: Menu;
  menuItemListByMenuId?: MenuItem[];
}

export interface MenuModelType {
  namespace: string;
  state: MenuStateType;
  effects: {
    fetchMenu: Effect;
    fetchMenuById: Effect;
    submitMenu: Effect;
    fetchMenuItem: Effect;
    submitMenuItem: Effect;
    fetchSetting: Effect;
    fetchSettingByName: Effect;
    fetchMenuItemByMenuId: Effect;
    addMenuItemList: Effect;
    submitSetting: Effect;
  };
  reducers: {
    queryMenuList: Reducer<MenuStateType>;
    queryMenuById: Reducer<MenuStateType>;
    queryMenuItemList: Reducer<MenuStateType>;
    querySettingList: Reducer<MenuStateType>;
    querySettingByName: Reducer<MenuStateType>;
    queryMenuItemByMenuId: Reducer<MenuStateType>;
  };
}

const Model: MenuModelType = {
  namespace: 'menuList',

  state: {
    menuList: [],
    menuItemList: [],
    settingList: [],
    setting: {},
    menu: {},
    menuItemListByMenuId: []
  },

  effects: {
    * fetchMenu({payload}, {call, put}) {
      const response = yield call(queryMenu, payload);
      yield put({
        type: 'queryMenuList',
        payload: response || [],
      });
      if(payload&&payload.onSuccess)
      {payload.onSuccess()}
    },
    * submitMenu({payload}, {call, put}) {
      let callback;
      if (payload.token) {
        callback = removeMenu;
        yield call(callback, payload);
        yield put({type: 'fetchMenu'});
        if(payload&&payload.onSuccess)
        {payload.onSuccess()}
      } else if (payload.id) {
        callback = Object.keys(payload).length === 2 ?? updateMenu;
        yield call(callback, payload);
        yield put({type: 'fetchMenu'});
      } else {
        callback = addMenu;
        const response = yield call(callback, payload);
        yield put({
          type: 'fetchMenu',
          payload: {onSuccess :()=> payload.onSuccess(response.id) },
        });
      }
    },
    * fetchMenuItem({payload}, {call, put}) {
      const response = yield call(queryMenuItem, payload);
      yield put({
        type: 'queryMenuItemList',
        payload: response.data ? response.data : [],
      });
    },
    * submitMenuItem({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        const {onSuccess, ...rest} = payload;
        callback = Object.keys(rest).length === 1 ? removeMenuItem : updateMenuItem;
      } else {
        callback = addMenuItem;
      }
      const response = yield call(callback, payload);
      yield put({
        type: 'queryMenuItemList',
        payload: response,
      });
    },
    * addMenuItemList({payload}, {call, put}) {
      const {menuItemList, menuId, deletedItems} = payload;
      const updateList = menuItemList.filter(item => item.id > 0)
      const addList = menuItemList.filter(item => item.id < 0)

      if (updateList.length > 0) {
        yield call(updateMenuItemList, updateList, menuId)
      }
      if (addList.length > 0) {
        const addListwthId =addList.map((item)=>{const {id, ...rest} = item; return rest });
        yield call(addMenuItemList, addListwthId, menuId);
      }
    },
    * fetchSetting({payload}, {call, put}) {
      const response = yield call(querySetting, payload);
      yield put({
        type: 'querySettingList',
        payload: response || [],
      });
    },
    * submitSetting({payload}, {call, put}) {
      const response = yield call(updateSetting, payload);
      yield put({type: 'fetchSetting'});
    }
    ,
    * fetchSettingByName({payload}, {call, put}) {
      const response = yield call(getByNameSetting, payload);
      yield put({
        type: 'querySettingByName',
        payload: response || {},
      });
    },
    * fetchMenuItemByMenuId({payload, onSuccess}, {call, put}) {
      const response = yield call(getListByMenuId, payload);
      yield put({
        type: 'queryMenuItemByMenuId',
        payload: response || [],
      });
      if (onSuccess) {
        onSuccess(response)
      }
    },
    * fetchMenuById({payload}, {call, put}) {
      const response = yield call(getByIdMenu, payload);
      yield put({
        type: 'queryMenuById',
        payload: response || {},
      });
      if (payload.onSuccess)
        payload.onSuccess()
    },
  },

  reducers: {
    queryMenuList(state, action) {
      return {
        ...state,
        menuList: action.payload,
      };
    },
    queryMenuItemList(state, action) {
      return {
        ...state,
        menuItemList: action.payload,
      };
    },
    querySettingList(state, action) {
      return {
        ...state,
        settingList: action.payload,
      };
    },
    querySettingByName(state, action) {
      return {
        ...state,
        setting: action.payload,
      };
    },
    queryMenuItemByMenuId(state, action) {
      return {
        ...state,
        menuItemListByMenuId: action.payload,
      };
    },
    queryMenuById(state, action) {
      return {
        ...state,
        menu: action.payload,
      };
    },
  },
};
export default Model;


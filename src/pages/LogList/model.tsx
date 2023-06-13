import {Effect, Reducer} from 'umi';
import {queryLog} from './service';

import {LogListItem} from './data.d';

export interface LogStateType {
  list: LogListItem[];
}

export interface LogModelType {
  namespace: string;
  state: LogStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<LogStateType>;
  };
}

const Model: LogModelType = {
  namespace: 'logList',

  state: {
    list: [],
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryLog, payload);
      yield put({
        type: 'queryList',
        payload: response.data ? response.data : [],
      });
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    }
  },
};
export default Model;


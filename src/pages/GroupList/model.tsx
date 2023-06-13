import {Effect, Reducer} from 'umi';
import {addGroup, queryGroup, removeGroup, updateGroup} from './service';

import {GroupListItem} from './data.d';

export interface GroupStateType {
  list: GroupListItem[];
}

export interface GroupModelType {
  namespace: string;
  state: GroupStateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<GroupStateType>;
    appendList: Reducer<GroupStateType>;
  };
}

const Model: GroupModelType = {
  namespace: 'groupList',

  state: {
    list: [],
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: 'queryList',
        payload: response.data ? response.data : [],
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.token)
        callback = removeGroup
      else if (payload.id) {
        callback = updateGroup;
      } else {
        callback = addGroup;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'fetch',
        payload: {
          PageSize: 20,
          PageNumber: (1)
        }
      });

    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = {list: []}, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
export default Model;


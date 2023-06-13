import {Effect, Reducer} from 'umi';
import {addLanguage, queryLanguage, removeLanguage, updateLanguage} from './service';

import {LanguageListItem} from './data.d';

export interface LanguageStateType {
  list: LanguageListItem[];
}

export interface ModelType {
  namespace: string;
  state: LanguageStateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<LanguageStateType>;
    appendList: Reducer<LanguageStateType>;
  };
}

const Model: ModelType = {
  namespace: 'languageList',
  state: {
    list: []
  },
  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryLanguage, payload);
      yield put({
        type: 'queryList',
        payload: response.data ? response.data : [],
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(queryLanguage, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * submit({payload, onSuccess, onFailure}, {call, put}) {
      let callback;
      if (payload.token) {
        callback = Object.keys(payload).length === 1 ? removeLanguage : updateLanguage;
      } else {
        callback = addLanguage;
      }
      try {
        const response = yield call(callback, payload);
        if (onSuccess) {
          onSuccess()

        }
      } catch (e) {
        const {data} = e;
        if (onFailure) {
          onFailure(data)
        }
      }

      yield put({
        type: 'fetch', payload: {
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

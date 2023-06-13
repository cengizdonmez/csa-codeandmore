import {Effect, Reducer} from 'umi';
import {addSlider, querySlider, removeSlider, updateSlider} from './service';

import {SliderListItem} from './data.d';

export interface SliderStateType {
  list: SliderListItem[];
}

export interface SliderModelType {
  namespace: string;
  state: SliderStateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<SliderStateType>;
    appendList: Reducer<SliderStateType>;
  };
}

const Model: SliderModelType = {
  namespace: 'sliderList',

  state: {
    list: [],
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(querySlider, payload);
      yield put({
        type: 'queryList',
        payload: response.data ? response.data : [],
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(querySlider, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.key) {
        callback = Object.keys(payload).length === 1 ? removeSlider : updateSlider;
      } else {
        callback = addSlider;
      }
      const response = yield call(callback, payload); // post
      yield put({type: 'sliderList/fetch'});
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


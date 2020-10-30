import { Reducer } from 'redux';
import { Effect } from 'alita';

export interface AboutUsModelState {
  name: string;
}

export interface AboutUsModelType {
  namespace: 'common';
  state: AboutUsModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<AboutUsModelState>;
  };
}

const AboutUsModel: AboutUsModelType = {
  namespace: 'common',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      console.log(data);
      yield put({
        type: 'save',
        payload: { name: data.text },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default AboutUsModel;

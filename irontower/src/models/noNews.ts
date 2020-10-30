import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface NoNewsModelState {
  name: string;
}

export interface NoNewsModelType {
  namespace: 'noNews';
  state: NoNewsModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<NoNewsModelState>;
  };
}

const NoNewsModel: NoNewsModelType = {
  namespace: 'noNews',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      // const data = yield call(query, payload);
      // console.log(data)
      // yield put({
      //   type: 'save',
      //   payload: { name: data.text },
      // });
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

export default NoNewsModel;

import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface NewsCardModelState {
  name: string;
}

export interface NewsCardModelType {
  namespace: 'newsCard';
  state: NewsCardModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<NewsCardModelState>;
  };
}

const NewsCardModel: NewsCardModelType = {
  namespace: 'newsCard',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      console.log(data)
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

export default NewsCardModel;

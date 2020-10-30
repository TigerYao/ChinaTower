import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface MyCardModelState {
  name: string;
}

export interface MyCardModelType {
  namespace: 'myCard';
  state: MyCardModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MyCardModelState>;
  };
}

const MyCardModel: MyCardModelType = {
  namespace: 'myCard',

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

export default MyCardModel;

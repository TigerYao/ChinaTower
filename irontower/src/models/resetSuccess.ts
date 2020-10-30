import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface ResetSuccessModelState {
  name: string;
}

export interface ResetSuccessModelType {
  namespace: 'resetSuccess';
  state: ResetSuccessModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ResetSuccessModelState>;
  };
}

const ResetSuccessModel: ResetSuccessModelType = {
  namespace: 'resetSuccess',

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

export default ResetSuccessModel;

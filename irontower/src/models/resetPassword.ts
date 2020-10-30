import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface ResetPasswordModelState {
  name: string;
}

export interface ResetPasswordModelType {
  namespace: 'resetPassword';
  state: ResetPasswordModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ResetPasswordModelState>;
  };
}

const ResetPasswordModel: ResetPasswordModelType = {
  namespace: 'resetPassword',

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

export default ResetPasswordModel;

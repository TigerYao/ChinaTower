import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface UserAgreementModelState {
  name: string;
}

export interface UserAgreementModelType {
  namespace: 'userAgreement';
  state: UserAgreementModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<UserAgreementModelState>;
  };
}

const UserAgreementModel: UserAgreementModelType = {
  namespace: 'userAgreement',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call();
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

export default UserAgreementModel;

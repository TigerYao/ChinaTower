import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import {
  getCityDepositAmount,
} from '@/services/netRequest';

export interface DepositModelState {
  depositAmount: string;
}

export interface DepositModelType {
  namespace: 'deposit';
  state: DepositModelState;
  effects: {
    getCityDepositAmount: Effect;
  };
  reducers: {
    save: Reducer<DepositModelState>;
  };
}

const DepositModel: DepositModelType = {
  namespace: 'deposit',

  state: {
    depositAmount: '',
  },

  effects: {
    *getCityDepositAmount({ payload }, { call, put }) {
      const { resultObject } = yield call(getCityDepositAmount, payload);
      yield put({
        type: 'save',
        payload: { depositAmount: resultObject },
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

export default DepositModel;

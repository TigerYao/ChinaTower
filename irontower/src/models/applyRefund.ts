import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  subApplyRefund,
} from '@/services/netRequest';

export interface ApplyRefundModelState {
  name: string;
}

export interface ApplyRefundModelType {
  namespace: 'applyRefund';
  state: ApplyRefundModelState;
  effects: {
    subApplyRefund: Effect;
  };
  reducers: {
    save: Reducer<ApplyRefundModelState>;
  };
}

const ApplyRefundModel: ApplyRefundModelType = {
  namespace: 'applyRefund',

  state: {
    name: '',
  },

  effects: {
    *subApplyRefund({ payload }, { call, put }) {
      const res = yield call(subApplyRefund, payload);
      if (res.resultCode === '000') {
        payload.callback && payload.callback();
      }
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

export default ApplyRefundModel;

import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  getApplyRefundInfo,
} from '@/services/netRequest';

export interface ApplyRefundDetailModelState {
  applyRefundInfo: any;
}

export interface ApplyRefundDetailModelType {
  namespace: 'applyRefundDetail';
  state: ApplyRefundDetailModelState;
  effects: {
    getApplyRefundInfo: Effect;
  };
  reducers: {
    save: Reducer<ApplyRefundDetailModelState>;
  };
}

const ApplyRefundDetailModel: ApplyRefundDetailModelType = {
  namespace: 'applyRefundDetail',

  state: {
    applyRefundInfo: {},
  },

  effects: {
    *getApplyRefundInfo({ payload }, { call, put }) {
      const { resultObject } = yield call(getApplyRefundInfo, payload);
      yield put({
        type: 'save',
        payload: { applyRefundInfo: resultObject },
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

export default ApplyRefundDetailModel;

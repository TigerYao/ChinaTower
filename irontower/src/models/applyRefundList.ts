import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  getApplyRefundList,
} from '@/services/netRequest';

export interface ApplyRefundListModelState {
  refundList: Array<any>;
}

export interface ApplyRefundListModelType {
  namespace: 'applyRefundList';
  state: ApplyRefundListModelState;
  effects: {
    getApplyRefundList: Effect;
  };
  reducers: {
    save: Reducer<ApplyRefundListModelState>;
  };
}

const ApplyRefundListModel: ApplyRefundListModelType = {
  namespace: 'applyRefundList',

  state: {
    refundList: [],
  },

  effects: {
    *getApplyRefundList({ payload }, { call, put }) {
      const { resultObject } = yield call(getApplyRefundList, payload);
      // console.log('getApplyRefundList=====', data);
      yield put({
        type: 'save',
        payload: { refundList: resultObject },
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

export default ApplyRefundListModel;

import { Reducer } from 'redux';
import { getCouponInfoByOrderId } from '@/services/netRequest';
import { Effect } from 'alita';

export interface CouponsDetailModelState {
  couponsInfo: any;
}

export interface CouponsDetailModelType {
  namespace: 'couponsDetail';
  state: CouponsDetailModelState;
  effects: {
    getCouponInfoByOrderId: Effect;
  };
  reducers: {
    save: Reducer<CouponsDetailModelState>;
  };
}

const CouponsDetailModel: CouponsDetailModelType = {
  namespace: 'couponsDetail',

  state: {
    couponsInfo: {},
  },

  effects: {
    *getCouponInfoByOrderId({ payload }, { call, put }) {
      const { resultCode, resultObject } = yield call(getCouponInfoByOrderId, payload);

      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: { couponsInfo: resultObject },
        });
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

export default CouponsDetailModel;

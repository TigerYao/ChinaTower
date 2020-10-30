import { Reducer } from 'redux';
import { getCouponInfoByDriverId, enableCouponById } from '@/services/netRequest';
import { Effect } from 'alita';
import { getUserInfo } from '@/utils';

export interface CouponsViewModelState {
  couponList: Array<any>;
}

export interface CouponsViewModelType {
  namespace: 'couponsView';
  state: CouponsViewModelState;
  effects: {
    getCouponInfoByDriverId: Effect;
    enableCouponById: Effect;
  };
  reducers: {
    save: Reducer<CouponsViewModelState>;
  };
}

const CouponsViewModel: CouponsViewModelType = {
  namespace: 'couponsView',

  state: {
    couponList: [],
  },

  effects: {
    *getCouponInfoByDriverId({ payload }, { call, put }) {
      const { resultCode, resultObject = [] } = yield call(getCouponInfoByDriverId, {
        type: payload.type,
        userId: getUserInfo().driverId,
      });

      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: { couponList: resultObject },
        });
      }
    },
    *enableCouponById({ payload = {} }, { call, put }) {
      const { resultCode } = yield call(enableCouponById, {
        couponNo: payload.couponNo,
        phone: getUserInfo().phoneNumber,
      });

      if (resultCode === '000') {
        yield put({
          type: 'getCouponInfoByDriverId',
          payload: { type: payload.type },
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

export default CouponsViewModel;

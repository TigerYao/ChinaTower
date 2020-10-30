import { Reducer } from 'redux';
import { getPckageConfigList } from '@/services/netRequest';
import { Effect } from 'alita';
import { Toast } from 'antd-mobile';

export interface CouponModelState {
  packageList: Array<any>;
}

export interface CouponModelType {
  namespace: 'coupon';
  state: CouponModelState;
  effects: {
    getPckageConfigList: Effect;
  };
  reducers: {
    save: Reducer<CouponModelState>;
  };
}

const CouponModel: CouponModelType = {
  namespace: 'coupon',

  state: {
    packageList: [],
  },

  effects: {
    *getPckageConfigList({ payload }, { call, put }) {
      const { resultCode, resultObject, resultMsg } = yield call(getPckageConfigList, payload);
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            packageList: resultObject,
          },
        });
      } else {
        Toast.fail(resultMsg);
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

export default CouponModel;

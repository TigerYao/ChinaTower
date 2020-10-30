import { Reducer } from 'redux';
import { getOrderInfoList } from '@/services/netRequest';
import { Effect } from 'alita';

export interface MyOrderModelState {
  orderList: Array<any>;
}

export interface MyOrderModelType {
  namespace: 'myOrder';
  state: MyOrderModelState;
  effects: {
    getOrderInfoList: Effect;
  };
  reducers: {
    save: Reducer<MyOrderModelState>;
  };
}

const MyOrderModel: MyOrderModelType = {
  namespace: 'myOrder',

  state: {
    orderList: [],
  },

  effects: {
    *getOrderInfoList({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(getOrderInfoList, {
        driverId: payload.driverId,
      });

      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: { orderList: resultObject },
        });
        if (payload.callback) {
          payload.callback();
        }
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

export default MyOrderModel;

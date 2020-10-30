import { Reducer } from 'redux';
import {
  selectDepositPaymentInfoByUserId,
  selectUserAuthPaymentRecord,
} from '@/services/netRequest';
import { selectUserInfo } from '@/services/personServices';
import { Effect } from 'alita';

export interface MyWalletModelState {
  userInfo: any;
}

export interface MyWalletModelType {
  namespace: 'myWallet';
  state: MyWalletModelState;
  effects: {
    selectUserInfo: Effect;
    selectDepositPaymentInfoByUserId: Effect;
    selectUserAuthPaymentRecord: Effect;
  };
  reducers: {
    save: Reducer<MyWalletModelState>;
  };
}

const MyWalletModel: MyWalletModelType = {
  namespace: 'myWallet',

  state: {
    userInfo: {},
  },

  effects: {
    *selectUserInfo({ payload }, { call, put }) {
      const { resultObject } = yield call(selectUserInfo, payload);
      yield put({
        type: 'save',
        payload: { userInfo: resultObject },
      });
    },
    *selectDepositPaymentInfoByUserId({ payload }, { call, put }) {
      const { resultObject } = yield call(selectDepositPaymentInfoByUserId, payload);
      // yield put({
      //   type: 'save',
      //   payload: { userInfo: resultObject },
      // });
    },
    *selectUserAuthPaymentRecord({ payload }, { call, put }) {
      const { resultObject } = yield call(selectUserAuthPaymentRecord, payload);
      // yield put({
      //   type: 'save',
      //   payload: { userInfo: resultObject },
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

export default MyWalletModel;

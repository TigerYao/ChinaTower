import { Reducer } from 'redux';
import { Effect } from 'alita';
import { getPaymentInfoList } from '@/services/netRequest';
import { payMethodDict, payTypeDict } from '@/utils/constant';

export interface TradingDetailModelState {
  detailList: Array<any>;
}

export interface TradingDetailModelType {
  namespace: 'tradingDetail';
  state: TradingDetailModelState;
  effects: {
    getPaymentInfoList: Effect;
  };
  reducers: {
    save: Reducer<TradingDetailModelState>;
  };
}

const TradingDetailModel: TradingDetailModelType = {
  namespace: 'tradingDetail',

  state: {
    detailList: [],
  },

  effects: {
    *getPaymentInfoList({ payload }, { call, put }) {
      const { resultObject } = yield call(getPaymentInfoList, payload);

      yield put({
        type: 'save',
        payload: {
          detailList: resultObject || [],
        },
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

export default TradingDetailModel;

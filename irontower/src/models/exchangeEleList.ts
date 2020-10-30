import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { getLoginInfo } from '@/utils';
import { getExchangeRecord } from '@/services/netRequest';

export interface ExchangeEleListModelState {
  name: string;
  recordList: any;
  itemDetail: any;
}

export interface ExchangeEleListModelType {
  namespace: 'exchangeEleList';
  state: ExchangeEleListModelState;
  effects: {
    query: Effect;
    getExchangeRecord: Effect;
  };
  reducers: {
    save: Reducer<ExchangeEleListModelState>;
  };
}

const ExchangeEleListModel: ExchangeEleListModelType = {
  namespace: 'exchangeEleList',

  state: {
    name: '',
    recordList: [],
    itemDetail: {},
  },

  effects: {
    *query({ payload }, { call, put }) {
      // const data = yield call(query, payload);
      // console.log(data)
      // yield put({
      //   type: 'save',
      //   payload: { name: data.text },
      // });
    },
    *getExchangeRecord({ payload }, { call, put }) {
      const data = yield call(getExchangeRecord, {
        userId: getLoginInfo().driverId,
        ...payload
      });
      let recordList = [];
      if (data && data.resultObject) {
        recordList = data.resultObject;
      }
      yield put({
        type: 'save',
        payload: {
          recordList,
        }
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

export default ExchangeEleListModel;

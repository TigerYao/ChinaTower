import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { getExchangeRecordInfo } from '@/services/netRequest';

export interface ExchangeEleDetailModelState {
  name: string;
  recordInfo:any
}

export interface ExchangeEleDetailModelType {
  namespace: 'exchangeEleDetail';
  state: ExchangeEleDetailModelState;
  effects: {
    query: Effect;
    getExchangeRecordInfo: Effect;
  };
  reducers: {
    save: Reducer<ExchangeEleDetailModelState>;
  };
}

const ExchangeEleDetailModel: ExchangeEleDetailModelType = {
  namespace: 'exchangeEleDetail',

  state: {
    name: '',
    recordInfo:{}
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
    *getExchangeRecordInfo({ payload }, { call, put }) {
      const data = yield call(getExchangeRecordInfo, {
        ...payload
      });
      let recordInfo = {};
      if (data && data.resultObject) {
        recordInfo = data.resultObject;
      }
      yield put({
        type: 'save',
        payload: {
          recordInfo,
        }
      });
      if (payload.callback) {
        payload.callback(recordInfo);
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

export default ExchangeEleDetailModel;

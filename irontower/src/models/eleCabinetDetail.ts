import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { batchQueryFileInfoByIds, queryDayCabinetExchangeStatistics } from '@/services/netRequest';

export interface EleCabinetDetailModelState {
  name: string;
}

export interface EleCabinetDetailModelType {
  namespace: 'eleCabinetDetail';
  state: EleCabinetDetailModelState;
  effects: {
    query: Effect;
    batchQueryFileInfoByIds: Effect;
    queryDayCabinetExchangeStatistics: Effect;

  };
  reducers: {
    save: Reducer<EleCabinetDetailModelState>;
  };
}

const EleCabinetDetailModel: EleCabinetDetailModelType = {
  namespace: 'eleCabinetDetail',

  state: {
    name: '',
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
    *batchQueryFileInfoByIds({ payload }, { call, put }) {
      const res = yield call(batchQueryFileInfoByIds, payload);
      if (payload.callback && res) {
        payload.callback(res.resultObject && res.resultObject.length > 0 ? res.resultObject : []);
      }
    },

    *queryDayCabinetExchangeStatistics({ payload }, { call, put }) {
      const res = yield call(queryDayCabinetExchangeStatistics, payload);
      if (payload.callback && res) {
        payload.callback(res.resultObject ? res.resultObject : []);
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

export default EleCabinetDetailModel;

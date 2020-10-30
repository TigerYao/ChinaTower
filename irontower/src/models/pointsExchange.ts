import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface PointsExchangeModelState {
  name: string;
}

export interface PointsExchangeModelType {
  namespace: 'pointsExchange';
  state: PointsExchangeModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<PointsExchangeModelState>;
  };
}

const PointsExchangeModel: PointsExchangeModelType = {
  namespace: 'pointsExchange',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      console.log(data)
      yield put({
        type: 'save',
        payload: { name: data.text },
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

export default PointsExchangeModel;

import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface RefundDetailModelState {
  name: string;
}

export interface RefundDetailModelType {
  namespace: 'refundDetail';
  state: RefundDetailModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<RefundDetailModelState>;
  };
}

const RefundDetailModel: RefundDetailModelType = {
  namespace: 'refundDetail',

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

export default RefundDetailModel;

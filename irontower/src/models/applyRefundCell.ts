import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface ApplyRefundCellModelState {
  name: string;
}

export interface ApplyRefundCellModelType {
  namespace: 'applyRefundCell';
  state: ApplyRefundCellModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ApplyRefundCellModelState>;
  };
}

const ApplyRefundCellModel: ApplyRefundCellModelType = {
  namespace: 'applyRefundCell',

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

export default ApplyRefundCellModel;

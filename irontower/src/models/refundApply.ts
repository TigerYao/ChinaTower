import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface RefundApplyModelState {
  name: string;
}

export interface RefundApplyModelType {
  namespace: 'refundApply';
  state: RefundApplyModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<RefundApplyModelState>;
  };
}

const RefundApplyModel: RefundApplyModelType = {
  namespace: 'refundApply',

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

export default RefundApplyModel;

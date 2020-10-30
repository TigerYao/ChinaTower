import { Reducer } from 'redux';
import { Effect } from '@/models/connect';

export interface DepositTypeModelState {
  name: string;
}

export interface DepositTypeModelType {
  namespace: 'depositType';
  state: DepositTypeModelState;
  effects: {
    /* query: Effect; */
  };
  reducers: {
    save: Reducer<DepositTypeModelState>;
  };
}

const DepositTypeModel: DepositTypeModelType = {
  namespace: 'depositType',

  state: {
    name: '',
  },

  effects: {
    /* *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      console.log(data)
      yield put({
        type: 'save',
        payload: { name: data.text },
      });
    }, */
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

export default DepositTypeModel;

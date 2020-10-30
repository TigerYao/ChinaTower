import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface OperationGuideModelState {
  name: string;
}

export interface OperationGuideModelType {
  namespace: 'operationGuide';
  state: OperationGuideModelState;
  effects: {
    /* query: Effect; */
  };
  reducers: {
    save: Reducer<OperationGuideModelState>;
  };
}

const OperationGuideModel: OperationGuideModelType = {
  namespace: 'operationGuide',

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

export default OperationGuideModel;

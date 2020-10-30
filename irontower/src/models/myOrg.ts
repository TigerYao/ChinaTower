import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface MyOrgModelState {
  name: string;
}

export interface MyOrgModelType {
  namespace: 'myOrg';
  state: MyOrgModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MyOrgModelState>;
  };
}

const MyOrgModel: MyOrgModelType = {
  namespace: 'myOrg',

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

export default MyOrgModel;

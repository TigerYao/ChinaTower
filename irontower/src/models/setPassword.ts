import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface SetPasswordModelState {
  name: string;
}

export interface SetPasswordModelType {
  namespace: 'setPassword';
  state: SetPasswordModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<SetPasswordModelState>;
  };
}

const SetPasswordModel: SetPasswordModelType = {
  namespace: 'setPassword',

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

export default SetPasswordModel;

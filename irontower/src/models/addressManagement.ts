import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface AddressManagementModelState {
  name: string;
}

export interface AddressManagementModelType {
  namespace: 'addressManagement';
  state: AddressManagementModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<AddressManagementModelState>;
  };
}

const AddressManagementModel: AddressManagementModelType = {
  namespace: 'addressManagement',

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

export default AddressManagementModel;

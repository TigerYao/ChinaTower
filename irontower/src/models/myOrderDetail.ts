import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface MyOrderDetailModelState {
  name: string;
}

export interface MyOrderDetailModelType {
  namespace: 'myOrderDetail';
  state: MyOrderDetailModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MyOrderDetailModelState>;
  };
}

const MyOrderDetailModel: MyOrderDetailModelType = {
  namespace: 'myOrderDetail',

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

export default MyOrderDetailModel;

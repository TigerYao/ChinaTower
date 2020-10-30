import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface ProtocolModelState {
  name: string;
  protocolDetail: any;
}

export interface ProtocolModelType {
  namespace: 'protocol';
  state: ProtocolModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ProtocolModelState>;
  };
}

const ProtocolModel: ProtocolModelType = {
  namespace: 'protocol',

  state: {
    name: '',
    protocolDetail: '',
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

export default ProtocolModel;

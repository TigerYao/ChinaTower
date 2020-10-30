import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface MessageDetailModelState {
  name: string;
  detail: any;
}

export interface MessageDetailModelType {
  namespace: 'messageDetail';
  state: MessageDetailModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MessageDetailModelState>;
  };
}

const MessageDetailModel: MessageDetailModelType = {
  namespace: 'messageDetail',

  state: {
    name: '',
    detail: {},
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

export default MessageDetailModel;

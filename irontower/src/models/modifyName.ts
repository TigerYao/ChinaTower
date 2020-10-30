import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { saveUserInfo, getUserInfo } from '@/utils/index';
export interface ModifyNameModelState {
  name: string;
}

export interface ModifyNameModelType {
  namespace: 'modifyName';
  state: ModifyNameModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ModifyNameModelState>;
  };
}

const ModifyNameModel: ModifyNameModelType = {
  namespace: 'modifyName',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      // const data = yield call(query, payload);
      // console.log(data.text)
      // const {data}=payload
      // console.log("你戳到我了 "+data)
      yield put({
        type: 'save',
        // payload: { name: data.text },
        data: {
          name: ' ',
        },
      });
    },
    *cleaned({ payload }, { call, put }) {
      console.log('你戳到我了');
      const { data } = payload;
      console.log(payload.data);
      yield put({
        type: 'clean',
        data: {
          name: payload.data,
        },
      });
    },
    *input({ payload }, { call, put }) {
      yield put({
        type: 'save',
        data: {
          name: payload.data,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      console.log(state);
      let a = JSON.parse(JSON.stringify(state));
      a.name = action.data.name;
      return a;
    },
    clean(state, action) {
      console.log('你戳到我了' + action.payload.data);
      let input = JSON.parse(JSON.stringify(state));
      input.name = action.payload.data;
      return input;
    },
    inputed(state, action) {
      console.log(action.payload.data);
      let input = JSON.parse(JSON.stringify(state));
      input.name = action.payload.data;
      return input;
    },
  },
};

export default ModifyNameModel;

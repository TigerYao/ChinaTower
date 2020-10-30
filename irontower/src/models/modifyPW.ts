import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import {updatePassWordU} from '@/services/personServices'
export interface ModifyPWModelState {
  name: string;
}

export interface ModifyPWModelType {
  namespace: 'modifyPW';
  state: ModifyPWModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ModifyPWModelState>;
  };
}

const ModifyPWModel: ModifyPWModelType = {
  namespace: 'modifyPW',

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
    *updataPasswordU({payload},{call,put}){
      const {password,newPassword,driverId}=payload;
      const res=yield call(updatePassWordU,{
          driverId: driverId,
          oldPassword: password,
          password: newPassword
      });
      if (res.resultCode === '000') {
        payload.callback && payload.callback();
      }
    }
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

export default ModifyPWModel;

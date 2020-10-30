import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import {sendShortMessageU,updateUserPhoneU} from "@/services/personServices" 
export interface ModifyPhoneModelState {
  name: string;
}

export interface ModifyPhoneModelType {
  namespace: 'modifyPhone';
  state: ModifyPhoneModelState;
  effects: {
    query: Effect;
    sendSms: Effect;
    updateUserPhoneU: Effect;
  };
  reducers: {
    save: Reducer<ModifyPhoneModelState>;
  };
}

const ModifyPhoneModel: ModifyPhoneModelType = {
  namespace: 'modifyPhone',

  state: {
    name: '',
    timer: null,
    userCode: '',
    sms: '',
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
    *sendSms({payload},{call,put}){
      const {userCode}=payload;
      yield call(sendShortMessageU,{
        phone:userCode
      })
    },
    *updateUserPhoneU({payload},{call,put}){
      const {userCode,sms,driverId}=payload;
      console.log(userCode,sms,driverId)
      const res=yield call(updateUserPhoneU,{
        account:userCode,
        driverId:driverId,
        phoneNumber:userCode,
        smsTxt:sms,
      });
      if(res.resultCode==="000"){
        payload.callback &&payload.callback();
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

export default ModifyPhoneModel;

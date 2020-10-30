import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { sendShortMessage, forgetUpdatePassWord, checkShortMessage } from '@/services/loginServices';
import { Effect } from '@/models/connect';

export interface ForgetPasswordModelState {
  name: string;
  timer: any;
  userCode: string;
  sms: string;
  password: string;
}

export interface ForgetPasswordModelType {
  namespace: 'forgetPassword';
  state: ForgetPasswordModelState;
  effects: {
    query: Effect;
    sendSms: Effect;
    checkSms: Effect;
    updataPassword: Effect;
    checkShortMessage: Effect;
  };
  reducers: {
    save: Reducer<ForgetPasswordModelState>;
  };
}

const ForgetPasswordModel: ForgetPasswordModelType = {
  namespace: 'forgetPassword',

  state: {
    name: '',
    timer: null,
    userCode: '',
    sms: '',
    password: '',
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
    *sendSms({ payload }, { call, put }) {
      const { userCode } = payload;
      yield call(sendShortMessage, {
        phone: userCode,
      });
    },
    *checkShortMessage({ payload }, { call, put }) {
      const { userCode = "", sms = "" } = payload;
      const res:any = yield call(checkShortMessage, {
        phone: userCode,
        smsTxt: sms,
      });
      if (res.resultCode === '000') {
        // eslint-disable-next-line no-unused-expressions
        payload.callback && payload.callback();
      }
    },
    *updataPassword({ payload }, { call, put }) {
      const { userCode = "", sms = "", password = "" } = payload;
      const res:any = yield call(forgetUpdatePassWord, {
        phoneNumber: userCode,
        password,
        smsTxt: sms,
      });

      if (res.resultCode === '000') {
        // eslint-disable-next-line no-unused-expressions
        payload.callback && payload.callback();
      }
      
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

export default ForgetPasswordModel;

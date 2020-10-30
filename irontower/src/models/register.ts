import { Reducer } from 'redux';
import { query } from '@/services/api';
import { router, Effect } from 'alita';
import { sendShortMessage, publicRegisterUser, smsLogin } from '@/services/loginServices';
import { saveLoginInfo, saveUserInfo } from '@/utils';
import { commonFunc } from '@/utils/cordovapluigs';
import { selectUserInfo } from '@/services/personServices';

export interface RegisterModelState {
  name: string;
  userCode: string;
  timer: any;
  sms: string;
}

export interface RegisterModelType {
  namespace: 'register';
  state: RegisterModelState;
  effects: {
    query: Effect;
    sendSms: Effect;
    registerUser: Effect;
    smsLogin: Effect;
    selectUserInfo: Effect;
  };
  reducers: {
    save: Reducer<RegisterModelState>;
  };
}

const RegisterModel: RegisterModelType = {
  namespace: 'register',

  state: {
    name: '',
    userCode: '',
    timer: null,
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
    *sendSms({ payload }, { call, put }) {
      const { userCode, callback = () => {} } = payload;
      const { resultCode, resultObject } = yield call(sendShortMessage, {
        phone: userCode,
      });
      if (resultCode === '000') {
        callback();
      }
    },
    *registerUser({ payload }, { call, put }) {
      const { userCode, sms, password, phoneModel } = payload;
      const res = yield call(publicRegisterUser, {
        account: userCode,
        password,
        phoneNumber: userCode,
        smsTxt: sms,
        phoneModel, // 手机类型
      });

      if (res.resultCode === '000') {
        localStorage.setItem('isRefreshIndex', 'true');
        // eslint-disable-next-line no-unused-expressions
        payload.callback && payload.callback();
      }
    },
    *smsLogin({ payload }, { call, put }) {
      const { userCode, sms } = payload;
      const res = yield call(smsLogin, {
        phone: userCode,
        smsTxt: sms,
      });
      if (res.resultCode === '000') {
        saveLoginInfo(res.resultObject);
        localStorage.setItem('isRefreshIndex', 'true');
        yield put({
          type: 'selectUserInfo',
          payload: {
            driverId: res.resultObject.driverId,
            callback: () => {
              payload.callback && payload.callback(res.resultObject);
            },
          },
        });

        // eslint-disable-next-line no-unused-expressions
      } else if (res.resultCode === '407') {
        router.replace({
          pathname: '/login/setPassword',
        });
      }
    },
    *selectUserInfo({ payload }, { call, put }) {
      const { driverId, callback } = payload;
      const res = yield call(selectUserInfo, {
        driverId,
      });
      console.log('tag', res);
      if (res.resultCode === '000') {
        saveUserInfo(res.resultObject);
        if (callback) {
          callback();
        }
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

export default RegisterModel;

import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { ordinaryLogin, getAgreement } from '@/services/loginServices';
import {
  getLoginInfo,
  saveLoginInfo,
  saveUserInfo,
  md5Pwd,
  saveLoginParamInfo,
} from '@/utils/index';
import { Effect } from 'alita';
import { selectUserInfo } from '@/services/personServices';

export interface LoginModelState {
  name: string;
  userInfo: any;
  tmpPhone: string;
  tmpPassword: string;
}

export interface LoginModelType {
  namespace: 'login';
  state: LoginModelState;
  effects: {
    query: Effect;
    loginFun: Effect;
    getAgreement: Effect;
    selectUserInfo: Effect;
  };
  reducers: {
    save: Reducer<LoginModelState>;
  };
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {
    name: '',
    userInfo: {},
  },

  effects: {
    *query({ payload }, { call, put }) {
      // const data = yield call(query, payload);
      // console.log(data);
      // yield put({
      //   type: 'save',
      //   payload: { name: data.text },
      // });
    },

    *getAgreement({ payload }, { call, put }) {
      // const { resultCode, resultObject } = yield call(getAgreement, {
      //   type: payload.type,
      // });
      const res = yield call(getAgreement, {
        type: payload.type,
      });

      if (res && payload.callback) {
        payload.callback(res);
      }

      // if (resultCode === '000' && payload.callback) {
      //   payload.callback(resultObject.configValue);
      // }
    },

    *loginFun({ payload }, { call, put }) {
      const { userCode = '', passWord = '' } = payload;
      const param = {
        account: userCode, // 登录账号
        password: passWord, //  登录密码
      };
      const res = yield call(ordinaryLogin, param);
      if (res.resultCode === '000') {
        saveLoginInfo(res.resultObject);
        saveLoginParamInfo(param); // 保存账户密码信息
        yield put({
          type: 'selectUserInfo',
          payload: {
            driverId: res.resultObject.driverId,
            callback: () => {
              payload.callback && payload.callback(res.resultObject);
            },
          },
        });

        // localStorage.setItem('isRefreshIndex', 'true');
        // eslint-disable-next-line no-unused-expressions
      }
    },
    // eslint-disable-next-line consistent-return
    *selectUserInfo({ payload }, { call, put }) {
      const { driverId, callback = () => {} } = payload;
      const res = yield call(selectUserInfo, {
        driverId,
      });
      if (res.resultCode === '000') {
        callback();
        saveUserInfo(res.resultObject);
        yield put({
          type: 'save',
          payload: {
            userInfo: res.resultObject,
          },
        });
        return res;
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

export default LoginModel;

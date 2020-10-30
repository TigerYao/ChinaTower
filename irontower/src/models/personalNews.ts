/* eslint-disable prefer-const */
import { Reducer } from 'redux';
import { updateUserInfo, selectUserInfo } from '@/services/personServices';
import { updateTurnsCity,getChannelInfo } from '@/services/netRequest';
import { saveUserInfo, getUserInfo, saveLoginInfo, getLoginInfo } from '@/utils/index';
import { Effect } from 'alita';
const { userInfo } = getUserInfo();
export interface PersonalNewsModelState {
  name: string;
}

export interface PersonalNewsModelType {
  namespace: 'personalNews';
  state: PersonalNewsModelState;
  effects: {
    query: Effect;
    updateUserInfoNews: Effect;
    updateTurnsCity: Effect;
    getChannelInfo:Effect;
    
  };
  reducers: {
    save: Reducer<PersonalNewsModelState>;
  };
}

const PersonalNewsModel: PersonalNewsModelType = {
  namespace: 'personalNews',

  state: {
    name: '',
    usersex: '',
    phone: '',
  },

  effects: {
    // 请求用户信息
    *query({ payload }, { call, put }) {
      const { userId, callback } = payload;
      const res = yield call(selectUserInfo, {
        driverId: userId,
      });
      if (res.resultCode === '000') {
        let newInfo = {
          ...getLoginInfo(),
          ...res.resultObject,
        };
        saveLoginInfo(newInfo);
        // res.resultObject.driverType = '5';
        saveUserInfo(res.resultObject);
        if (callback) {
          callback();
        }
      }
      return res;
    },

    *updateUserInfoNews({ payload }, { call, put }) {
      const { resultCode, resultObject } = yield call(updateUserInfo, payload);
      if (resultCode === '000') {
        yield put({
          type: 'query',
          payload: {
            userId: getUserInfo().driverId,
            callback: payload.callback,
          },
        });

        // if (payload.callback) {
        //   payload.callback();
        // }
      }
    },

    *updateTurnsCity({ payload }, { call, put }) {
      console.log(payload);
      const { resultCode, resultObject } = yield call(updateTurnsCity, payload);

      if (resultCode === '000') {
        yield put({
          type: 'query',
          payload: {
            userId: getUserInfo().driverId,
            callback: payload.callback,
          },
        });
      }
    },

    *getChannelInfo({ payload }, { call, put }) {
      console.log(payload);
      const { resultCode, resultObject } = yield call(getChannelInfo, payload);

      if (resultCode === '000') {

        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },

    // s设置性别
    // *setSex({payload},{call,put}){
    //   const {sex}=payload;
    //   // console.log("你戳到我了"+payload.sex)
    //   yield put({
    //     type:"setsex",
    //     data:{
    //       name:payload.sex
    //     }
    //   })
    // },
    // 更新用户信息
    *updateUserInfo({ payload }, { call, put }) {
      const { userId, userImg, sex, nickName } = payload;
      console.log(payload.userId, payload.userImg);
      const res = yield call(updateUserInfo, {
        avatar: userImg,
        driverId: userId,
        sex,
        nickName,
      });
      yield put({
        type: 'query',
        payload: {
          userId,
        },
      });
      if (res.resultCode === '000') {
        payload.callback && payload.callback();
      }
    },
  },
  reducers: {
    save(state, action) {
      console.log(action);
      // console.log("你戳到我了")
      return {
        ...state,
        ...action.payload,
      };
    },
    setname(state, action) {
      console.log('你戳到我了');
      // let userInfo=getUserInfo()
      let username = JSON.parse(JSON.stringify(state));
      // console.log(userInfo)
      username.name = action.data;
      return username;
    },
  },
};

export default PersonalNewsModel;

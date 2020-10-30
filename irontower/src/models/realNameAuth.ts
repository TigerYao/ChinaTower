import { Reducer } from 'redux';
import { selectPronvieOrCity, selectDictionaryByDictType } from '@/services/loginServices';
import { authUpdateUser, idCardRecognition, validInvitationCode } from '@/services/netRequest';
import { Effect } from 'alita';
import { Toast } from 'antd-mobile';

export interface RealNameAuthModelState {
  cityList: Array<any>;
  platformList: Array<any>;
  voltsList: Array<any>;
}

export interface RealNameAuthModelType {
  namespace: 'realNameAuth';
  state: RealNameAuthModelState;
  effects: {
    selectPronvieOrCity: Effect;
    selectDictionaryByDictTypePlatform: Effect;
    selectDictionaryByDictTypeVolts: Effect;
    authUpdateUser: Effect;
    idCardRecognition: Effect;
    validInvitationCode: Effect;
  };
  reducers: {
    save: Reducer<RealNameAuthModelState>;
  };
}

const RealNameAuthModel: RealNameAuthModelType = {
  namespace: 'realNameAuth',

  state: {
    cityList: [],
    platformList: [],
    voltsList: [],
  },

  effects: {
    *selectPronvieOrCity({ payload }, { call, put }) {
      const { callback = () => {}, ...otherPayload } = payload;
      const { resultCode, resultObject } = yield call(selectPronvieOrCity, otherPayload);
      if (resultCode === '000') {
        const cityList = (resultObject || []).map(
          (res: { areaName: any; areaCode: any; deptId: any }) => {
            return {
              label: res.areaName,
              value: `${res.areaCode},${res.deptId},${res.areaName}`,
            };
          },
        );

        yield put({
          type: 'save',
          payload: {
            cityList,
          },
        });
        callback(cityList);

        Toast.hide();
      } else {
        Toast.hide();
      }
    },
    *selectDictionaryByDictTypePlatform({ payload }, { call, put }) {
      const { resultCode, resultObject } = yield call(selectDictionaryByDictType, {
        dictType: 'attribution_platform',
      });
      console.log('tag', resultObject);
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            platformList: (resultObject || []).map((res: { dictLabel: any; dictValue: any }) => {
              return {
                label: res.dictLabel,
                value: res.dictValue,
              };
            }),
          },
        });
      }
    },
    *selectDictionaryByDictTypeVolts({ payload }, { call, put }) {
      const { resultCode, resultObject } = yield call(selectDictionaryByDictType, {
        dictType: 'battery_volts',
      });
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            voltsList: (resultObject || []).map((res: { dictLabel: any; dictValue: any }) => {
              return {
                label: res.dictLabel,
                value: res.dictValue,
              };
            }),
          },
        });
      }
    },
    *authUpdateUser({ payload }, { call }) {
      const { resultCode, resultObject } = yield call(authUpdateUser, payload);
      if (resultCode === '000' && payload.callback) {
        payload.callback(resultObject);
      }
    },
    *idCardRecognition({ payload }, { call }) {
      const { resultCode, resultObject } = yield call(idCardRecognition, payload);
      if (resultCode === '000' && payload.callback) {
        payload.callback(resultObject);
      }
    },

    *validInvitationCode({ payload }, { call }) {
      const { resultCode, resultObject } = yield call(validInvitationCode, payload);
      if (resultCode === '000' && payload.callback) {
        payload.callback(resultObject);
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

export default RealNameAuthModel;

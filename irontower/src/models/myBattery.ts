import { Reducer } from 'redux';
import {
  queryBatteryElectricQuantity,
  queryBatteryTrackInfo
} from '@/services/netRequest';
import { Effect } from 'alita';

const time = 11;

interface batteryTrackInfo {
  batteryLongitude: string;
  batteryLatitude: string;
  updateTime: string;
};

export interface MyBatteryModelState {
  batteryInfo: any;
  hasBattery: boolean;
  isRent: boolean;
  batteryTrackInfoList: batteryTrackInfo[];
}

export interface MyBatteryModelType {
  namespace: 'myBattery';
  state: MyBatteryModelState;
  effects: {
    queryBatteryElectricQuantity: Effect;
    queryBatteryTrackInfo: Effect;
  };
  reducers: {
    save: Reducer<MyBatteryModelState>;
  };
}

const MyBatteryModel: MyBatteryModelType = {
  namespace: 'myBattery',

  state: {
    batteryInfo: {},
    hasBattery: false,
    isRent: false,
    batteryTrackInfoList: [],
  },

  effects: {
    *queryBatteryElectricQuantity({ payload }, { call, put }) {
      const { resultObject } = yield call(queryBatteryElectricQuantity, payload);
      let isRent = false;
      let batteryInfo = {};
      if (resultObject) {
        isRent = true;
        batteryInfo = resultObject;
      }

      yield put({
        type: 'save',
        payload: {
          batteryInfo,
          isRent,
          hasBattery: !!resultObject,
        },
      });

      if (payload.callback) {
        payload.callback(!!resultObject);
      }
    },
    *queryBatteryTrackInfo({ payload }, { call, put }) {
      const data = yield call(queryBatteryTrackInfo, payload);
      if (data && data.resultCode === '000') {
        const { resultObject = {} } = data;
        const { batteryTrackInfoList = [] } = resultObject;
        /* const batteryTrackInfoList = [
          {
              "batteryLongitude": "119.289803",
              "batteryLatitude": "26.09256",
              "updateTime": "2020-08-07 00:55:40"
          },
          {
              "batteryLongitude": "119.29443785717774",
              "batteryLatitude": "26.09225166668286",
              "updateTime": "2020-08-07 00:45:25"
          },
          {
              "batteryLongitude": "119.30181929638673",
              "batteryLatitude": "26.09240583344308",
              "updateTime": "2020-08-07 00:45:25"
          },
          {
              "batteryLongitude": "119.31211897900391",
              "batteryLatitude": "26.097647382409146",
              "updateTime": "2020-08-07 00:45:25"
          },
        ]; */
        yield put({
          type: 'save',
          payload: {
            batteryTrackInfoList,
          },
        });
        if (payload.callback) {
          payload.callback(!!resultObject, batteryTrackInfoList);
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

export default MyBatteryModel;

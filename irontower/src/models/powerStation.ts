import { Reducer } from 'redux';
import { queryCabinetDoorInfo } from '@/services/netRequest';
import { Effect } from 'alita';

export interface PowerStationModelState {
  name: string;
}

export interface PowerStationModelType {
  namespace: 'powerStation';
  state: PowerStationModelState;
  effects: {
    queryCabinetDoorInfo: Effect;
  };
  reducers: {
    save: Reducer<PowerStationModelState>;
  };
}

const PowerStationModel: PowerStationModelType = {
  namespace: 'powerStation',

  state: {
    info: '',
  },

  effects: {
    *queryCabinetDoorInfo({ payload }, { call, put }) {
      const { resultCode, resultObject } = yield call(queryCabinetDoorInfo, payload);

      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: { info: resultObject },
        });
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

export default PowerStationModel;

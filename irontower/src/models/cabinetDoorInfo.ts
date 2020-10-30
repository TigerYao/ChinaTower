import { Reducer } from 'redux';
import { queryCabinetDoorInfo } from '@/services/netRequest';
import { Effect } from 'alita';

export interface CabinetDoorInfoModelState {
  info: any;
}

export interface CabinetDoorInfoModelType {
  namespace: 'cabinetDoorInfo';
  state: CabinetDoorInfoModelState;
  effects: {
    queryCabinetDoorInfo: Effect;
  };
  reducers: {
    save: Reducer<CabinetDoorInfoModelState>;
  };
}

const CabinetDoorInfoModel: CabinetDoorInfoModelType = {
  namespace: 'cabinetDoorInfo',

  state: {
    info: {},
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

export default CabinetDoorInfoModel;

import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface BatteryTrackingModelState {
  name: string;
}

export interface BatteryTrackingModelType {
  namespace: 'batteryTracking';
  state: BatteryTrackingModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<BatteryTrackingModelState>;
  };
}

const BatteryTrackingModel: BatteryTrackingModelType = {
  namespace: 'batteryTracking',

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

export default BatteryTrackingModel;

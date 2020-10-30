import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface BatterySettingModelState {
  name: string;
}

export interface BatterySettingModelType {
  namespace: 'batterySetting';
  state: BatterySettingModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<BatterySettingModelState>;
  };
}

const BatterySettingModel: BatterySettingModelType = {
  namespace: 'batterySetting',

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

export default BatterySettingModel;

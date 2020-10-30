import { Reducer } from 'redux';
import { userLoginOut } from '@/services/personServices';
import { updatePowerNoticeSwitch, queryPowerNoticeSwitch } from '@/services/netRequest';
import { Effect } from 'alita';
import { getUserInfo } from '@/utils';
export interface SetupModelState {
  name: string;
  switchStatus: boolean;
}

export interface SetupModelType {
  namespace: 'setup';
  state: SetupModelState;
  effects: {
    query: Effect;
    exit: Effect;
    updatePowerNoticeSwitch: Effect;
    queryPowerNoticeSwitch: Effect;
  };
  reducers: {
    save: Reducer<SetupModelState>;
  };
}

const SetupModel: SetupModelType = {
  namespace: 'setup',

  state: {
    name: '',
    switchStatus: true,
  },

  effects: {
    *updatePowerNoticeSwitch({ payload }, { call, put }) {
      const { resultCode } = yield call(updatePowerNoticeSwitch, payload);
      if (resultCode === '000') {
        if (payload && payload.callback) {
          payload.callback();
        }
        yield put({
          type: 'queryPowerNoticeSwitch',
        });
      }
    },
    *queryPowerNoticeSwitch({ payload }, { call, put }) {
      const { resultCode, resultObject = {} } = yield call(queryPowerNoticeSwitch, {
        driverId: getUserInfo().driverId,
      });
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            switchStatus: resultObject.switchStatus === '1',
          },
        });
        if (payload && payload.callback) {
          payload.callback();
        }
      }
    },
    *query({ payload }, { call, put }) {},
    *exit({ payload }, { call, put }) {
      const { phone, driverId, userId } = payload;
      const res = yield call(userLoginOut, {
        phone,
        userId,
        driverId,
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

export default SetupModel;

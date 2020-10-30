import { Reducer } from 'redux';
import { getHistoryInvitationCodeWithDriver } from  '@/services/netRequest';
import { Effect } from '@/models/connect';


export interface InvateHistoryModelState {
  name: string;
  historyList:any;
}

export interface InvateHistoryModelType {
  namespace: 'InvateHistory';
  state: InvateHistoryModelState;
  effects: {
    getHistoryInvitationCodeWithDriver: Effect;
  };
  reducers: {
    save: Reducer<InvateHistoryModelState>;
  };
}

const InvateHistoryModel: InvateHistoryModelType = {
  namespace: 'InvateHistory',

  state: {
    name: '',
    historyList:[]
  },

  effects: {
    *getHistoryInvitationCodeWithDriver({ payload }, { call, put }) {
      const data = yield call(getHistoryInvitationCodeWithDriver, payload);
     
      let historyList = [];
      if (data && data.resultObject) {
        historyList = data.resultObject;
      }
      yield put({
        type: 'save',
        payload: {
          historyList,
        }
      });
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

export default InvateHistoryModel;

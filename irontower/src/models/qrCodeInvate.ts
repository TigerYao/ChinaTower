import { Reducer } from 'redux';
import { getInvitationCodeByDriverId } from '@/services/netRequest';
import { Effect } from '@/models/connect';
import { router } from 'alita';


export interface QrCodeInvateModelState {
  info: any;
}

export interface QrCodeInvateModelType {
  namespace: 'qrCodeInvate';
  state: QrCodeInvateModelState;
  effects: {
    getInvitationCodeByDriverId: Effect;

  };
  reducers: {
    save: Reducer<QrCodeInvateModelState>;
  };
}

const QrCodeInvateModel: QrCodeInvateModelType = {
  namespace: 'qrCodeInvate',

  state: {
    info: {},
  },

  effects: {
    *getInvitationCodeByDriverId({ payload }, { call, put }) {

      const { resultCode, resultObject } = yield call(getInvitationCodeByDriverId, payload);
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: { info: resultObject },
        });
      } else {
        router.goBack();
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

export default QrCodeInvateModel;

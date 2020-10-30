import { Reducer } from 'redux';
import { getMyECar } from '@/services/netRequest';
import { Effect } from 'alita';
import { Toast } from 'antd-mobile'; 

export interface CarManageModelState {
  myCar: any
}

export interface CarManageModelType {
  namespace: 'carManage';
  state: CarManageModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<CarManageModelState>;
  };
}

const CarManageModel: CarManageModelType = {
  namespace: 'carManage',

  state: {
    myCar: null,
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(getMyECar, payload);
      if( data.resultCode === '000' ) {
        yield put({
          type: 'save',
          payload: { myCar: { ...data.resultObject } || null },
        });
      } else {
        Toast.fail(data.resultMsg || '');
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

export default CarManageModel;

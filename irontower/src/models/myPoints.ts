import { Reducer } from 'redux';
import {
  getMyPointsList,
} from '@/services/netRequest';
import { Effect } from '@/models/connect';

export interface MyPointsModelState {
  pointList: Array[any];
}

export interface MyPointsModelType {
  namespace: 'myPoints';
  state: MyPointsModelState;
  effects: {
    getMyPointsList: Effect;
  };
  reducers: {
    save: Reducer<MyPointsModelState>;
  };
}

const MyPointsModel: MyPointsModelType = {
  namespace: 'myPoints',

  state: {
    pointList: [],
  },

  effects: {
    *getMyPointsList({ payload }, { call, put }) {
      const { resultObject } = yield call(getMyPointsList, payload);
      /* console.log(data);
      const data = [
        {
          desc: '消费10元',
          type: 1,
          createTime: '2020.08.17 16:00',
          payAmount: 10,
        },
        {
          desc: '消费10元',
          type: 2,
          createTime: '2020.08.17 16:00',
          payAmount: 10,
        },
        {
          desc: '消费10元',
          type: 1,
          createTime: '2020.08.17 16:00',
          payAmount: 10,
        },
      ]; */
      yield put({
        type: 'save',
        payload: { pointList: [...resultObject] },
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

export default MyPointsModel;

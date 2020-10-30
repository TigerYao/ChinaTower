import { Reducer } from 'redux';
import { query } from '@/services/api';
import { Effect } from '@/models/connect';

export interface PointsDescModelState {
  name: string;
}

export interface PointsDescModelType {
  namespace: 'pointsDesc';
  state: PointsDescModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<PointsDescModelState>;
  };
}

const PointsDescModel: PointsDescModelType = {
  namespace: 'pointsDesc',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      console.log(data)
      yield put({
        type: 'save',
        payload: { name: data.text },
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

export default PointsDescModel;

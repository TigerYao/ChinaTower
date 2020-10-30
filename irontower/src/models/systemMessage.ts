import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { selectAccountNews } from '../services/netRequest';
import { getLoginInfo } from '@/utils';

export interface SystemMessageModelState {
  name: string;
  formData: any;
}

export interface SystemMessageModelType {
  namespace: 'systemMessage';
  state: SystemMessageModelState;
  effects: {
    query: Effect;
    selectAccountNews: Effect;
  };
  reducers: {
    save: Reducer<SystemMessageModelState>;
  };
}

const SystemMessageModel: SystemMessageModelType = {
  namespace: 'systemMessage',

  state: {
    name: '',
    formData: [],
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
    *selectAccountNews({ payload }, { call, put }) {
      const { newsType } = payload;
      const data = yield call(selectAccountNews, {
        delFlag: '0',
        driverId: getLoginInfo().driverId,
        isRead: '0',
        newsType,
      });
      let formData = [];
      if (data.resultObject && data.resultObject.length) {
        formData = data.resultObject;
      }
      yield put({
        type: 'save',
        payload: {
          formData,
        },
      })
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

export default SystemMessageModel;

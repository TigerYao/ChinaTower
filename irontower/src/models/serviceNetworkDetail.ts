import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  queryNetworkInfo,
  batchQueryFileInfoByIds,
} from '@/services/netRequest';
import DefaultImg from '@/assets/images/default-img.png';

export interface ServiceNetworkDetailModelState {
  networkDetail: any;
  fileList: any;
}

export interface ServiceNetworkDetailModelType {
  namespace: 'serviceNetworkDetail';
  state: ServiceNetworkDetailModelState;
  effects: {
    queryNetworkInfo: Effect;
    batchQueryFileInfoByIds: Effect;
  };
  reducers: {
    save: Reducer<ServiceNetworkDetailModelState>;
  };
}

const ServiceNetworkDetailModel: ServiceNetworkDetailModelType = {
  namespace: 'serviceNetworkDetail',

  state: {
    networkDetail: {},
    fileList: [{ fileUrl: DefaultImg }],
  },

  effects: {
    *queryNetworkInfo({ payload }, { call, put }) {
      const data = yield call(queryNetworkInfo, payload);
      if (data && data.resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            networkDetail: data.resultObject,
          },
        });
      }
    },
    *batchQueryFileInfoByIds({ payload }, { call, put }) {
      const data = yield call(batchQueryFileInfoByIds, payload);
      if (data && data.resultCode === '000' && Array.isArray(data.resultObject)) {
        yield put({
          type: 'save',
          payload: {
            fileList: data.resultObject.length > 1 ? data.resultObject : [],
          },
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

export default ServiceNetworkDetailModel;

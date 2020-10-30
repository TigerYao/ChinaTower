import { Reducer } from 'redux';
import { queryRentCarList } from '@/services/netRequest';
import { Effect } from '@/models/connect';

export interface RentCarListModelState {
  rentList: any;
}

export interface RentCarListModelType {
  namespace: 'rentCarList';
  state: RentCarListModelState;
  effects: {
    queryRentCarList: Effect;
  };
  reducers: {
    save: Reducer<RentCarListModelState>;
  };
}

const RentCarListModel: RentCarListModelType = {
  namespace: 'rentCarList',

  state: {
    rentList: [],
  },

  effects: {
    *queryRentCarList({ payload }, { call, put }) {
      const { resultObject  } = yield call(queryRentCarList, payload);
      // console.log('租车记录：',data)
      /* let list = [
        {
          ID: 'CZBY201807023452',
          carNO: 'A642442',
          rentTime: '2020-8-7',
          status: 1
        },
        {
          ID: 'CZBY201807023452',
          carNO: 'A642442',
          rentTime: '2020-8-7',
          status: 2,
          backTime:'2020-8-8',
        },
        {
          ID: 'CZBY201807023452',
          carNO: 'A642442',
          rentTime: '2020-8-7',
          status: 2,
          backTime:'2020-8-8',
        },
        {
          ID: 'CZBY201807023452',
          carNO: 'A642442',
          rentTime: '2020-8-7',
          status: 2,
          backTime:'2020-8-8',
        }
      ] */
      yield put({
        type: 'save',
        payload: { rentList: [ ...resultObject ] },
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

export default RentCarListModel;

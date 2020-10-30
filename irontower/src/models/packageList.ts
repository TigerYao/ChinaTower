import { Reducer } from 'redux';
import { getPckageConfigList, getPckageDetail } from '@/services/netRequest';
import { Effect } from 'alita';
import { Toast } from 'antd-mobile';

export interface PackageListModelState {
  packageArray: Array<any>;
  selectOffer: any;
  selectIndex: number;
  packageInfoData: Array<any>;
}

export interface PackageListModelType {
  namespace: 'packageList';
  state: PackageListModelState;
  effects: {
    getPckageConfigList: Effect;
    getPckageDetail: Effect;
  };
  reducers: {
    save: Reducer<PackageListModelState>;
  };
}

const PackageListModel: PackageListModelType = {
  namespace: 'packageList',

  state: {
    packageArray: [],
    selectOffer: {},
    selectIndex: 0,
    packageInfoData: [],
  },

  effects: {
    *getPckageConfigList({ payload }, { call, put, select }) {
      const { selectIndex } = yield select(_ => _.packageList);
      const { resultCode, resultObject = [], resultMsg } = yield call(getPckageConfigList, payload);
      if (resultCode === '000') {
        if (resultObject.length > 0) {
          yield put({
            type: 'getPckageDetail',
            payload: {
              cityCode: payload.cityCode,
              packageID: resultObject[selectIndex].id,
            },
          });
        }

        yield put({
          type: 'save',
          payload: {
            packageArray: resultObject,
          },
        });

        if (payload.callback) {
          payload.callback(resultObject[selectIndex].id, selectIndex);
        }
      } else {
        Toast.fail(resultMsg);
      }
    },

    *getPckageDetail({ payload }, { call, put }) {
      const { resultCode, resultObject = {}, resultMsg } = yield call(getPckageDetail, {
        cityCode: payload.cityCode,
        packageID: payload.packageID,
      });
      if (resultCode === '000') {
        const selectOffer = {
          packageId: payload.packageID,
          ...resultObject,
          // packageId: '901253',
          // id: '901253',
        };

        yield put({
          type: 'save',
          payload: {
            selectOffer,
          },
        });

        if (payload.callback) {
          payload.callback(selectOffer);
        }
      } else {
        Toast.fail(resultMsg);
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

export default PackageListModel;

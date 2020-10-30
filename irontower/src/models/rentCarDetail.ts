import { Reducer } from 'redux';
import { getMyECarRecordDet } from '@/services/netRequest';
import { Effect } from '@/models/connect';

export interface RentCarDetailModelState {
  renCarDetailInfo: any;
}

export interface RentCarDetailModelType {
  namespace: 'rentCarDetail';
  state: RentCarDetailModelState;
  effects: {
    getMyECarRecordDet: Effect;
  };
  reducers: {
    save: Reducer<RentCarDetailModelState>;
  };
}

const RentCarDetailModel: RentCarDetailModelType = {
  namespace: 'rentCarDetail',

  state: {
    renCarDetailInfo: {},
  },

  effects: {
    *getMyECarRecordDet({ payload }, { call, put }) {
      console.log(123331331313);
      const { resultObject  } = yield call(getMyECarRecordDet, payload);
      // console.log(data)
      /* const detail = {
        borrowState: '', // 状态 0借出 1归还 ,
        borrowTime: '', // 取车时间 ,
        category: '', // 车辆类型 ,
        cityId: '', // 城市编码 ,
        cityName: '', // 城市 ,
        createBy: '', // 创建人 ,
        createTime: '', // 创建时间 ,
        delFlag: '', // 删除标志 = ['0未删除', '2已删除'],
        deptId: '', // 部门编码 ,
        ecarFrameNo: '', // 车辆车架号 ,
        ecarId: '', // 车辆编码 ,
        ecarNo: '', // 车辆编号 ,
        id: 'TB1232312313321', // id ,
        licenceNo: '', // 牌照 ,
        outNetNodeId: '', // 租车网点id ,
        outNetNodeName: '', // 取车网点 ,
        provinceId: '', // 省份编码 ,
        provinceName: '', // 省份 ,
        putNetNodeId: '', // 还车网点id ,
        putNetNodeName: '', // 还车网点 ,
        returnTime: '', // 还车时间 ,
        updateBy: '', // 更新人 ,
        updateTime: '', // 更新时间 ,
        userId: '', // 用户id ,
        userName: '', // 用户姓名 ,
        userPhone: '', // 用户手机号
      } */
      yield put({
        type: 'save',
        payload: { renCarDetailInfo: { ...resultObject } },  
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

export default RentCarDetailModel;

import { Effect, Reducer, router } from 'alita';
import { selectObjectByKey } from '@/services/loginServices';
import {
  selectCityStation,
  selectNearStation,
  queryCabinetBatteryInfo,
  selectRangeStationList,
  queryCabinetAndBatteryInfo,
  queryReturnCabinetInfo,
  queryCityIdByCityName,
  getAllSysAreaInfo,
  queryFirstTakeFlag,
  selectRangeReturnStationList,
  queryNetworkInfoList,
} from '@/services/netRequest';
import { Subscription } from 'dva';

import IconMapMarker from '@/assets/images/map-marker.png';
import IconHomeQiPao from '@/assets/images/home-qipao.png';
import IconMapMarkerGrey from '@/assets/images/map-marker-grey.png';
import iconNetworkHome from '@/assets/images/icon-network-home.png';

import { saveCustomerTel, getCurrentPosition, getUserInfo, getLoginInfo } from '@/utils';

const getPointMapMarker = (list: any[] = []) => {
  let ebDivs = '';
  const width = '16px';
  const height = '16px';
  for (let index = 0; index < list.length; index += 1) {
    let style = `position:absolute;width:${width}; height: ${height};border:2px solid #fff; background:#00BF83; border-radius:8px;text-align:center; line-height: 12px; color:#fff; font-size: 12px;`;
    if (!list[index]) {
      break;
    }
    if (index === 0) {
      style += 'right: -4px; top: 0;';
    } else if (index === 1) {
      style += 'left: -4px; top: 0;';
    } else if (index === 2) {
      style += 'left: -4px; top:18px;';
    } else if (index === 3) {
      style += 'right: -4px; top:18px;';
    } else if (index === 4) {
      style += 'left: 12px; top:-8px;';
    } else if (index === 5) {
      style += 'right: 12px; top:-8px;';
    }
    ebDivs += `<div style="${style}">${list[index] ? list[index].fullCount : ''}</div>`;
  }
  return ebDivs;
};

export interface IndexModelState {
  stationList: Array<any>;
  tel: string;
  cabinetList: Array<any>;
  showDraw: boolean;
  currPositionInfo: any;
  returnStationList: [];
  serviceNetworkList: [];
}

interface stationProps {
  greyFlag?: string;
  stationAddress?: string;
  stationId?: string;
  stationLatitude?: string;
  stationLongitude?: string;
  bsCabinetResponseList?: {
    cabinetId?: string;
    fullCount?: string;
    emptyCabinCount?: string;
  }[];
}

export interface MapItemProps {
  eleCount: string | number;
  eleText: string;
  address: string;
  detailAddr: string;
  id: string;
  type: string;
}

export interface IndexModelType {
  namespace: 'index';
  state: IndexModelState;
  effects: {
    selectCityStation: Effect;
    selectNearStation: Effect;
    selectRangeStationList: Effect;
    selectObjectByKey: Effect;
    queryCabinetBatteryInfo: Effect;
    queryCabinetAndBatteryInfo: Effect;
    queryReturnCabinetInfo: Effect;
    queryCityIdByCityName: Effect;
    getAllSysAreaInfo: Effect;
    queryFirstTakeFlag: Effect;
    selectRangeReturnStationList: Effect;
    queryNetworkInfoList: Effect;
  };
  subscriptions: { setup: Subscription };
  reducers: {
    save: Reducer<IndexModelState>;
  };
}

const IndexModel: IndexModelType = {
  namespace: 'index',

  state: {
    stationList: [],
    tel: '',
    cabinetList: [],
    showDraw: false,
    currPositionInfo: {
      cityId: '',
      provinceId: '',
    },
    returnStationList: [],
    serviceNetworkList: [],
  },

  effects: {
    *queryFirstTakeFlag({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(queryFirstTakeFlag, {
        cityId: payload.cityId,
        driverId: payload.driverId,
      });

      if (resultCode === '000') {
        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },
    *getAllSysAreaInfo({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(getAllSysAreaInfo, {
        cityId: payload.cityId,
      });

      if (resultCode === '000') {
        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },
    *queryCityIdByCityName({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(queryCityIdByCityName, {
        cityName: payload.cityName,
      });

      // if (resultCode === '000') {
      if (payload.callback) {
        payload.callback(resultObject || {});
      }
      // }

      yield put({
        type: 'save',
        payload: {
          currPositionInfo: {
            cityId: resultObject ? resultObject.cityId : '',
            provinceId: resultObject ? resultObject.provinceId : '',
          },
        },
      });
    },
    *selectCityStation({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(selectCityStation, payload);
      if (resultCode === '000') {
        const stationList = (resultObject || []).map(res => {
          const count = (+res.fortyeFullCount || 0) + (+res.sixtyFullCount || 0);
          if (res.greyFlag === '1') {
            // 0不置灰 1置灰
            return {
              content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconMapMarkerGrey}"/>
            </div>`,
              lng: res.stationLongitude,
              lat: res.stationLatitude,
              offset: [-20, -40],
              ...res,
            };
          }

          return {
            content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconHomeQiPao}"/>
              ${getPointMapMarker(res.bsCabinetResponseList)}
            </div>`,
            // content: `<div style="width:75px; height:60px; background-image:url(${IconMapMarker}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span>${count}</span></div>`,
            lng: res.stationLongitude,
            lat: res.stationLatitude,
            offset: [-20, -40],
            ...res,
          };
        });
        yield put({
          type: 'save',
          payload: {
            stationList,
          },
        });
        if (payload.callback) {
          payload.callback();
        }
      }
    },
    *selectNearStation({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(selectNearStation, payload);
      if (resultCode === '000') {
        const stationList = (resultObject || []).map(res => {
          const count = (+res.fortyeFullCount || 0) + (+res.sixtyFullCount || 0);
          if (res.greyFlag === '1') {
            // 0不置灰 1置灰
            return {
              content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconMapMarkerGrey}"/>
            </div>`,
              lng: res.stationLongitude,
              lat: res.stationLatitude,
              offset: [-20, -40],
              ...res,
            };
          }
          return {
            content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src=${IconHomeQiPao}/>
              ${getPointMapMarker(res.bsCabinetResponseList)}
            </div>`,
            // content: `<div style="width:75px; height:60px; background-image:url(${IconMapMarker}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span>${count}</span></div>`,
            lng: res.stationLongitude,
            lat: res.stationLatitude,
            offset: [-20, -40],
            ...res,
          };
        });

        yield put({
          type: 'save',
          payload: {
            stationList,
          },
        });

        if (payload.callback) {
          payload.callback();
        }
      }
    },


    *selectRangeStationList({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(selectRangeStationList, payload);
      if (resultCode === '000') {
        const stationList = (resultObject || []).map(res => {
          // const count = (+res.fortyeFullCount || 0) + (+res.sixtyFullCount || 0);
          if (res.greyFlag === '1') {
            // 0不置灰 1置灰
            return {
              content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconMapMarkerGrey}"/>
            </div>`,
              lng: res.stationLongitude,
              lat: res.stationLatitude,
              offset: [-20, -40],
              ...res,
            };
          }

          return {
            content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconHomeQiPao}"/>
              ${getPointMapMarker(res.bsCabinetResponseList)}
            </div>`,
            // content: `<div style="width:75px; height:60px; background-image:url(${IconMapMarker}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span>${count}</span></div>`,
            lng: res.stationLongitude,
            lat: res.stationLatitude,
            offset: [-20, -40],
            ...res,
          };
        });

        yield put({
          type: 'save',
          payload: {
            stationList,
          },
        });

        if (payload.callback) {
          payload.callback();
        }
      }
    },

    *queryCabinetBatteryInfo({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(queryCabinetBatteryInfo, {
        // stationId: payload.stationId,
        cabinetId: payload.cabinetId,
      });
      if (resultCode === '000') {
        yield put({
          type: 'save',
          payload: {
            cabinetList: [
              {
                eleText: '可换电池',
                eleCount: resultObject.fullCount,
                detailAddr: resultObject.cabinetAddress,
                id: resultObject.cabinetId || '01',
                address: resultObject.cabinetName,
              },
            ],
          },
        });
        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },

    *queryCabinetAndBatteryInfo({ payload }, { call, put }) {
      const { resultObject, resultCode } = yield call(queryCabinetAndBatteryInfo, {
        stationId: payload.stationId,
      });
      if (resultCode === '000') {
        const cabinetList = (resultObject || []).map(res => ({
          ...res,
          eleText: '可换电池',
          eleCount: res.fullCount,
          detailAddr: res.cabinetAddress,
          address: res.cabinetName,
          id: res.cabinetId,
        }));
        yield put({
          type: 'save',
          payload: {
            cabinetList,
          },
        });
        if (payload.callback) {
          payload.callback(cabinetList);
        }
      }
    },
    *queryReturnCabinetInfo({ payload }, { call, put }) {
      // 查询退电指引机柜
      const { resultObject, resultCode } = yield call(queryReturnCabinetInfo, {
        stationId: payload.stationId,
      });
      if (resultCode === '000') {
        const cabinetList: MapItemProps[] = (resultObject || []).map((res: any) => ({
          ...res,
          eleText: '剩余空库',
          eleCount: Number(res.cabinCount) - Number(res.fullCount) - Number(res.notFullCount),
          detailAddr: res.cabinetAddress,
          address: res.cabinetName,
          id: res.cabinetId,
        }));
        yield put({
          type: 'save',
          payload: {
            cabinetList,
          },
        });
        if (payload.callback) {
          payload.callback(cabinetList);
        }
      }
    },

    *selectObjectByKey({ }, { call, put }) {
      const data = yield call(selectObjectByKey, {
        configKey: 'app.consumer.hotline',
      });
      const { resultObject, resultCode } = data;
      if (resultCode === '000') {
        saveCustomerTel(resultObject.configValue);
        yield put({
          type: 'save',
          payload: {
            tel: resultObject.configValue,
          },
        });
      }
    },
    *selectRangeReturnStationList({ payload }, { call, put }) {
      const data = yield call(selectRangeReturnStationList, payload);
      if (data && data.resultCode === '000') {
        const { resultObject = [] } = data;
        const list = resultObject.map((v: stationProps) => {
          // const count = (+res.fortyeFullCount || 0) + (+res.sixtyFullCount || 0);
          if (v.greyFlag === '1') {
            // 0不置灰 1置灰
            return {
              content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
              <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconMapMarkerGrey}"/>
            </div>`,
              lng: v.stationLongitude,
              lat: v.stationLatitude,
              offset: [-20, -40],
              ...v,
            };
          }

          return {
            content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
                        <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${IconHomeQiPao}"/>
                        ${getPointMapMarker(v.bsCabinetResponseList)}
                      </div>`,
            // content: `<div style="width:75px; height:60px; background-image:url(${IconMapMarker}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span>${count}</span></div>`,
            lng: v.stationLongitude,
            lat: v.stationLatitude,
            offset: [-20, -40],
            ...v,
          };
        });
        yield put({
          type: 'save',
          payload: {
            returnStationList: [...list],
          },
        });
        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },
    *queryNetworkInfoList({ payload }, { call, put }) {
      const data = yield call(queryNetworkInfoList, payload);
      if (data && data.resultCode === '000') {
        const { resultObject = {} } = data;
        const { bsNetworkInfoList = [] } = resultObject;
        const list = bsNetworkInfoList.map(v => 
          // const count = (+res.fortyeFullCount || 0) + (+res.sixtyFullCount || 0);
          // if (v.nodeStatus !== '1') {
          //   return {
          //     content: `<div style="width:75px; height:60px; background-image:url(${iconServiceNetwork}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span></span></div>`,
          //     lng: v.nodeLongitude,
          //     lat: v.nodeLatitude,
          //     offset: [-35.5, -60],
          //     id: v.nodeId,
          //     detailAddr: v.nodeAddress,
          //     address: v.nodeName,
          //     ...v,
          //   };
          // }

           ({
            content: `<div style="width:40px; height:40px;display:flex; align-item:center; justify-content: center; position:relative; ">
            <img style="position:absolute; left:50%; transform:translateX(-50%); width:40px; height: 40px; bottom:0; " src="${iconNetworkHome}"/>
          </div>`,
            // content: `<div style="width:75px; height:60px; background-image:url(${IconMapMarker}); background-repeat:no-repeat; background-size:100% 100%;padding-left:35px; padding-top:15px;padding-right:20px;font-size:14px;color:#fff; text-align:center; overflow: hidden"><span>${count}</span></div>`,
            lng: v.nodeLongitude,
            lat: v.nodeLatitude,
            offset: [-20, -40],
            id: v.nodeId,
            detailAddr: v.nodeAddress,
            address: v.nodeName,
            ...v,
          })
        );
        yield put({
          type: 'save',
          payload: {
            serviceNetworkList: [...list],
          },
        });
        if (payload.callback) {
          payload.callback(resultObject);
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log('history=====', pathname, history, router);
        if (pathname === '/index') {
          if (localStorage.getItem('isRefreshIndex')) {
            dispatch!({
              type: 'personalNews/query',
              payload: {
                userId: getLoginInfo().driverId,
                callback: () => {
                  const { certification } = getUserInfo();
                  if (certification !== '1') {
                    console.log('未实名');
                    localStorage.setItem('showRealNameTips', 'true');
                  } else {
                    console.log('实名');
                    localStorage.removeItem('showRealNameTips');
                  }
                },
              },
            });
          }
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

export default IndexModel;

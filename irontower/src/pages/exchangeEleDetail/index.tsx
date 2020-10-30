/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  ExchangeEleDetailModelState,
  ConnectProps,
  connect,
  ExchangeEleListModelState,
  MyBatteryModelState,
  router,
} from 'alita';
import HomeTips from '@/components/HomeTips';
import MapView from '@/components/MapView';
import { Toast, Modal } from 'antd-mobile';
import { exchangePowerBusiness } from '@/services/netRequest';
import { getQrcodeStr, getUserInfo, getCurrentPosition, getLoginInfo } from '@/utils';
import { openScanQrcode } from '@/utils/cordovapluigs';
import IconStart from '@/assets/images/detail-start.png';
import IconEnd from '@/assets/images/detail-end.png';
import EleDetail from './components/EleDetail';
import moment from 'moment';
import styles from './index.less';

const BMapGL = (window as any).BMap;
let trackMap: any = null;
let polyline: any = null;
let startMarker: any = null;
let endMarker: any = null;

interface PageProps extends ConnectProps {
  exchangeEleDetail: ExchangeEleDetailModelState;
  exchangeEleList: ExchangeEleListModelState;
  myBattery: MyBatteryModelState;
}

const ExchangeEleDetailPage: FC<PageProps> = ({
  exchangeEleDetail,
  dispatch,
  location,
  exchangeEleList,
  myBattery,
}) => {
  const mapViewEleD = useRef(null);
  let timer = null;
  let timerBattery = null;
  let timerModal = null;

  const { name, recordInfo } = exchangeEleDetail;
  const { itemDetail = {}, exchangeMonth } = exchangeEleList;
  const { batteryTrackInfoList } = myBattery;
  const { bsExchangeRecord = {}, borrowBsCabinetInfo = {}, returnBsCabinetInfo = {} } = itemDetail;
  const [lat, setLat] = useState(false);
  const [lng, setLng] = useState(false);
  const [polylineList, setPolylineList] = useState([]);

  const queryBatteryTackInfo = (params: queryTrackParamsProps = {}) => {
    dispatch!({
      type: 'myBattery/queryBatteryTrackInfo',
      payload: {
        ...params,
      },
    });
  };

  // 这里发起了初始化请求
  useEffect(() => {
    // console.log(history, location, location.query.status);
    // Toast.info(JSON.stringify(location));
    dispatch!({
      type: 'exchangeEleDetail/getExchangeRecordInfo',
      payload: {
        recordId: itemDetail.id,
        exchangeMonth,
        callback: record => {
          const params = {
            batteryId: record.batteryId,
            startTime: record.borrowTime,
            endTime:
              location.query.status === '0'
                ? record.rerurnTime
                : moment().format('YYYY-MM-DD HH:mm:ss'),
          };
          queryBatteryTackInfo(params);
        },
      },
    });

    getCurrentPosition({
      success: res => {
        setLat(res.latitude);
        setLng(res.longitude);
        console.log('经纬度', JSON.stringify(res), JSON.stringify(returnBsCabinetInfo));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let currLat = res.latitude;
        let currLong = res.longitude;

        if (returnBsCabinetInfo && borrowBsCabinetInfo) {
          if (borrowBsCabinetInfo.cabinetLatitude && returnBsCabinetInfo.cabinetLatitude) {
            currLat =
              (Number(borrowBsCabinetInfo.cabinetLatitude) +
                Number(returnBsCabinetInfo.cabinetLatitude)) /
              2.0;
          }
          if (borrowBsCabinetInfo.cabinetLongitude && returnBsCabinetInfo.cabinetLongitude) {
            currLong =
              (Number(borrowBsCabinetInfo.cabinetLongitude) +
                Number(returnBsCabinetInfo.cabinetLongitude)) /
              2.0;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (borrowBsCabinetInfo) {
            if (borrowBsCabinetInfo.cabinetLatitude) {
              currLat = Number(borrowBsCabinetInfo.cabinetLatitude);
            }
            if (borrowBsCabinetInfo.cabinetLongitude) {
              currLong = Number(borrowBsCabinetInfo.cabinetLongitude);
            }
          }
        }

        timer = setTimeout(() => {
          mapViewEleD.current.setCenter(currLat, currLong);
        }, 1000);
      },
      fail: err => {
        console.log('定位失败', err);
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      if (timer) {
        clearTimeout(timer);
      }
      if (timerModal) {
        clearTimeout(timerModal);
      }
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const batteryRequest = () => {
    timer = setTimeout(() => {
      dispatch!({
        type: 'myBattery/queryBatteryElectricQuantity',
        payload: {
          driverId: getLoginInfo().driverId,
          callback: (haBattery: boolean) => {
            if (!haBattery) {
              clearInterval(timer);
              const { driverType } = getUserInfo();
              if (driverType !== '2' && driverType !== '3') {
                Modal.alert('温馨提示', '退电已完成，您是否需要退费？', [
                  {
                    text: '取消',
                    onPress: () => {},
                  },
                  {
                    text: '确认',
                    onPress: () => {
                      router.push({
                        pathname: '/myWallet',
                      });
                    },
                  },
                ]);
              } else {
                router.push({
                  pathname: '/myWallet',
                });
              }
            } else {
              batteryRequest();
            }
          },
        },
      });
    }, 2000);
  };

  // 退还
  const refund = () => {
    openScanQrcode({ title: '扫码换电' }, (text: string) => {
      const { batteryVolts, driverId, provinceId, cityId, deptId } = getUserInfo();
      const sqcode = getQrcodeStr(text);
      if (sqcode !== '' && sqcode !== -1) {
        exchangePowerBusiness({
          batteryMarking: '1',
          batteryVolts,
          cabinetId: sqcode,
          driverId,
          provinceId,
          cityId,
          deptId,
        })
          .then(res => {
            const { resultCode, resultObject } = res;
            if (resultCode === '000') {
              //  绑定成功
              const { code, msg } = resultObject;
              if (code === '1') {
                // Toast.success('机柜已打开!');
                Toast.success(msg);

                // timerBattery = setTimeout(() => {
                //   dispatch!({
                //     type: 'myBattery/queryBatteryElectricQuantity',
                //     payload: {
                //       driverId: getLoginInfo().driverId,
                //     },
                //   });
                //   router.goBack();
                // }, 2000);

                batteryRequest();
              } else {
                Toast.fail(msg);
              }
            }
          })
          .catch(err => {
            Toast.fail('开柜失败');
          });
      }
    });
  };

  return (
    <div className={styles.eleDetail}>
      {/* <div style={{display: location.query.status==='1' ? 'none' : 'block'}}>
        <HomeTips type="Default" text="尊敬的用户您这次换电行驶了 45 公里" />
      </div> */}
      {batteryTrackInfoList.length ? (
        <MapView
          ref={mapViewEleD}
          id="mapViewOverEleD"
          zoom={16}
          // 119.269503,26.085834
          initialPosition={{ lat, lng }}
          curPosition={{
            onClick: (e: any) => {},
          }}
          labels={[
            {
              content: `<div style="width:30px; height:30px; background-image:url(${IconStart}); background-repeat:no-repeat; background-size:100% 100%;"></div>`,
              lng: borrowBsCabinetInfo ? borrowBsCabinetInfo.cabinetLongitude : '', // 119.269503,
              lat: borrowBsCabinetInfo ? borrowBsCabinetInfo.cabinetLatitude : '', // 26.085834,
              offset: [-15, -30],
            },
            {
              content: `<div style="width:30px; height:30px; background-image:url(${IconEnd}); background-repeat:no-repeat; background-size:100% 100%;"></div>`,
              lng: returnBsCabinetInfo ? returnBsCabinetInfo.cabinetLongitude : '', // 119.24401,
              lat: returnBsCabinetInfo ? returnBsCabinetInfo.cabinetLatitude : '', // 26.087974,
              offset: [-15, -30],
            },
          ]}
          status={location.query.status}
          polylineList={batteryTrackInfoList.map(item => ({
            lng: item.batteryLongitude,
            lat: item.batteryLatitude,
          }))}
        />
      ) : (
        ''
      )}
      {!batteryTrackInfoList.length ? (
        <MapView
          ref={mapViewEleD}
          id="mapViewOverEleD"
          zoom={16}
          // 119.269503,26.085834
          initialPosition={{ lat, lng }}
          curPosition={{
            onClick: (e: any) => {},
          }}
          labels={[
            {
              content: `<div style="width:30px; height:30px; background-image:url(${IconStart}); background-repeat:no-repeat; background-size:100% 100%;"></div>`,
              lng: borrowBsCabinetInfo ? borrowBsCabinetInfo.cabinetLongitude : '', // 119.269503,
              lat: borrowBsCabinetInfo ? borrowBsCabinetInfo.cabinetLatitude : '', // 26.085834,
              offset: [-15, -30],
            },
            {
              content: `<div style="width:30px; height:30px; background-image:url(${IconEnd}); background-repeat:no-repeat; background-size:100% 100%;"></div>`,
              lng: returnBsCabinetInfo ? returnBsCabinetInfo.cabinetLongitude : '', // 119.24401,
              lat: returnBsCabinetInfo ? returnBsCabinetInfo.cabinetLatitude : '', // 26.087974,
              offset: [-15, -30],
            },
          ]}
          polylineList={batteryTrackInfoList.map(item => ({
            lng: item.batteryLongitude,
            lat: item.batteryLatitude,
          }))}
        />
      ) : (
        ''
      )}
      <EleDetail
        action={location.action}
        data={recordInfo}
        status={location.query.status}
        dealClick={e => {
          e.stopPropagation();
          // eslint-disable-next-line no-console
          console.log('退还');

          dispatch!({
            type: 'index/getAllSysAreaInfo',
            payload: {
              cityId: getUserInfo().cityId,
              callback: res => {
                if (res && res.ifPermitReturn === '0') {
                  refund();
                } else {
                  Modal.alert(
                    '温馨提示',
                    '本地市暂不支持线上退还功能，如有疑问，请咨询客服10096。',
                    [
                      {
                        text: '确认',
                        onPress() {},
                      },
                    ],
                  );
                }
              },
            },
          });

          // Toast.success('退还');
          // timerBattery = setInterval(() => {
          //   const { hasBattery } = myBattery;
          //   console.log("...", hasBattery)
          //   dispatch!({
          //     type: 'myBattery/queryBatteryElectricQuantity',
          //     payload: {
          //       driverId: getLoginInfo().driverId,
          //     },
          //   });

          //   if (!hasBattery) {
          //     clearInterval(timerBattery);
          //   }
          // },2000);
        }}
      />
    </div>
  );
};

export default connect(
  ({
    exchangeEleDetail,
    exchangeEleList,
    myBattery,
  }: {
    exchangeEleDetail: ExchangeEleDetailModelState;
    exchangeEleList: ExchangeEleListModelState;
    myBattery: MyBatteryModelState;
  }) => ({
    exchangeEleDetail,
    exchangeEleList,
    myBattery,
  }),
)(ExchangeEleDetailPage);

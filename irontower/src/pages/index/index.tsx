import React, { FC, useEffect, useState, useRef } from 'react';

import {
  IndexModelState,
  MyBatteryModelState,
  ConnectProps,
  connect,
  router,
  history,
  setPageNavBar,
} from 'alita';
import { exchangePowerBusiness, getPostalBatteryBinding } from '@/services/netRequest';
import { Drawer, NavBar, Toast, Modal } from 'antd-mobile';
import classnames from 'classnames';
import { openScanQrcode, pay, commonFunc } from '@/utils/cordovapluigs';
import SliderBar from '@/components/SliderBar';
import MapView from '@/components/MapView';
import IndexMapView from '@/components/IndexMapView';
import MapPopView from '@/components/MapPopView';
import AlertAction from '@/components/AlertAction';
import IconKeFu from '@/assets/images/home-kefu-new.png';
import IconScan from '@/assets/images/home-scan-icon.png';
// import IconZhiNam from '@/assets/images/home-new-zhinan.png';
import IconRefresh from '@/assets/images/home-dingwei-new.png';
import IconUnDingWei from '@/assets/images/home-undingwei-new.png';
import IconLogoTower from '@/assets/images/logo-tower.png';
import IconMessage from '@/assets/images/xiaoxi-button-icon.png';
import IconCurrentPosition from '@/assets/images/map-current-position.png';

import {
  getLoginInfo,
  getUserInfo,
  getAgreement,
  getAgreementByUserId,
  getCurrentPosition,
  clearLoginInfo,
  getCustomerTel,
  getQrcodeStr,
} from '@/utils';
import iconReturn from '@/assets/images/icon-return.png';
import iconReturnSelected from '@/assets/images/icon-return-selected.png';
import iconBatteryStation from '@/assets/images/icon-battery-station.png';
import iconBatteryStationSelected from '@/assets/images/icon-battery-station-selected.png';
import iconServiceNetwork from '@/assets/images/icon-service-network.png';
import iconServiceNetworkSelected from '@/assets/images/icon-service-network-selected.png';
import { MapItemProps } from '@/models/index';
import styles from './index.less';
import AvatarIcon from '../../components/AvatarIcon';
import EleTower from './components/EleTower';
import HomeTips from '../../components/HomeTips';
import ProtocolModal from './components/ProtocolModal';
import ServiceModal from './components/ServiceModal';
import moment from 'moment';

let getUserInfoTimes = 0;
let batteryElectricTimer: NodeJS.Timeout | null = null;
let getPositionTimer: NodeJS.Timeout | null = null;

interface PageProps extends ConnectProps {
  index: IndexModelState;
}

interface coordinate {
  lat: number | string;
  lng: number | string;
}

const leftOperationList = [
  {
    icon: iconBatteryStation,
    selectedIcon: iconBatteryStationSelected,
    title: '换电站',
    key: 'batteryStation',
  },
  {
    icon: iconServiceNetwork,
    selectedIcon: iconServiceNetworkSelected,
    title: '服务网点',
    key: 'serviceNetwork',
  },
  {
    icon: iconReturn,
    selectedIcon: iconReturnSelected,
    title: '退电指引',
    key: 'return',
  },
];

const IndexPage: FC<PageProps> = ({
  index: {
    stationList = [],
    tel = '10096',
    cabinetList = [],
    showDraw,
    returnStationList = [],
    serviceNetworkList = [],
  },
  dispatch,
  location,
  myBattery,
}) => {
  const { batteryInfo, hasBattery } = myBattery;
  // const [showDraw, setShowDraw] = useState(false); // 是否展示抽屉
  // const [rotating, setRotating] = useState(false); // 是否开始旋转
  const [protocolVisible, setProtocolVisible] = useState(false);
  const [showTips, setShowTips] = useState(false); // 是否展示提示信息
  const [showBatteryTips, setShowBatteryTips] = useState(
    batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus,
  ); // 是否展示提示信息
  const [showPop, setShowPop] = useState(false);
  const [selectObj, setSelectObj] = useState({});
  const mapView = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bsBatteryInfoList, setBsBatteryInfoList] = useState<MapItemProps[]>([]);
  const [lat, setLat] = useState(false);
  const [lng, setLng] = useState(false);
  const [centerLat, setCenterLat] = useState<number | string>('');
  const [centerLng, setCenterLng] = useState<number | string>('');
  const [showType, setShowType] = useState('batteryStation');
  const statesRef = useRef({ showType }); // 用来存储本组件内部分state

  const queryBatteryElectricQuantity = () => {
    if (getUserInfo().certification !== '1') {
      return;
    }
    dispatch!({
      type: 'myBattery/queryBatteryElectricQuantity',
      payload: {
        driverId: getLoginInfo().driverId,
      },
    });
  };

  // 设置当前导航条
  const setNavigatorBar = () => {};

  // const [currentCity, setCurrentCity] = useState('');

  const renderLabel = (list = [], res: any, cityName?: string) => {
    // res.latitude,
    // stationLongitude: res.longitude,
    // mapView.current.renderOverlayView(list);
    // mapView.current.clearLabelOverlay();
    if (res) {
      if (mapView && mapView.current && mapView.current.setCenter) {
        mapView.current.setCenter(res.latitude, res.longitude);
      }
      // if (list.length > 50) {
      //   mapView.current.setZoom(9);
      // } else {
      //   mapView.current.setZoom(11);
      // }
    } else if (list.length > 50) {
      // mapView.current.setCenter(cityName, 9);
    } else {
      // mapView.current.setCenter(cityName, 11);
    }
  };

  // const getCurrentCity = () => {
  //   getCurrentPosition({
  //     success: e => {
  //       setCurrentCity(e.city);
  //     },
  //     fail: () => {
  //       setCurrentCity('');
  //     },
  //   });
  // };
  const clearStationTimer = () => {
    if (getPositionTimer) {
      clearInterval(getPositionTimer);
    }
  };

  const getStationType = () => {
    const { orgType, driverType } = getUserInfo();

    if (driverType === '5') {
      return '3';
    }
    if (orgType === '0' || orgType === '1' || orgType === '2' || orgType === '3') {
      return '1';
    } else if (orgType === '4') {
      return '2';
    } else {
      return '';
    }

    // return orgType === '0' ? '1' : '2';
  };

  // 刷新电池
  const refreshEleHandle = () => {
    localStorage.removeItem('isRefreshIndex');
    dispatch!({
      type: 'personalNews/query',
      payload: {
        userId: getLoginInfo().driverId,
        callback: () => {
          getUserInfoTimes += 1;
          const { cityId, provinceId, orgType, cityName, deptId } = getUserInfo();
          //   if (cityId) {
          //     getCurrentPosition({
          //       success: e => {
          //         // Toast.info(e.longitude)
          //         setLat(e.latitude);
          //         setLng(e.longitude);
          //         clearStationTimer();
          //         console.log('获取位置信息成功', JSON.stringify(e));
          //         dispatch!({
          //           type: 'index/queryCityIdByCityName',
          //           payload: {
          //             cityName: e.city,
          //             callback: res => {
          //               console.log('查询城市id', JSON.stringify(res));
          //               if (res && res.cityId) {
          //                 dispatch!({
          //                   type: 'index/selectRangeStationList',
          //                   payload: {
          //                     cityId: res.cityId,
          //                     provinceId: res.provinceId || '',
          //                     stationStatus: '1',
          //                     stationType: getStationType(),
          //                     stationLatitude: e.latitude,
          //                     stationLongitude: e.longitude,
          //                     // driverId: getLoginInfo().driverId,
          //                     deptId: res.deptId || '',
          //                     callback: (list = []) => {
          //                       renderLabel(list, e);
          //                       mapView.current.refreshCurrentPosition(true);
          //                     },
          //                   },
          //                 });
          //               } else {
          //                 dispatch!({
          //                   type: 'index/selectRangeStationList',
          //                   payload: {
          //                     cityId,
          //                     provinceId,
          //                     stationStatus: '1',
          //                     stationType: getStationType(),
          //                     // driverId: getLoginInfo().driverId,
          //                     stationLatitude: e.latitude,
          //                     stationLongitude: e.longitude,
          //                     deptId,
          //                     callback: (list = []) => {
          //                       renderLabel(list, e);
          //                       mapView.current.refreshCurrentPosition(true);
          //                     },
          //                   },
          //                 });
          //               }
          //             },
          //           },
          //         });
          //       },
          //       fail: e => {
          //         clearStationTimer();
          //         console.log('获取位置信息失败', JSON.stringify(e));
          //         dispatch!({
          //           type: 'index/selectRangeStationList',
          //           payload: {
          //             cityId,
          //             provinceId,
          //             stationStatus: '1',
          //             stationType: getStationType(),
          //             // driverId: getLoginInfo().driverId,
          //             stationLatitude: e.latitude,
          //             stationLongitude: e.longitude,
          //             deptId,
          //             callback: (list = []) => {
          //               renderLabel(list, null, cityName);
          //               mapView.current.refreshCurrentPosition(true);
          //             },
          //           },
          //         });
          //       },
          //     });

          //     // dispatch!({
          //     //   type: 'index/selectCityStation',
          //     //   payload: {
          //     //     cityId: '110108',
          //     //     provinceId: '110000',
          //     //     stationStatus: '1',
          //     //     stationType: orgType === '0' ? '1' : '2',
          //     //     driverId: getLoginInfo().driverId,
          //     //   },
          //     // });
          //     // dispatch!({
          //     //   type: 'index/selectCityStation',
          //     //   payload: {
          //     //     cityId,
          //     //     provinceId,
          //     //     stationStatus: '1',
          //     //     stationType: orgType === '0' ? '1' : '2',
          //     //     driverId: getLoginInfo().driverId,
          //     //     deptId,
          //     //     callback: (list = []) => {
          //     //     }
          //     //   },
          //     // });
          //   } else {
          // getCurrentPosition({
          //   success: res => {
          //     // Toast.info(res.longitude)
          //     console.log('获取位置信息成功', JSON.stringify(res));
          //     clearStationTimer();
          //     setLat(res.latitude);
          //     setLng(res.longitude);
          //     dispatch!({
          //       type: 'index/selectRangeStationList',
          //       payload: {
          //         stationLatitude: res.latitude,
          //         stationLongitude: res.longitude,
          //         stationStatus: '1',
          //         cityId: getLoginInfo().cityId ? getLoginInfo().cityId : '',
          //         deptId: getLoginInfo().deptId ? getLoginInfo().deptId : '',
          //         provinceId: getLoginInfo().provinceId ? getLoginInfo().provinceId : '',
          //         stationType: getStationType(),
          //         // driverId: getLoginInfo().driverId,
          //         callback: list => {
          //           console.log(mapView.current);
          //           renderLabel(list, res);
          //         },
          //       },
          //     });
          //   },
          // });
          //   }
          getCurrentPosition({
            success: res => {
              // Toast.info(res.longitude)
              console.log('获取位置信息成功', JSON.stringify(res));
              clearStationTimer();
              setLat(res.latitude);
              setLng(res.longitude);
              setCenterLat(res.latitude);
              setCenterLng(res.longitude);
              dispatch!({
                type: 'index/selectRangeStationList',
                payload: {
                  stationLatitude: res.latitude,
                  stationLongitude: res.longitude,
                  stationStatus: '1',
                  cityId: getLoginInfo().cityId ? getLoginInfo().cityId : '',
                  deptId: getLoginInfo().deptId ? getLoginInfo().deptId : '',
                  provinceId: getLoginInfo().provinceId ? getLoginInfo().provinceId : '',
                  stationType: getStationType(),
                  // driverId: getLoginInfo().driverId,
                  orgId: getLoginInfo().orgId ? getLoginInfo().orgId : '',
                  orgType: getLoginInfo().orgType ? getLoginInfo().orgType : '',
                  callback: (list: never[] | undefined) => {
                    console.log(mapView.current);
                    renderLabel(list, res);
                  },
                },
              });
            },
          });
        },
      },
    }).then((item: { resultCode: string }) => {
      if (item.resultCode !== '000') {
        clearStationTimer();
      }
    });
  };

  const getTelNum = () => {
    dispatch!({
      type: 'index/selectObjectByKey',
    });
  };

  const reqQueryBatteryElectricQuantity = () => {
    batteryElectricTimer = setInterval(() => {
      if (getLoginInfo().token) {
        queryBatteryElectricQuantity();
      } else {
        clearInterval(batteryElectricTimer);
      }
    }, 1 * 60 * 1000);
  };

  const getStationList = () => {
    if (getPositionTimer) {
      clearInterval(getPositionTimer);
    }

    getPositionTimer = setInterval(() => {
      if (getUserInfoTimes === 20) {
        clearInterval(getPositionTimer);
        return;
      }
      if (getLoginInfo().token) {
        refreshEleHandle();
      } else {
        clearInterval(getPositionTimer);
      }

      console.log('s,M', new Date().getSeconds(), new Date().getMinutes());
    }, 3 * 1000);
  };

  // 页面初始化
  const pageInit = () => {
    queryBatteryElectricQuantity();
    reqQueryBatteryElectricQuantity();
    setNavigatorBar();
    getTelNum();
    getStationList();

    // clearStationTimer();
  };

  const showProtocol = () => {
    const { loginCount } = getLoginInfo();

    const protocolKey = `protocol$${getLoginInfo().driverId}`;
    if (localStorage.getItem(protocolKey) === 'YES') {
      setProtocolVisible(false);
      return;
    }

    if (loginCount >= 2) {
      // console.log("loginCount==", loginCount, !getAgreement(), !getAgreementByUserId())
      if (!getAgreementByUserId()) {
        setProtocolVisible(true);
      } else {
        setProtocolVisible(false);
      }
    } else {
      setProtocolVisible(true);
    }
    // if (loginCount === 0) {
    //   setProtocolVisible(true);
    // } else if (!getAgreement()) {
    //   setProtocolVisible(true);
    // }
  };

  //  扫描旧电池
  const oldBatteryOpenQrcode = (cabinetId: string | number) => {
    const { batteryVolts, driverId, provinceId, cityId, deptId, orgId, orgType } = getUserInfo();
    openScanQrcode({ title: '扫码换电' }, text => {
      const sqcode = getQrcodeStr(text);
      if (sqcode !== '' && sqcode !== -1) {
        exchangePowerBusiness({
          batteryId: sqcode,
          batteryVolts,
          cabinetId,
          driverId,
          provinceId,
          cityId,
          deptId,
          orgId,
          orgType,
        })
          .then(res => {
            const { resultCode, resultObject } = res;
            if (resultCode === '000') {
              //  绑定成功
              const { code, msg } = resultObject;
              if (code === '1') {
                Toast.success(msg);
                // Toast.success('绑定成功!');
                setTimeout(() => {
                  queryBatteryElectricQuantity();
                }, 1500);
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

  //  扫码网络解析
  const qrcodeReq = (text: string) => {
    const { batteryVolts, driverId, provinceId, cityId, deptId, orgId, orgType } = getUserInfo();

    const sqcode = getQrcodeStr(text);
    if (sqcode !== '' && sqcode !== -1) {
      exchangePowerBusiness({
        batteryMarking: '0',
        batteryVolts,
        cabinetId: sqcode,
        driverId,
        provinceId,
        cityId,
        deptId,
        orgId,
        orgType,
      })
        .then(res => {
          const { resultCode, resultObject } = res;
          if (resultCode === '000') {
            //  绑定成功
            const { code, msg } = resultObject;
            if (code === '1') {
              if (msg === '扫机柜成功请扫电池') {
                oldBatteryOpenQrcode(sqcode);
              } else {
                Toast.success(msg);
                setTimeout(() => {
                  queryBatteryElectricQuantity();
                }, 1500);
              }
            } else if (hasBattery && code === '2') {
              Toast.success(msg);
              setTimeout(() => {
                queryBatteryElectricQuantity();
              }, 1500);
            } else {
              Toast.fail(msg);
            }
          }
        })
        .catch(err => {
          Toast.fail('开柜失败');
        });
    }
  };

  /**
   * 打开邮政扫码柜子
   */
  const openPostalBattery = (text: any) => {
    const { driverId } = getUserInfo();

    getPostalBatteryBinding({
      driverId,
      batteryId: text,
    }).then(res => {
      const { resultCode, resultObject } = res;
      if (resultCode === '000') {
        Toast.success(resultObject && resultObject.description);
        setTimeout(() => {
          queryBatteryElectricQuantity();
        }, 1500);
      } else {
        Toast.fail(resultObject.msg);
      }
    });
  };

  let isToScan = true;
  /**
   * 校验服务费
   */
  const checkPackageId = () => {
    const { packageId, availableDays, driverType } = getUserInfo();
    // if(ifPayDeposit === '0' && driverType === '2' && driverType === '3'){

    // }

    // if (!packageId) {
    if (!availableDays && availableDays === 0) {
      isToScan = false;
      Modal.alert('温馨提示', '您尚未缴费,是否前往缴费?', [
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
    } /* else if (packageId && availableDays <= 0) {
      isToScan = false;

      Modal.alert('温馨提示', '您的套餐已过期,是否前往续费?', [
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
    } */
  };

  /**
   * 校验押金
   */
  const cheackIfPayDeposit = () => {
    const { ifPayDeposit } = getUserInfo();
    if (ifPayDeposit === '0') {
      isToScan = false;
      Modal.alert('温馨提示', '您尚未缴纳押金,是否前往缴纳?', [
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
    }
  };

  // 扫码逻辑判断
  const sqCodeHandle = () => {
    console.log('isQrcode==', localStorage.getItem('isQrcode'));
    localStorage.removeItem('isQrcode');

    const { packageId, certification, availableDays, driverType, ifPayDeposit } = getUserInfo();

    // 如果是邮政用户
    if (driverType === '5') {
      openScanQrcode({ title: '扫码换电' }, openPostalBattery);
      return;
    }

    if (certification !== '1') {
      // 未实名
      isToScan = false;
      Modal.alert('温馨提示', '您尚未实名认证,是否实名认证?', [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '确认',
          onPress: () => {
            router.push({
              pathname: '/realNameAuth',
            });
          },
        },
      ]);
    } else if (driverType === '0') {
      // 骑手 校验 押金和服务费
      cheackIfPayDeposit();
      if (isToScan) {
        checkPackageId();
      }
    } else if (driverType === '1') {
      // 押金担保 不校验用户押金，只校验用户服务费
      checkPackageId();
    } else if (driverType === '2') {
      // 服务费担保 校验用户押金不校验用户服务费
      cheackIfPayDeposit();
    } else if (driverType === '3') {
      // 全额(押金/服务费)担保 用户扫码不校验押金和服务费
    }
    // else {
    //  扫码
    // eslint-disable-next-line no-lonely-if
    if (isToScan) {
      if (hasBattery) {
        openScanQrcode({ title: '扫码换电' }, qrcodeReq); // 扫码
      } else {
        console.log('info->', getUserInfo().cityId, getLoginInfo().driverId);
        dispatch!({
          // type: 'index/getAllSysAreaInfo',
          type: 'index/queryFirstTakeFlag',
          payload: {
            cityId: getUserInfo().cityId,
            driverId: getLoginInfo().driverId,
            callback: (res: { ifPermitTake: string; firstTakeFlag: string }) => {
              if (res && res.ifPermitTake === '0') {
                if (res.firstTakeFlag === '1') {
                  setShowModal(true);
                } else {
                  openScanQrcode({ title: '扫码换电' }, qrcodeReq); // 扫码
                }
              } else {
                Modal.alert('温馨提示', '本地市暂不支持首放功能，如有疑问，请咨询客服10096。', [
                  {
                    text: '确认',
                    onPress: () => {},
                  },
                ]);
              }
            },
          },
        });
      }
    }
    // }
  };
  // 渲染头部
  const renderAuthorHeaderTips = () => {
    const { certification } = getUserInfo();
    if (certification !== '1') {
      return (
        showTips && (
          <HomeTips
            text="完成身份认证，可进行换电服务"
            // type="Close"
            type="Button"
            onClose={() => {
              setShowTips(false);
            }}
            btnObj={{
              text: '立即认证',
              onClick: () => {
                router.push({
                  pathname: '/realNameAuth',
                });
              },
            }}
          />
        )
      );
    }
    return '';
  };

  // 渲染费用信息
  const renderFreeHeaderTips = () => {
    const { availableDays, packageId, driverType } = getUserInfo();
    if (driverType !== '2' && driverType !== '3' && packageId && availableDays < 3) {
      const tips =
        availableDays <= 0 ? '您的月卡已到期, 请续费' : `您的月卡套餐还剩${availableDays}天到期`;
      return (
        <HomeTips
          text={tips}
          type="Button"
          btnObj={{
            text: '立即续费',
            onClick: () => {
              router.push({
                pathname: '/myWallet/packageList',
              });
            },
          }}
          onClose={() => {
            setShowTips(false);
          }}
        />
      );
    }
    return '';
  };

  // 渲染电池离线时间提示
  const renderBatteryOfflineHeaderTips = () => {
    const diffMinutes = moment().diff(moment(batteryInfo.updateTime), 'minutes');
    const day = Math.floor(diffMinutes / 60 / 24);
    const hour = Math.floor((diffMinutes / 60) % 24);
    const min = Math.floor(diffMinutes % 60);

    let tisMsg = `电量超过${diffMinutes}分钟未更新`;
    if (day > 0) {
      tisMsg = `电量超过${day}天${hour}小时${min}分钟未更新`;
    } else if (hour > 0 && min > 0) {
      tisMsg = `电量超过${hour}小时${min}分钟未更新`;
    } else if (hour > 0 && min === 0) {
      tisMsg = `电量超过${hour}小时未更新`;
    } else if (hour === 0 && min > 0) {
      tisMsg = `电量超过${min}分钟未更新`;
    }
    if ((batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus) && diffMinutes > 0) {
      return (
        showBatteryTips && (
          <HomeTips
            text={tisMsg}
            // type="Close"
            type="Button"
            onClose={() => {
              setShowBatteryTips(false);
            }}
            btnObj={{
              text: '关闭',
              onClick: () => {
                setShowBatteryTips(false);
              },
            }}
          />
        )
      );
    }
    return '';
  };

  const renderLeftOperation = () => (
    <div className={styles.leftChangeOperation}>
      {leftOperationList.map(v => (
        <div
          className={classnames(styles.opItem, showType === v.key && styles.selected)}
          key={v.key}
          onClick={() => handleShowTypeClick(v.key)}
        >
          <img className={styles.typeIcon} src={showType === v.key ? v.selectedIcon : v.icon} />
          <div className={styles.title}>{v.title}</div>
        </div>
      ))}
    </div>
  );

  const queryReturnStationList = (params: coordinate = {}) => {
    dispatch!({
      type: 'index/selectRangeReturnStationList',
      payload: {
        cityId: getLoginInfo().cityId ? getLoginInfo().cityId : '',
        deptId: getLoginInfo().deptId ? getLoginInfo().deptId : '',
        provinceId: getLoginInfo().provinceId ? getLoginInfo().provinceId : '',
        orgId: getLoginInfo().orgId ? getLoginInfo().orgId : '',
        orgType: getLoginInfo().orgType ? getLoginInfo().orgType : '',

        stationLatitude: params.lat,
        stationLongitude: params.lng,
        stationStatus: '1',
        stationType: getStationType(),
      },
    });
  };

  const queryServiceNetworkList = (params = {}) => {
    dispatch!({
      type: 'index/queryNetworkInfoList',
      payload: {
        cityId: getLoginInfo().cityId ? getLoginInfo().cityId : '',
        deptId: getLoginInfo().deptId ? getLoginInfo().deptId : '',
        provinceId: getLoginInfo().provinceId ? getLoginInfo().provinceId : '',
        nodeType: '1',
      },
    });
  };

  const querySelectRangeStationList = (center: coordinate) => {
    dispatch!({
      type: 'index/selectRangeStationList',
      payload: {
        stationLatitude: center.lat,
        stationLongitude: center.lng,
        stationStatus: '1',
        cityId: getLoginInfo().cityId ? getLoginInfo().cityId : '',
        deptId: getLoginInfo().deptId ? getLoginInfo().deptId : '',
        provinceId: getLoginInfo().provinceId ? getLoginInfo().provinceId : '',
        stationType: getStationType(),
        orgId: getLoginInfo().orgId ? getLoginInfo().orgId : '',
        orgType: getLoginInfo().orgType ? getLoginInfo().orgType : '',
        callback: (list: any) => {
          // console.log(mapView.current);
          // res.latitude, res.longitude
          // renderLabel(list, center);
        },
      },
    });
  };

  // 初始化请求用户信息
  useEffect(() => {
    const { driverId } = getLoginInfo();
    dispatch!({
      type: 'personalNews/query',
      payload: {
        userId: driverId,
      },
    });

    getUserInfoTimes = 0;
    queryServiceNetworkList();
    return () => {};
  }, []);

  if (localStorage.getItem('isQrcode')) {
    sqCodeHandle();
  }

  // 页面入口函数
  useEffect(() => {
    dispatch!({
      type: 'register/selectUserInfo',
      payload: {
        driverId: getLoginInfo().driverId,
        callback: () => {
          const { certification } = getUserInfo();

          if (certification !== '1') {
            setShowTips(true);
          }
          showProtocol();
          pageInit();
        },
      },
    });

    return () => {
      if (batteryElectricTimer) {
        clearInterval(batteryElectricTimer);
      }
      clearStationTimer();
    };
  }, []);

  if (localStorage.getItem('isRefreshIndex')) {
    setTimeout(() => {
      if (localStorage.getItem('showRealNameTips')) {
        console.log('setShowTips(true)');
        setShowTips(true);
      } else {
        console.log('setShowTips(false)');
        setShowTips(false);
      }
    }, 1200);
    refreshEleHandle();
    showProtocol();
  }

  const goMessagePage = () => {
    history.push({
      pathname: '/news/news',
    });
  };

  // 新手使用指南
  const useageHandle = () => {};

  // 定位当前位置
  const locationCurrentPositionHandle = () => {
    // getCurrPosition();
  };

  if (localStorage.getItem('setProtocolVisible')) {
    localStorage.removeItem('setProtocolVisible');
    setProtocolVisible(true);
  }

  const handleShowTypeClick = (key: string) => {
    console.log(centerLat, lat, mapView.current.getCenter());
    setShowPop(false);
    setShowType(key);
    mapView.current.clearDirvingRoute();
    mapView.current.hiddenInfoWindow();
    statesRef.current = { ...statesRef.current, showType: key };
    let center: coordinate;
    if (centerLat && centerLng) {
      center = { lat: centerLat, lng: centerLng };
    } else {
      center = mapView.current.getCenter();
      setCenterLat(center.lat);
      setCenterLng(center.lng);
    }
    switch (key) {
      case 'batteryStation':
        querySelectRangeStationList(center);
        break;
      case 'serviceNetwork':
        queryServiceNetworkList();
        break;
      case 'return':
        queryReturnStationList(center);
        break;
      default:
        break;
    }
  };

  const getLabelsData = () => {
    let list = [];
    switch (showType) {
      case 'batteryStation':
        list = stationList;
        break;
      case 'serviceNetwork':
        list = serviceNetworkList;
        break;
      case 'return':
        list = returnStationList;
        break;
      default:
        break;
    }
    // if (mapView.current) {
    //   console.log(mapView);
    //   if (showType === 'return') {
    //     mapView.current.setCenter('39.938887', '116.374502'); // 测试
    //   } else if (showType === 'serviceNetwork') {
    //     mapView.current.setCenter(serviceNetworkList[0].lat, serviceNetworkList[0].lng);
    //   }
    // }
    console.log(showType, list);
    return list;
  };

  const handleMapDragend = (data: coordinate) => {
    console.log(statesRef.current.showType, data);
    setCenterLat(data.lat);
    setCenterLng(data.lng);
    switch (statesRef.current.showType) {
      case 'batteryStation':
        querySelectRangeStationList(data);
        break;
      case 'serviceNetwork':
        // 网点不根据经纬度查询
        // queryServiceNetworkList();
        break;
      case 'return':
        queryReturnStationList(data);
        break;
      default:
        break;
    }
  };

  const handleNodePopDetailClick = data => {
    // getCurrPosition();
    console.log(data);
    switch (data.type) {
      case 'batteryStation':
        router.push({
          pathname: '/eleCabinetDetail',
          query: {
            cabinetId: data.id,
            item: JSON.stringify(selectObj),
            type: showType,
          },
        });
        break;
      case 'serviceNetwork':
        router.push({
          pathname: '/serviceNetworkDetail',
          query: {
            nodeId: data.id,
            item: JSON.stringify(selectObj),
            type: showType,
          },
        });
        // queryServiceNetworkList(data);
        break;
      case 'return':
        router.push({
          pathname: '/eleCabinetDetail',
          query: {
            cabinetId: data.id,
            item: JSON.stringify(data),
            type: showType,
          },
        });
        break;
      default:
        break;
    }
  };

  // 查询地图点击覆盖物详情  换电站、网点、退电指引
  const handleQueryMapClickInfo = (data: any) => {
    switch (statesRef.current.showType) {
      case 'batteryStation':
        dispatch!({
          type: 'index/queryCabinetAndBatteryInfo',
          payload: {
            stationId: data.stationId,
            callback: (res: MapItemProps[] = []) => {
              console.log(res);
              if (res.length > 0) {
                setBsBatteryInfoList(res);
                setSelectObj({
                  ...data,
                  name: res[0].address,
                  addr: res[0].detailAddr,
                });
                setShowPop(true);
              }
            },
          },
        });
        break;
      case 'serviceNetwork':
        setBsBatteryInfoList([data]);
        setShowPop(true);
        break;
      case 'return':
        dispatch!({
          type: 'index/queryReturnCabinetInfo',
          payload: {
            stationId: data.stationId,
            callback: (res: MapItemProps[] = []) => {
              console.log(res);
              if (res.length > 0) {
                setBsBatteryInfoList(res);
                setSelectObj({
                  ...data,
                  name: res[0].address,
                  addr: res[0].detailAddr,
                });
                setShowPop(true);
              }
            },
          },
        });
        break;
      default:
        break;
    }
  };

  // 拨打客服电话
  const telToCustom = () => {
    ServiceModal.show({});
  };
  return (
    <div className={styles.container}>
      <Drawer
        className={styles.drawer}
        open={showDraw}
        position="left"
        enableDragHandle
        sidebar={
          <SliderBar
            batteryId={hasBattery ? batteryInfo.batteryId : ''}
            onClose={() => {
              // setShowDraw(false);
              dispatch!({
                type: 'index/save',
                payload: {
                  showDraw: false,
                },
              });
            }}
          />
        }
        onOpenChange={() =>
          // setShowDraw(!showDraw)
          dispatch!({
            type: 'index/save',
            payload: {
              showDraw: false,
            },
          })
        }
      >
        <div className={styles.drawerContent}>
          <div>
            <NavBar
              mode="light"
              icon={<AvatarIcon key="2" />}
              onLeftClick={() => {
                // setShowDraw(true)
                setShowPop(false);
                dispatch!({
                  type: 'index/save',
                  payload: {
                    showDraw: true,
                  },
                });
              }}
              rightContent={[
                hasBattery ? (
                  <EleTower
                    key="0"
                    precent={batteryInfo.currentCapacity}
                    isoutLine={batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus}
                    click={() => {
                      router.push({ pathname: '/myBattery' });
                    }}
                  />
                ) : (
                  ''
                ),
                <div
                  key="1"
                  className={styles.msgIcon}
                  onClick={() => {
                    goMessagePage();
                  }}
                >
                  <img className={styles.navItem} src={IconMessage} />
                </div>,
              ]}
            >
              <img className={styles.titleView} src={IconLogoTower} alt="" />
            </NavBar>
          </div>
          {renderAuthorHeaderTips()}
          {renderFreeHeaderTips()}
          {renderBatteryOfflineHeaderTips()}
          <div id="mapWrapper" className={styles.mapContainer} style={{ overflow: 'hidden' }}>
            <IndexMapView
              ref={mapView}
              id="mapViewContainer"
              zoom={16}
              onMapClick={() => {
                // Toast.info('onMapClick==setShowPop');
                setShowPop(false);
              }}
              initialPosition={{ lat, lng }}
              curPosition={{
                onClick: (e: any) => {},
              }}
              onLabelClick={(item: any, label: any) => {
                console.log(item);
                setSelectObj(item);

                if (item.greyFlag === '1') {
                  return;
                }

                mapView.current.drivingRoute(
                  {
                    lng: Number(lng),
                    lat: Number(lat),
                  },
                  { lng: Number(item.lng), lat: Number(item.lat) },
                );

                handleQueryMapClickInfo(item);
              }}
              // onDragendListener={handleMapDragend}
              onDragendListener={(center: coordinate) => {
                console.log('object center');
                // Toast.info('地图中心点变更为：' + center.lng + ', ' + center.lat);
                handleMapDragend(center);
              }}
              // 119.269503,26.085834
              labels={getLabelsData()}
              labelsType="indexMap"
            />
          </div>
          <div className={styles.currentBtn}>
            <img src={IconCurrentPosition} alt="" className={styles.img} />
          </div>

          <div className={styles.toolbar}>
            <a
              // href={`tel:${getCustomerTel()}`}
              className={styles.toolItemBtn}
              onClick={() => {
                telToCustom();
              }}
            >
              <img src={IconKeFu} alt="" />
            </a>

            <div
              className={styles.toolItemBtn}
              onClick={() => {
                mapView.current.goCurrentPosition(true);
                locationCurrentPositionHandle();
              }}
            >
              <img src={IconUnDingWei} alt="" />
            </div>
          </div>
          {renderLeftOperation()}
          {/* <div
            className={styles.zhinan}
            onClick={() => {
              useageHandle();
            }}
          >
            <img src={IconZhiNam} alt="" />
          </div>
           */}
          <div
            className={styles.refreshBtn}
            onClick={event => {
              event.stopPropagation();
              Toast.loading('正在加载中...');
              refreshEleHandle();
              setTimeout(() => {
                Toast.hide();
              }, 1500);
            }}
          >
            <img src={IconRefresh} alt="" />
          </div>
          <MapPopView
            list={bsBatteryInfoList}
            type={showType}
            navigationOptions={{
              name: selectObj.name,
              lat: selectObj.stationLatitude,
              lng: selectObj.stationLongitude,
              origin: '我的位置',
              mode: 'riding',
              addr: selectObj.addr,
            }}
            show={showPop}
            onDetailHandle={() => {
              router.push({
                pathname: '/powerStation',
                query: {
                  item: JSON.stringify(selectObj),
                  list: JSON.stringify(bsBatteryInfoList),
                },
              });
            }}
            onClick={(item, index) => {
              if (item.greyFlag === '1') {
                return;
              }
              handleNodePopDetailClick(item);
            }}
            onClose={() => {
              setShowPop(false);
            }}
            // list={cabinetList}
          />
          <div className={styles.qrCodeBtnBg}>
            <div className={styles.qrCodeBtn} onClick={sqCodeHandle}>
              <img src={IconScan} alt="" />
              <span>扫码换电</span>
            </div>
          </div>
        </div>
      </Drawer>
      <ProtocolModal
        visible={protocolVisible}
        goProtocol={() => {
          dispatch!({
            type: 'login/getAgreement',
            payload: {
              type: 'privacyPolicy_agreement',
              callback: (url: any) => {
                dispatch!({
                  type: 'protocol/save',
                  payload: {
                    protocolDetail: url,
                  },
                });
                setProtocolVisible(false);
                router.push({
                  pathname: '/protocol',
                  query: {
                    title: '铁塔换电隐私政策',
                  },
                });
              },
            },
          });
        }}
        onClose={() => {
          setProtocolVisible(false);
        }}
      />
      <AlertAction
        visiable={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        list={[
          {
            key: '01',
            title: '48V',
            onClick: () => {
              dispatch!({
                type: 'personalNews/updateUserInfoNews',
                payload: {
                  batteryVolts: '48',
                  driverId: getLoginInfo().driverId,
                  callback: () => {
                    setShowModal(false);
                    openScanQrcode({ title: '扫码换电' }, qrcodeReq); // 扫码
                    // dispatch!({
                    //   type: 'index/queryFirstTakeFlag',
                    //   payload: {
                    //     cityId: getUserInfo().cityId,
                    //     driverId: getLoginInfo().driverId,
                    //     callback: (res) => {
                    //       if (res.firstTakeFlag === '1') {
                    //         setShowModal(true);
                    //       } else {
                    //         openScanQrcode(qrcodeReq); // 扫码
                    //       }
                    //     },
                    //   }
                    // });
                  },
                },
              });
            },
          },
          {
            key: '02',
            title: '60V',
            onClick: () => {
              dispatch!({
                type: 'personalNews/updateUserInfoNews',
                payload: {
                  batteryVolts: '60',
                  driverId: getLoginInfo().driverId,
                  callback: () => {
                    setShowModal(false);
                    // dispatch!({
                    //   type: 'index/queryFirstTakeFlag',
                    //   payload: {
                    //     cityId: getUserInfo().cityId,
                    //     driverId: getLoginInfo().driverId,
                    //     callback: (res) => {
                    //       if (res.firstTakeFlag === '1') {
                    //         setShowModal(true);
                    //       } else {
                    //         openScanQrcode(qrcodeReq); // 扫码
                    //       }
                    //     },
                    //   }
                    // });
                    openScanQrcode({ title: '扫码换电' }, qrcodeReq); // 扫码
                  },
                },
              });
            },
          },
        ]}
      />
    </div>
  );
};

export default connect(
  ({ index, myBattery }: { index: IndexModelState; myBattery: MyBatteryModelState }) => ({
    index,
    myBattery,
  }),
)(IndexPage);

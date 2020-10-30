import React, { FC, useEffect, useState } from 'react';
import { MyBatteryModelState, ConnectProps, connect, router, setPageNavBar } from 'alita';
import { Toast, Modal, Button } from 'antd-mobile';
import NonBatteryIcon from '@/assets/images/non-battery.png';
import GreenBatteryIcon from '@/assets/images/rent-battery.png';
import RedBatteryIcon from '@/assets/images/mywallet-red@3x.png';
import OrangeBatteryIcon from '@/assets/images/mywallet-orange@3x.png';
import GrayBatteryIcon from '@/assets/images/mywallet-gray@3x.png';

import BatteryTrackingIcon from '@/assets/images/battery-tracking.png';
import BatterySettingIcon from '@/assets/images/battery-setting.png';
import iconBatteryMovingTrack from '@/assets/images/icon-battery-moving-track.png';
import RefundIcon from '@/assets/images/refund.png';
import { getLoginInfo, getUserInfo, getQrcodeStr } from '@/utils';
import { openScanQrcode ,commonFunc} from '@/utils/cordovapluigs';
import { exchangePowerBusiness } from '@/services/netRequest';
import moment from "moment";
import styles from './index.less';

interface PageProps extends ConnectProps {
  myBattery: MyBatteryModelState;
}

const MyBatteryPage: FC<PageProps> = ({ myBattery, dispatch }) => {
  const { batteryInfo = {}, isRent = false } = myBattery;
  const { driverType } = getUserInfo();
  let timer = null;
  const batteryRequest = () => {
    timer = setTimeout(() => {
      dispatch!({
        type: 'myBattery/queryBatteryElectricQuantity',
        payload: {
          driverId: getLoginInfo().driverId,
          callback: (haBattery: boolean) => {
            if (!haBattery) {
              clearInterval(timer);
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

  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'myBattery/queryBatteryElectricQuantity',
      payload: {
        driverId: getLoginInfo().driverId,
        // batteryId: 'BT104801212SZHL191223006',
      },
    });
    
    if (!getUserInfo().cityId) {
      const { driverId } = getLoginInfo();
      dispatch!({
        type: 'login/selectUserInfo',
        payload: {
          driverId,
        },
      });
    }

    setPageNavBar({
      pagePath: '/myBattery',
      navBar: {
        rightContent: (
          <div
            style={{ color: '#00BF83' }}
            onClick={() => {
              router.push({
                pathname: '/myBattery/operationGuide',
              });
            }}
          >
            操作指南
          </div>
        ),
      },
    });

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = myBattery;

  // const [isRent, setIsRent] = useState(true);

  // const elec = '20%';

  // 退还
  const refund = () => {
    openScanQrcode({title:'扫码换电'},text => {
      const { batteryVolts, driverId, provinceId, cityId, deptId ,orgId,
        orgType, } = getUserInfo();
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

  const judge = (data: string) => {
    // const tmp = data.split('%').join('');
    if (Number(data) <= 30) {
      return false;
    }
    return true;
  };

  const toSetting = () => {
    router.push({
      pathname: '/myBattery/batterySetting',
    });
  };

  const toTracking = () => {
    router.push({
      pathname: '/myBattery/batteryTracking',
      query: {
        batteryInfo
      },
    });
  };

  const handleMovingTrackClick = () => {
    router.push({
      pathname: '/myBattery/movingTrack',
      query: {
        batteryId: batteryInfo.batteryId,
      },
    });
  };

  const showNonBattery = () => {
    const { certification, ifPayDeposit, packageId, cityId, driverType } = getUserInfo();
    return (
      <div className={styles.nonBatteryContainer}>
        <img src={NonBatteryIcon} className={styles.nonImg} />
        <div className={styles.nonTitle}>您当前未租用电池</div>
        {
          ((driverType !== '3' && driverType !== '2') || (driverType === '2' && ifPayDeposit === '0') ||
          (driverType === '0' && ifPayDeposit === '0')) && (
            <Button
              className={styles.goRent}
              onClick={() => {
                if (certification !== '1') {
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
                  return;
                }
                // const { ifPayDeposit, packageId } = getUserInfo();
                if (ifPayDeposit === '1' && packageId) {
                  localStorage.setItem('isQrcode', 'true');
                  // dispatch!({
                  //   type: 'index/save',
                  //   payload: {
                  //     showDraw: false,
                  //   },
                  // });
                  // router.goBack();
                  commonFunc({
                    method: 'popToView',
                  });
                } else if ((ifPayDeposit === '1' && !packageId) ||
                driverType === '1') { // 已缴纳押金并且是空套餐或者是免押用户
                  router.push({
                    pathname: '/myWallet/packageList',
                  });
                } else if (ifPayDeposit === '0') {
                  router.push({
                    pathname: '/myWallet/depositType',
                    query: {
                      cityId,
                    },
                  });
                }
              }}
            >
              {(ifPayDeposit === '0' && driverType !== '1') ? '去缴纳押金' : '去租电池'}
            </Button>
          )
        }
      </div>
    );
  };

  const getIcon = () => {
    if (batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus) {
      return GrayBatteryIcon;
    }

    if (batteryInfo.currentCapacity >= 30) {
      return GreenBatteryIcon;
    }
    if (batteryInfo.currentCapacity >= 20) {
      return OrangeBatteryIcon;
    }

    return RedBatteryIcon;
  };

  const elebgcolor = () => {
    if (batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus) {
      return '#808080';
    }

    if (batteryInfo.currentCapacity >= 30) {
      return 'rgba(0, 191, 143, 1)';
    }

    if (batteryInfo.currentCapacity >= 20) {
      return 'orange';
    }

    return '#ff4f1d';
  };

  const showRentBattery = () => {
    console.log();
    const diffMinutes = moment().diff(moment(batteryInfo.updateTime),'minutes');
    const day = Math.floor(diffMinutes / 60 / 24);
    const hour = Math.floor(diffMinutes / 60 % 24);
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
    return (
      <div className={styles.batteryContainer}>
        <div className={styles.tipBox}>
          <div
            className={judge(batteryInfo.currentCapacity) ? styles.highColor : styles.lowColor}
            style={{ color: elebgcolor() }}
          >
            {/* {batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus ? '已离线' : '剩余'} */}
            剩余
          </div>
          <div
            /* hidden={batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus} */
            className={judge(batteryInfo.currentCapacity) ? styles.highBigColor : styles.lowColor}
            style={{ color: elebgcolor() }}
          >
            {batteryInfo.currentCapacity}%
          </div>
        </div>
        <img src={getIcon()} className={styles.imgBox} />
        <div className={batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus ? styles.offlineTitle : styles.title}>
          {batteryInfo.onlineStatus === '0' || !batteryInfo.onlineStatus ? tisMsg : '正在使用…'}</div>
        <div className={styles.detailCard}>
          <div>电池编码：{batteryInfo.batteryId}</div>
          <div>电池型号：{batteryInfo.batteryModel}</div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.dealContainer}>
            <div className={styles.dealBox}>
              <img src={BatteryTrackingIcon} onClick={toTracking} />
              <div>实时跟踪</div>
            </div>
            <div className={styles.dealBox}>
              <img src={iconBatteryMovingTrack} onClick={handleMovingTrackClick} />
              <div>运动轨迹</div>
            </div>
            <div className={styles.dealBox}>
              <img
                src={RefundIcon}
                onClick={() => {
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
                }}
              />
              <div>退电池</div>
            </div>
            <div className={styles.dealBox} style={{ display: 'none' }}>
              <img src={BatterySettingIcon} onClick={toSetting} />
              <div>设置</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div className={styles.center}>{isRent ? showRentBattery() : showNonBattery()}</div>;
};

export default connect(({ myBattery }: { myBattery: MyBatteryModelState }) => ({ myBattery }))(
  MyBatteryPage,
);

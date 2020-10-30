import React, { FC, useEffect, useState } from 'react';
import { Toast, Modal } from 'antd-mobile';
import AvatarIcon from '@/components/AvatarIcon';
import IconQianBao from '@/assets/images/home-qianbao.png';
import IconOrder from '@/assets/images/home-order.png';
import IconApply from '@/assets/images/apply-icon.png';
import IconEle from '@/assets/images/home-ele-icon.png';
import IconKeFu from '@/assets/images/home-kefu-s.png';
import IconFanKui from '@/assets/images/home-fakui.png';
import IconShare from '@/assets/images/home-share.png';
import IconInvate from '@/assets/images/home-invate.png';
import IconMyCar from '@/assets/images/icon-myCar.png';
import IconSetting from '@/assets/images/home-setting.png';
import IconEleRecord from '@/assets/images/ele-record.png';
import { getPostalBatteryUnbound } from '@/services/netRequest';
import { history, NavLink, connect, router } from 'alita';
import {
  clearLoginInfo,
  clearUserInfo,
  getLoginParamInfo,
  saveLoginParamInfo,
} from '@/utils/index';
import { clearJpushAlias, commonFunc } from '@/utils/cordovapluigs';
import { getAppVersion, isNeedUpdate, checkAppVersionUpdate } from '@/global';
import styles from './index.less';
import { share, openScanQrcode } from '@/utils/cordovapluigs';
import { getLoginInfo, getCustomerTel, getUserInfo } from '@/utils';
import classnames from 'classnames';
import { getAppShareLink } from '@/services/getRequest';
import ServiceModal from '@/pages/index/components/ServiceModal';

const listViewData = [
  {
    icon: IconQianBao,
    title: '我的钱包',
    showRight: true,
    routerName: '/myWallet',
    type: 'page',
  },
  {
    icon: IconOrder,
    title: '我的订单',
    showRight: true,
    routerName: '/myOrder',
    type: 'page',
  },
  {
    icon: IconApply,
    title: '我的申请',
    showRight: true,
    routerName: '/myWallet/applyRefundList',
    type: 'page',
  },
  {
    icon: IconEleRecord,
    title: '换电记录',
    showRight: true,
    routerName: '/exchangeEleList',
    type: 'page',
  },
  {
    icon: IconEle,
    title: '我的电池',
    showRight: true,
    routerName: '/myBattery',
    type: 'page',
  },
  {
    icon: IconMyCar,
    title: '我的车辆',
    showRight: true,
    routerName: '/carManage',
    type: 'page',
  },
  {
    icon: IconKeFu,
    title: '铁塔客服',
    showRight: true,
    routerName: '',
    type: 'tel',
  },
  {
    icon: IconFanKui,
    title: '意见反馈',
    showRight: true,
    routerName: '/personalCenter/feedBack',
    type: 'page',
  },
  {
    icon: IconInvate,
    title: '老带新',
    showRight: true,
    routerName: '/personalCenter/qrCodeInvate',
    type: 'page',
  },
  {
    icon: IconShare,
    title: '分享',
    showRight: true,
    routerName: '',
    type: 'share',
  },
  {
    icon: IconSetting,
    title: '设置',
    showRight: true,
    routerName: '/personalCenter/setup',
    type: 'page',
  },
];

let timer = null;

interface SliderBarProps {
  onClose: () => void;
  batteryId: string;
}

const SliderBar: FC<SliderBarProps> = ({ onClose = () => {}, batteryId = '', dispatch }) => {
  // const { realName, account } = getLoginInfo();
  // const { certification, realName, account, availableDays } = getUserInfo();
  const [midHeight, setMidHeight] = useState(0);

  //获取中间高度
  const getMidHeight = () => {
    let h =
      window.screen.availHeight ||
      window.screen.height ||
      document.body.clientHeight - 574 ||
      document.body.offsetHeight - 574 ||
      document.documentElement.clientHeight - 574;
    let h_h = document.getElementById('myHeader')?.clientHeight || 0;
    let b_h = document.getElementById('myBottomBtn')?.clientHeight || 0;
    h = h - h_h - b_h + 90;
    setMidHeight(h);
  };

  useEffect(() => {
    getMidHeight();
  }, []);
  const { certification, realName, account, availableDays, driverType } = getUserInfo();

  const batteryRequest = () => {
    timer = setTimeout(() => {
      dispatch!({
        type: 'myBattery/queryBatteryElectricQuantity',
        payload: {
          driverId: getLoginInfo().driverId,
          callback: (haBattery: boolean) => {
            if (!haBattery) {
              clearInterval(timer);
            } else {
              batteryRequest();
            }
          },
        },
      });
    }, 2000);
  };

  const getPostalOpenSqcode = () => {
    openScanQrcode({ title: '扫码换电' }, text => {
      getPostalBatteryUnbound({
        batteryId: text,
        driverId: getUserInfo().driverId,
      }).then(res => {
        const { resultCode, resultObject } = res;
        if (resultCode === '000') {
          batteryRequest();
          Toast.success(resultObject.description);
        }
      });
    });
  };

  const renderHeaderView = () => (
    <div
      className={styles.headerView}
      id="myHeader"
      onClick={e => {
        e.stopPropagation();
        // onClose();
        history.push({
          pathname: '/personalCenter/personalNews',
        });
      }}
    >
      <div className={styles.headerBd}>
        <AvatarIcon large />
        <div>
          <div>
            {realName && <span className={styles.name}>{realName}</span>}
            <span
              className={classnames({
                [styles.authStatus]: true,
                [styles.did]: certification === '1',
              })}
            >
              {certification === '1' ? '已认证' : '未认证'}
            </span>
          </div>
          <div className={styles.phoneNum}>{account}</div>
          <div className={styles.batteryId}>{batteryId}</div>
        </div>
      </div>
      <div className={styles.headerViewFt}></div>
    </div>
  );
  const renderMenuView = () => (
    <div className={styles.menuView}>
      <div className={styles.menuViewWrapper} style={{ height: `${midHeight}px` }}>
        {listViewData.map((res, index) => {
          if (res.type === 'tel') {
            return (
              <a
                // href={`tel:${getCustomerTel() || '10096'}`}
                key={index}
                className={styles.menuViewCell}
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                  ServiceModal.show({});
                }}
              >
                <div className={styles.cellHd}>
                  <div className={styles.cellIcon} style={{ width: '22px', height: '22px' }}>
                    <img src={res.icon} alt="" />
                  </div>
                  <div className={styles.cellTitle} style={{ fontSize: '14px' }}>
                    {res.title}
                  </div>
                </div>
                <div className={styles.cellFt}></div>
              </a>
            );
          }
          return (
            <div
              key={index}
              className={styles.menuViewCell}
              onClick={e => {
                e.stopPropagation();
                if (res.type === 'page') {
                  if (res.routerName === '/exchangeEleList' && getUserInfo().driverType === '5') {
                    getPostalOpenSqcode();
                  } else if (res.routerName === '/personalCenter/qrCodeInvate') {
                    // 老带新
                    if (certification !== '1') {
                      Modal.alert(
                        '温馨提示',
                        '老带新功能，需实名认证并购买套餐后才能使用。请您确认是否先去实名认证？',
                        [
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
                        ],
                      );
                    } else if (availableDays <= 0 && driverType !== '2' && driverType !== '3') {
                      Modal.alert(
                        '温馨提示',
                        '老带新功能，需购买套餐后才能使用。请您确认是否购买套餐？',
                        [
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
                        ],
                      );
                    } else {
                      history.push({
                        pathname: res.routerName,
                      });
                    }
                  } else {
                    history.push({
                      pathname: res.routerName,
                    });
                  }
                } else if (res.type === 'share') {
                  getAppShareLink().then(res => {
                    const { resultCode, resultObject, resultMsg } = res;
                    if (resultCode === '000') {
                      share(
                        {
                          type: 'webpage',
                          title: resultObject.appShareTitle,
                          url: resultObject.appShareLink,
                          icon: resultObject.appShareImage,
                          description: resultObject.appShareContent,
                        },
                        () => {
                          // 成功回调
                        },
                        () => {
                          // 分享失败的回调
                        },
                      );
                      onClose();
                    } else {
                      Toast.fail(resultMsg);
                    }
                  });
                } else if (res.type === 'tel') {
                  // 拨打电话
                }
              }}
            >
              <div className={styles.cellHd}>
                <div className={styles.cellIcon} style={{ width: '22px', height: '22px' }}>
                  <img src={res.icon} alt="" />
                </div>
                <div className={styles.cellTitle} style={{ fontSize: '14px' }}>
                  {res.routerName === '/exchangeEleList' && getUserInfo().driverType === '5'
                    ? '解绑电池'
                    : res.title}
                </div>
              </div>
              <div className={styles.cellFt}></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const exit = () => {
    console.log('点击退出');
    const { phoneNumber } = getUserInfo();

    dispatch!({
      type: 'setup/exit',
      payload: {
        phone: phoneNumber,
        userId: getUserInfo().driverId,
        driverId: getUserInfo().driverId,
        callback: () => {
          clearJpushAlias();
          clearLoginInfo();
          clearUserInfo();
          const tmpParam = {
            account: getLoginParamInfo() ? getLoginParamInfo().account : '',
          };
          saveLoginParamInfo(tmpParam);
          router.push({
            pathname: '/',
          });
        },
      },
    });
    dispatch!({
      type: 'index/save',
      payload: {
        showDraw: false,
        stationList: [],
      },
    });
  };

  const [version, setVersion] = useState('');

  useEffect(() => {
    if ((window as any).device.platform.toLowerCase() === 'ios') {
      commonFunc(
        {
          method: 'appversion',
        },
        res => {
          setVersion(res);
        },
      );
    } else {
      getAppVersion().then(res => {
        setVersion(res);
      });
    }
  }, []);
  const checkUpdate = () => {
    if (isNeedUpdate) {
      onClose();
      checkAppVersionUpdate();
    } else {
      Toast.info('您目前版本为最新版本');
    }
  };

  const renderFootView = () => (
    <div className={styles.footView} id="myBottomBtn">
      <div className={styles.versionDiv} onClick={checkUpdate}>
        版本号 V{version}
        <span className={isNeedUpdate ? styles.notice : ''}></span>
      </div>
      <div className={styles.loginOutDiv} onClick={exit}>
        退出登录
      </div>
    </div>
  );

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderBar}>
        {renderHeaderView()}
        {renderMenuView()}
        {renderFootView()}
      </div>
    </div>
  );
};

export default connect(({}) => ({}))(SliderBar);

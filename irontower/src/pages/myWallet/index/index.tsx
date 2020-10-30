import React, { FC, useEffect, useState } from 'react';
import { MyWalletModelState, ConnectProps, connect, router, LoginModelState } from 'alita';
import RentBatteryIcon from '@/assets/images/rent-battery.png';
import MyWalletIcon from '@/assets/images/my-wallet.png';
import ArrowRightIcon from '@/assets/images/arrow-right.png';
import TopTipIcon from '@/assets/images/top-tip.png';
import styles from './index.less';
import { getLoginInfo, getUserInfo } from '@/utils';
import { Toast, Modal } from 'antd-mobile';
import {
  aliRefund,
  wxRefund,
  fundPreUnFreeze,
  selectUserAuthPaymentRecord,
  getUserRefundFee,
} from '@/services/netRequest';
import { packageTypeDict } from '@/utils/constant';

interface PageProps extends ConnectProps {
  myWallet: MyWalletModelState;
}

const MyWalletPage: FC<PageProps> = ({ myWallet, dispatch, login }) => {
  const [showTips, setShowTips] = useState(false);
  const { driverId, phoneNumber, cityId, provinceId } = getLoginInfo();
  const { userInfo } = login;
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'login/selectUserInfo',
      payload: {
        driverId,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = myWallet;

  const toTradingDetail = () => {
    router.push({
      pathname: '/myWallet/tradingDetail',
    });
  };

  const pushToRealAuthor = () => {
    const { certification } = userInfo;
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
    router.push({
      pathname: '/myWallet/packageList',
      query: {
        ...userInfo,
      },
    });
  };

  // 退款
  const refundTypeReq = (refundMethod: string, options: any) => {
    if (refundMethod === '02') {
      // 支付宝退款
      aliRefund({
        refundMethod: '02',
        ...options,
      }).then(res => {
        const { resultMsg, resultCode } = res;
        if (resultCode === '000') {
          Toast.success(resultMsg);
          dispatch!({
            type: 'login/selectUserInfo',
            payload: {
              driverId,
            },
          });
        }
      });
    }

    if (refundMethod === '03') {
      // 微信退款
      wxRefund({
        refundMethod: '03',
        ...options,
      }).then(res => {
        const { resultMsg, resultCode } = res;
        if (resultCode === '000') {
          Toast.success(resultMsg);
          dispatch!({
            type: 'login/selectUserInfo',
            payload: {
              driverId,
            },
          });
        }
      });
    }
  };

  //  渲染押金view
  const renderDepositView = () => {
    const { ifPayDeposit, depositType, deptId, packageId } = userInfo;
    if (ifPayDeposit === '0') {
      // 未缴纳押金
      return (
        <div className={styles.cellContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.imgContainer}>
              <img src={MyWalletIcon} />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.title}>押金</div>
              <div style={{ color: '#FB602D' }}>未缴纳押金</div>
            </div>
          </div>
        </div>
      );
    }

    if (depositType === '3') {
      // 蚂蚁资金冻结认证
      return (
        <div className={styles.box}>
          <div className={styles.cellContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.imgContainer}>
                <img src={MyWalletIcon} />
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.title}>押金</div>
                <div style={{ color: '#00BF8F' }}>已免押</div>
              </div>
            </div>
            <div
              className={styles.tipBtn}
              onClick={() => {
                Modal.alert(
                  '温馨提示',
                  '直接退押金后，套餐将不可使用。如需退服务费，请先退还服务费，再退还押金。',
                  [
                    {
                      text: '取消',
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        selectUserAuthPaymentRecord({
                          driverId: getLoginInfo().driverId,
                        }).then(response => {
                          if (response.resultCode === '000') {
                            // 解绑
                            fundPreUnFreeze({
                              packageId,
                              userId: driverId,
                              userPhone: phoneNumber,
                            }).then(res => {
                              const { resultMsg, resultCode } = res;
                              if (resultCode === '000') {
                                Toast.success(resultMsg);
                                dispatch!({
                                  type: 'login/selectUserInfo',
                                  payload: {
                                    driverId,
                                  },
                                });
                              } else {
                                Toast.fail(resultMsg);
                              }
                            });
                          }
                        });
                      },
                    },
                  ],
                );
              }}
            >
              解绑
            </div>
            <div className={styles.tipCard} style={{ background: '#FB602D' }}></div>
          </div>
        </div>
      );
    }
    if (depositType === '1' || depositType === '2') {
      // 支付宝或者是微信
      return (
        <div className={styles.box}>
          <div className={styles.cellContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.imgContainer}>
                <img src={MyWalletIcon} />
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.title}>押金</div>
                <div style={{ color: '#FB602D' }}>已缴纳押金</div>
              </div>
            </div>
            <div
              className={styles.tipBtn}
              onClick={() => {
                Modal.alert(
                  '温馨提示',
                  '直接退押金后，套餐将不可使用。如需退服务费，请先退还服务费，再退还押金。',
                  [
                    {
                      text: '取消',
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        // 退款
                        getUserRefundFee({
                          refundType: '1',
                          userId: driverId,
                        }).then(response => {
                          if (response.resultCode === '000') {
                            refundTypeReq(response.resultObject.refundMethod, {
                              deptId,
                              refundType: '1',
                              userId: driverId,
                              cityCode: cityId,
                              provinceCode: provinceId,
                              refundFee: response.resultObject.refundFee,
                              outTradeNo: response.resultObject.outTradeNo,
                            });
                          }
                        });
                      },
                    },
                  ],
                );
              }}
            >
              退费
            </div>
            <div className={styles.tipCard} style={{ background: '#FB602D' }}></div>
          </div>
        </div>
      );
    }
    return '';
  };

  const getAvailableDaysText = (availableDays: number) => {
    if (availableDays > 0) {
      return `剩余${availableDays}天`;
    }

    return '您的套餐已过期';
  };

  // 渲染套餐
  const renderPackageView = () => {
    const { packageId, availableDays, packageName } = userInfo;
    if (!packageId) {
      // 如果不存在套餐
      return (
        <div className={styles.box}>
          <div className={styles.cellContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.imgContainer}>
                <img src={RentBatteryIcon} />
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.title}>套餐</div>
                <div>未购买套餐</div>
              </div>
            </div>

            <div
              className={styles.tipBtn}
              onClick={() => {
                // fundPreUnFreeze({
                //   // aliAuthNo: 'SQ20200330172809510154093180',
                //   packageId,
                //   userId: driverId,
                //   userPhone: phoneNumber,
                // }).then((res) => {
                //   const { resultMsg, resultCode } = res;
                //   if (resultCode === '000') {
                //     Toast.success(resultMsg);
                //   } else {
                //     Toast.fail(resultMsg);
                //   }
                // });
                pushToRealAuthor();
              }}
            >
              购买
            </div>
          </div>
          <div className={styles.tipCard}></div>
        </div>
      );
    }
    return (
      <div className={styles.box}>
        <div className={styles.cellContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.imgContainer}>
              <img src={RentBatteryIcon} />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.title}>{packageName}</div>
              <div>{getAvailableDaysText(availableDays)}</div>
            </div>
          </div>

          <div
            className={styles.tipBtn}
            onClick={() => {
              router.push({
                pathname: '/myWallet/packageList',
                query: {
                  packageId,
                  ...userInfo,
                },
              });
            }}
          >
            续费
          </div>
        </div>
        <div className={styles.tipCard}></div>
      </div>
    );
  };

  const renderToMyOrderView = () => {
    return (
      <div className={styles.box}>
        <div className={styles.cellContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.imgContainer}>
              <img src={MyWalletIcon} />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.title}>服务费</div>
              <div></div>
            </div>
          </div>

          <div
            className={styles.tipBtn}
            onClick={() => {
              router.push({
                pathname: '/myOrder',
              });
            }}
          >
            退费
          </div>
        </div>
        <div className={styles.tipCard} style={{ background: 'rgb(251, 96, 45)' }}></div>
      </div>
    );
  };

  return (
    <div className={styles.center}>
      <div className={styles.cardContainer}>
        {renderPackageView()}
        {renderToMyOrderView()}
        <div className={styles.box}>{renderDepositView()}</div>
        {/* <div className={styles.mainContentContainer}>
        </div> */}
        <div
          className={styles.lineContainer}
          onClick={() => {
            router.push({
              pathname: '/couponsView',
            });
          }}
        >
          <div>优惠券</div>
          <img src={ArrowRightIcon} />
        </div>

        <div className={styles.lineContainer} onClick={toTradingDetail}>
          <div>交易明细</div>
          <img src={ArrowRightIcon} />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ myWallet, login }: { myWallet: MyWalletModelState; login: LoginModelState }) => ({
    myWallet,
    login,
  }),
)(MyWalletPage);

import React, { FC, useEffect, useState } from 'react';
import {
  MyWalletModelState,
  ConnectProps,
  connect,
  router,
  LoginModelState,
  setPageNavBar,
} from 'alita';
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
  getRefundStatusConfirm,
} from '@/services/netRequest';
import { packageTypeDict } from '@/utils/constant';
import IconMyWallet from '@/assets/images/mywellaticon.png';
import IconMyYajin from '@/assets/images/yajinicon.png';
import IconCoupon from '@/assets/images/coupon.png';
import IconArrowright from '@/assets/images/arrowright.png';
import { getRefundStatusConfirmRequest } from '@/utils/payUtils';
let modalObject = null;

interface PageProps extends ConnectProps {
  myWallet: MyWalletModelState;
}

const MyWalletPage: FC<PageProps> = ({ myWallet, dispatch, login }) => {
  // const [visible, setVisible] = useState(false);
  const { driverId, phoneNumber, cityId, provinceId } = getLoginInfo();
  const { driverType } = getUserInfo();
  const { userInfo } = login;

  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'login/selectUserInfo',
      payload: {
        driverId,
      },
    });

    setPageNavBar({
      pagePath: '/myWallet',
      navBar: {
        rightContent: (
          <div
            style={{ color: '#00BF83' }}
            onClick={() => {
              toTradingDetail();
            }}
          >
            交易明细
          </div>
        ),
      },
    });

    return () => {
      if (modalObject) {
        modalObject.close();
      }
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const toTradingDetail = () => {
    router.push({
      pathname: '/myWallet/tradingDetail',
    });
  };

  const pushToRealAuthor = () => {
    const { certification } = userInfo;
    if (certification !== '1') {
      modalObject = Modal.alert('温馨提示', '您尚未实名认证,是否实名认证?', [
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

  const getAvailableDaysText = (availableDays: number) => {
    const { packageType } = getUserInfo();

    if (packageType === '2') {
      // 按次套餐
      return `剩余${availableDays}天`;
    }
    if (availableDays > 0) {
      return `剩余${availableDays}天`;
    }

    return '您的套餐已过期';
  };

  const renderToMyOrderView = () => {
    if (driverType === '0' || driverType === '1') {
      return (
        <div className={styles.box}>
          <div className={styles.cellContainer}>
            <div className={styles.leftContainer}>
              <img src={IconMyWallet} />
              <span>租金</span>
            </div>
            <div
              className={`${styles.rightContaier} ${styles.rightItem}`}
              onClick={() => {
                router.push({
                  pathname: '/myOrder',
                });
              }}
            >
              退费
            </div>
          </div>
        </div>
      );
    }
  };

  const renderDepositView = () => {
    const {
      ifPayDeposit,
      depositType,
      deptId,
      packageId,
      deviceClassify,
      certification,
    } = userInfo;
    if (driverType === '0' || driverType === '2') {
      //
      if (ifPayDeposit === '0') {
        // 未缴纳押金
        return (
          <div className={styles.cellContainer}>
            <div className={styles.leftContainer}>
              <img src={IconMyYajin} />
              <span>押金</span>
            </div>
            <div
              className={`${styles.rightContaier} ${styles.rightItemPay}`}
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
                } else {
                  router.push({
                    pathname: '/myWallet/depositType',
                    query: {
                      packageId,
                      ...userInfo,
                    },
                  });
                }
              }}
            >
              缴费
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
                <img src={IconMyYajin} />
                <span>押金</span>
              </div>
              <div
                className={`${styles.rightContaier} ${styles.rightItem}`}
                onClick={() => {
                  getRefundStatusConfirmRequest({
                    refundType: '1',
                    callback: e => {
                      modalObject = e;
                    },
                    ok: () => {
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
                  });
                }}
              >
                解绑
              </div>
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
                <img src={IconMyYajin} />
                <span>押金</span>
              </div>
              <div
                className={`${styles.rightContaier} ${styles.rightItem}`}
                onClick={() => {
                  getRefundStatusConfirmRequest({
                    refundType: '1',
                    callback: e => {
                      modalObject = e;
                    },
                    ok: statusCode => {
                      if (statusCode === '04') {
                        router.push({
                          pathname: '/myWallet/applyRefundList',
                        });
                      } else if (deviceClassify === '0') {
                        router.push({
                          pathname: '/myWallet/applyRefund',
                        });
                      } else {
                        getUserRefundFee({
                          refundType: '1',
                          userId: driverId,
                        }).then(response => {
                          if (response.resultCode === '000') {
                            refundTypeReq(response.resultObject.refundMethod, {
                              deptId,
                              refundType: response.resultObject.refundType || '1',
                              userId: driverId,
                              cityCode: cityId,
                              provinceCode: provinceId,
                              refundFee: response.resultObject.refundFee,
                              outTradeNo: response.resultObject.outTradeNo,
                            });
                          }
                        });
                      }
                    },
                  });
                  // modalObject = Modal.alert(
                  //   '温馨提示',
                  //   '直接退押金后，套餐将不可使用。如需退服务费，请先退还服务费，再退还押金。',
                  //   [
                  //     {
                  //       text: '取消',
                  //       onPress: () => {},
                  //     },
                  //     {
                  //       text: '确定',
                  //       onPress: () => {
                  //         // 退款
                  // getUserRefundFee({
                  //   refundType: '1',
                  //   userId: driverId,
                  // }).then(response => {
                  //   if (response.resultCode === '000') {
                  //     refundTypeReq(response.resultObject.refundMethod, {
                  //       deptId,
                  //       refundType: '1',
                  //       userId: driverId,
                  //       cityCode: cityId,
                  //       provinceCode: provinceId,
                  //       refundFee: response.resultObject.refundFee,
                  //       outTradeNo: response.resultObject.outTradeNo,
                  //     });
                  //   }
                  // });
                  //       },
                  //     },
                  //   ],
                  // );
                }}
              >
                退押金
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.cellContainer}>
          <div className={styles.leftContainer}>
            <img src={IconMyYajin} />
            <span>押金</span>
          </div>
          <div
            className={`${styles.rightContaier} ${styles.rightItemPay}`}
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
              } else {
                router.push({
                  pathname: '/myWallet/depositType',
                  query: {
                    packageId,
                    ...userInfo,
                  },
                });
              }
            }}
          >
            缴费
          </div>
        </div>
      );
    }
  };

  const renderHeaderView = () => {
    const { packageId, availableDays, packageName, ifPayDeposit } = userInfo;
    let title = '未购买套餐';
    let subTitle = '购买包月套餐最多省2900元';
    if (driverType === '2') {
      title = '租金担保用户';
      // subTitle = '不需要购买套餐';
      subTitle = availableDays ? getAvailableDaysText(availableDays) : '不需要购买套餐';
    } else if (driverType === '3') {
      title = '全额担保用户';
      // subTitle = '不需要缴纳押金，不需要购买套餐';
      subTitle = availableDays
        ? getAvailableDaysText(availableDays)
        : '不需要缴纳押金，不需要购买套餐';
    } else {
      title = packageName ? packageName : title;
      subTitle = availableDays > 0 ? getAvailableDaysText(availableDays) : subTitle;
    }
    if (!packageId) {
      return (
        <div className={styles.bannerTop}>
          <div className={styles.packageName}>{title}</div>
          <div className={styles.subTitle}>{subTitle}</div>
          {((ifPayDeposit === '1' && driverType !== '2' && driverType !== '3') ||
            driverType === '1') && (
            <div
              className={styles.buyBtn}
              onClick={() => {
                pushToRealAuthor();
              }}
            >
              购买套餐
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={styles.bannerTop}>
        <div className={styles.packageName}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>

        {((ifPayDeposit === '1' && driverType !== '2' && driverType !== '3') ||
          driverType === '1') && (
          <div
            className={styles.buyBtn}
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
            续租
          </div>
        )}
      </div>
    );
  };

  const renderTipsView = () => (
    <div className={styles.tipsView}>
      <div className={styles.tipsTitle}>
        退费说明
        <span>?</span>
      </div>
      <div className={styles.tipsContent}>
        1.退费流程：如果您购买的是可退租金的套餐，请先退租金，再退押金；如果您购买的是不可退租金的套餐，须待套餐到期或使用完毕后，方可退押金。
        <br />
        2.费用退还将原路退回，预计1-7个工作日退回至您的账户，具体到账以银行通知为准。
      </div>
    </div>
  );

  const renderCouponView = () => (
    <div
      className={styles.cellContainer}
      onClick={() => {
        router.push({
          pathname: '/couponsView',
        });
      }}
    >
      <div className={styles.leftContainer}>
        <img src={IconCoupon} style={{ width: '0.4rem', height: '0.4rem' }} />
        <span>优惠券</span>
      </div>
      <div className={styles.arrowRight}>
        <img src={IconArrowright} alt="" />
      </div>
    </div>
  );

  const renderMyPoints = () => (
    <div
      className={styles.cellContainer}
      onClick={() => {
        router.push({
          pathname: '/myWallet/myPoints',
        });
      }}
    >
      <div className={styles.leftContainer}>
        <img src={IconCoupon} style={{ width: '0.4rem', height: '0.4rem' }} />
        <span>积分</span>
      </div>
      <div className={styles.arrowRight}>
        <img src={IconArrowright} alt="" />
      </div>
    </div>
  );

  return (
    <div className={styles.center}>
      {renderHeaderView()}
      {renderDepositView()}
      {renderToMyOrderView()}
      {renderCouponView()}
      {renderMyPoints()}
      {renderTipsView()}
    </div>
  );

  // return (
  //   <div className={styles.center}>
  //     <div className={styles.cardContainer}>
  //       {renderPackageView()}
  //       {renderToMyOrderView()}
  //       <div className={styles.box}>{renderDepositView()}</div>
  //       {/* <div className={styles.mainContentContainer}>
  //       </div> */}
  //       <div
  //         className={styles.lineContainer}
  //         onClick={() => {
  //           router.push({
  //             pathname: '/couponsView',
  //           });
  //         }}
  //       >
  //         <div>优惠券</div>
  //         <img src={ArrowRightIcon} />
  //       </div>

  //       <div className={styles.lineContainer} onClick={toTradingDetail}>
  //         <div>交易明细</div>
  //         <img src={ArrowRightIcon} />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default connect(
  ({ myWallet, login }: { myWallet: MyWalletModelState; login: LoginModelState }) => ({
    myWallet,
    login,
  }),
)(MyWalletPage);

import React, { FC, useEffect, useState } from 'react';
import { PackageListModelState, ConnectProps, connect, router, history } from 'alita';
import AlertAction from '@/components/AlertAction';
import PayTypePopView from '@/components/PayTypePopView';
import EmptyPage from '@/components/EmptyPage';
import { Toast, Modal, Button } from 'antd-mobile';
import { openAntFi, pay, commonFunc } from '@/utils/cordovapluigs';
import IconWxApp from '@/assets/images/wxapp.png';
import IconAliApp from '@/assets/images/aliapp.png';
import IconMyWalletEle from '@/assets/images/mywallet-ele.png';
import IconElemobile from '@/assets/images/elemobile.png';
import {
  aliPayForSign,
  unifiedOrder,
  fundPreFreeze,
  aliRefund,
  wxRefund,
  reFundPreFreeze,
  getUserRefundFee,
} from '@/services/netRequest';

import styles from './index.less';
import { getLoginInfo, getUserInfo } from '@/utils';

interface PageProps extends ConnectProps {
  packageList: PackageListModelState;
}

const PackageListPage: FC<PageProps> = ({ packageList, dispatch, location }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPayPop, setShowPayPop] = useState(false);
  const [canPayType, setCanPayType] = useState(true); // 0,当前买M送N套餐  1、首次购买套餐   2、已有套餐
  const [payType, setPayType] = useState('ali');
  const [showFreeBtn, setShowFreeBtn] = useState(true);
  const [payDeposits, setPayDeposits] = useState(
    getUserInfo().ifPayDeposit === '1' ? '(月租费缴费)' : '(押金缴费)',
  );
  const {
    phoneNumber,
    driverId,
    cityId,
    provinceId,
    packageId,
    depositType,
    deptId,
    availableDays,
    packageType,
    ifPayDeposit,
    deviceClassify,
    orgType,
    orgId,
    driverType,
    optionalPackage,
  } = getUserInfo();
  const { packageArray = [], selectOffer = {}, selectIndex } = packageList;
  // const { packageId, depositType, deptId } = location.query;
  const [showContent, setShowContent] = useState(packageArray.length);

  const getCanPay = (id: string) => {
    // 只要缴纳了押金的所有套餐都可以购买，不做限制
    setCanPayType(true);
    //  如果没套餐可以直接付款
    /* if (!packageId) {
      setCanPayType(true);
      return;
    }

    // 如果原套餐packageId和选择套餐相同 可以支付
    if (packageId === id) {
      setCanPayType(true);
      return;
    }
    //  如果是车电一体 并且没到期 不可使用
    if (packageType === '3' && availableDays >= 0) {
      setCanPayType(false);
      return;
    }

    //  其他情况不可支付
    setCanPayType(false); */
  };

  useEffect(() => {
    setShowContent(packageArray.length);
  }, [packageArray]);
  // 这里发起了初始化请求
  useEffect(() => {
    /**
     * 买M送N套餐，不可续费。
     * 当前套餐有效期结束后，如果该套餐仍可用，用户可续费一次；
     * 如果该套餐已停用，用户不可续费。
     * 如需使用其他套餐，可退押金后再购买新套餐，并根据新套餐缴纳押金和服务费。
     */
    // if (packageId === '901056') {
    //   setCanPayType('0');
    // } else if (!packageId) {
    //   setCanPayType('1');
    // } else {
    //   setCanPayType('2');
    // }

    // getCanPay(packageId);
    // if (packageArray.length === 0) {

    dispatch!({
      type: 'packageList/getPckageConfigList',
      payload: {
        cityCode: cityId,
        packageID: packageId || '',
        deviceClassify: deviceClassify || '',
        orgType: orgType || '0',
        orgId: orgId || '',
        driverType: driverType || '0',
        userId: driverId,
        optionalPackage,
        callback: (id, index) => {
          console.log(index);
          getCanPay(id);
        },
      },
    });
    // }
    dispatch!({
      type: 'personalNews/query',
      payload: {
        userId: getLoginInfo().driverId,
        callback() {
          setPayDeposits(getUserInfo().ifPayDeposit === '1' ? '(月租费缴费)' : '(押金缴费)');
        },
      },
    });
    dispatch!({
      type: 'index/getAllSysAreaInfo',
      payload: {
        cityId,
        callback: res => {
          if (res && res.ifPermitFree === '1') {
            setShowFreeBtn(true);
          } else {
            setShowFreeBtn(false);
          }
        },
      },
    });

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  const fundPreFreezeReq = () => {
    fundPreFreeze({
      packageId: selectOffer.packageId,
      userId: driverId,
      userPhone: phoneNumber,
      cityCode: cityId,
      deptId,
      provinceCode: provinceId,
    })
      .then(res => {
        const { resultCode, resultObject, resultMsg } = res;
        if (resultCode === '000') {
          // console.log(resultObject);
          openAntFi(
            {
              orderString: resultObject,
            },
            () => {
              setPayDeposits('月租费缴费');
              setShowPayPop(true);
              // setShowPayPop(true);
              // dispatch!({
              //   type: 'login/selectUserInfo',
              //   payload: {
              //     driverId,
              //     callback() {
              //       // router.goBack();

              //     },
              //   },
              // });
            },
            () => {
              Modal.alert(
                '免押失败',
                '支付宝免押失败,请缴纳押金',
                [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定',
                    onPress: () => {
                      router.push({
                        pathname: '/myWallet/deposit',
                        query: {
                          ...selectOffer,
                        },
                      });
                    },
                  },
                ],
                'iOS',
              );
            },
          );
        } else {
          Toast.info(resultMsg);
        }
      })
      .catch(err => {});
  };

  // 跳转缴纳押金页面
  const pushToDeposit = () => {
    router.push({
      pathname: '/myWallet/deposit',
      query: {
        ...selectOffer,
        payType,
      },
    });
  };

  //  退押金
  const refundTypeReq = (refundMethod: string, options: any) => {
    if (refundMethod === '02') {
      // 支付宝退款
      aliRefund({
        refundMethod,
        ...options,
      }).then(res => {
        const { resultMsg, resultCode } = res;
        if (resultCode === '000') {
          Toast.success(resultMsg);
        }
      });
    }

    if (refundMethod === '03') {
      // 微信退款
      wxRefund({
        refundMethod,
        ...options,
      }).then(res => {
        const { resultMsg, resultCode } = res;
        if (resultCode === '000') {
          Toast.success(resultMsg);
        }
      });
    }
  };

  // 套餐支付宝预授权线上资金重新授权冻结接口
  const reFundPreFreezeReq = () => {
    reFundPreFreeze({
      packageId: selectOffer.packageId,
      userId: driverId,
      userPhone: phoneNumber,
      cityCode: cityId,
      deptId,
      provinceCode: provinceId,
    })
      .then(res => {
        const { resultCode, resultObject, resultMsg } = res;
        if (resultCode === '000') {
          // console.log(resultObject);
          openAntFi(
            {
              orderString: resultObject,
            },
            () => {
              setPayDeposits('月租费缴费');
              setShowPayPop(true);
              // dispatch!({
              //   type: 'login/selectUserInfo',
              //   payload: {
              //     driverId,
              //     callback() {
              //       // router.goBack();
              //       setShowPayPop(true);
              //     },
              //   },
              // });
            },
            () => {
              Modal.alert(
                '免押失败',
                '支付宝免押失败,请缴纳押金',
                [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定',
                    onPress: () => {
                      router.push({
                        pathname: '/myWallet/deposit',
                        query: {
                          ...selectOffer,
                        },
                      });
                    },
                  },
                ],
                'iOS',
              );
            },
          );
        } else {
          Toast.info(resultMsg);
        }
      })
      .catch(err => {});
  };

  //  预支付逻辑
  const rePayFunc = (res: any, callback = any => {}) => {
    const { resultCode, resultObject, resultMsg } = res;
    const { packageName } = getUserInfo();
    if (resultCode === '000') {
      if (resultObject.isDeposit === '1') {
        // 已经缴纳套餐押金或者芝麻信用资金冻结免押
        callback(resultObject);
      } else if (resultObject.isDeposit === '2') {
        // 未缴纳押金 需要去缴纳押金 或者芝麻信用资金冻结免押
        // pushToDeposit();
        setShowModal(true);
      } else if (resultObject.isDeposit === '3') {
        // 已微信或者支付宝缴纳押金 需要去押金退费
        // 1、 先判断押金类型
        // 1、 调用getUserRefundFee接口查询押金情况
        // 2、 根据 押金方式调用退款接口aliRefund/wxRefund
        // 3、 押金退款完成后，自动弹出押金支付方式。setShowModal(true);
        // getUserRefundFee({}).then

        // 已购买Xx套餐，如果需要更换套餐，请去Xx退款，审核通过后可更换套餐
        Toast.info(resultMsg);

        // getUserRefundFee({
        //   refundType: '1',
        //   userId: driverId,
        // })
        //   .then(response => {
        //     // const { resultCode, resultObject } = res;
        //     if (response.resultCode === '000') {
        //       const object = response.resultObject;
        //       refundTypeReq(object.refundMethod, {
        //         deptId,
        //         refundType: '1',
        //         userId: driverId,
        //         // refundFee: '0.1',
        //       });
        //     }
        //   })
        //   .catch(err => {});
      } else if (resultObject.isDeposit === '4') {
        // 已芝麻信用资金冻结免押  需要重新授权

        Modal.alert(
          '温馨提示',
          resultMsg,
          [
            {
              text: '取消',
            },
            {
              text: '确定',
              onPress: () => {
                reFundPreFreezeReq();
              },
            },
          ],
          'iOS',
        );
      }
    }
  };

  // 阿里支付服务费
  const aliPaySignReq = () => {
    const totalFee = getUserInfo().ifPayDeposit === '1' && selectOffer.id === packageId
    ? selectOffer.leaseRent
    : parseFloat(selectOffer.leaseRent) + parseFloat(selectOffer.cashPledge);
    aliPayForSign({
      cityCode: cityId,
      deptId,
      packageId: selectOffer.packageId,
      payClassify: selectOffer.deviceClassify,
      payMethod: '02',
      payType: '2',
      provinceCode: provinceId,
      userId: driverId,
      userPhone: phoneNumber,
      totalFee,
    })
      .then(res => {
        rePayFunc(res, resultObject => {
          pay(
            {
              type: 'AliPay',
              orderString: resultObject.alipPrePayString,
            },
            () => {
              Toast.success('套餐购买成功');
              setTimeout(() => {
                dispatch!({
                  type: 'personalNews/query',
                  payload: {
                    userId: driverId,
                    callback: () => {
                      router.goBack();
                    },
                  },
                });
              }, 1000);
            },
            () => {
              Toast.fail('套餐购买失败');
            },
          );
        });
      })
      .catch(err => {
        Toast.info('订单生成失败');
      });
  };

  // 微信支付服务费
  const wxPaySignReq = () => {
    const totalFee = getUserInfo().ifPayDeposit === '1' && selectOffer.id === packageId
    ? selectOffer.leaseRent
    : parseFloat(selectOffer.leaseRent) + parseFloat(selectOffer.cashPledge);
    unifiedOrder({
      cityCode: cityId,
      deptId,
      provinceCode: provinceId,
      packageId: selectOffer.packageId,
      payClassify: selectOffer.deviceClassify,
      payMethod: '03',
      payType: '2',
      userId: driverId,
      userPhone: phoneNumber,
      totalFee,
    })
      .then(res => {
        rePayFunc(res, item => {
          const resultObject = item.wxPayAppOrderResult;
          pay(
            {
              type: 'Wechat',
              orderString: JSON.stringify({
                appid: resultObject.appId,
                partnerId: resultObject.partnerId,
                nonceStr: resultObject.nonceStr,
                sign: resultObject.sign,
                prepayId: resultObject.prepayId,
                timeStamp: resultObject.timeStamp,
              }),
            },
            () => {
              Toast.success('套餐购买成功');

              setTimeout(() => {
                dispatch!({
                  type: 'personalNews/query',
                  payload: {
                    userId: driverId,
                    callback: () => {
                      router.goBack();
                    },
                  },
                });
                // router.goBack();
              }, 1000);
            },
            () => {
              Toast.fail('套餐购买失败');
            },
          );
        });
      })
      .catch(err => {
        Toast.fail(err);
      });
  };

  const getOfferDetail = () => {
    // （1 按月套餐 2 按次套餐 3买M送N套餐 4车电一体套餐）
    const { packageType } = selectOffer;
    if (packageType === '1') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '折扣比率',
          value: `${selectOffer.discountRatio}%`,
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
        },
      ];
    }
    if (packageType === '2') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '有效期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '换电次数',
          value: `${selectOffer.exchangeNum}次`,
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
        },
      ];
    }
    if (packageType === '3') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: selectOffer.leaseDate,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '赠送时长',
          value: `${selectOffer.handselDuration}天`,
        },
        {
          label: '套餐备注',
          value: `买${selectOffer.leaseDate}天送${selectOffer.handselDuration}天套餐`, // selectOffer.packageRemark,
        },
      ];
    }
    if (packageType === '4') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
        },
      ];
    }
    return [];
  };

  const getOfferTitle = res => {
    // （1 按月套餐 2 按次套餐 3买M送N套餐 4车电一体套餐）
    const { packageType } = res;
    switch (packageType) {
      case '1':
        return '按月套餐';
      case '2': // 按照次数
        return '按次套餐';
      case '3':
        return '买M送N套餐';
      case '4':
        return '车电一体套餐';
      default:
        break;
    }
  };

  return showContent ? (
    <div className={styles.packageList}>
      <div className={styles.packageContent}>
        {packageArray.map(
          (res: { id: string | number | undefined; leaseRent: React.ReactNode }, index: number) => (
            <div
              key={res.id}
              onClick={() => {
                getCanPay(packageArray[index].id);
                dispatch!({
                  type: 'packageList/getPckageDetail',
                  payload: {
                    cityCode: packageArray[index].cityCode,
                    packageID: packageArray[index].id,
                    callback: offer => {},
                  },
                });
                dispatch!({
                  type: 'packageList/save',
                  payload: {
                    selectIndex: index,
                  },
                });
              }}
              className={`${styles.packageItem} ${selectIndex === index && styles.active}`}
            >
              <div className={styles.header}> {res.packageName}</div>
              <div className={styles.packageBd}>
                <div className={styles.packageLeftIcon}>
                  <img hidden={res.packageType === '4'} src={IconMyWalletEle} alt="" />
                  <img hidden={res.packageType !== '4'} src={IconElemobile} alt="" />
                </div>
                <div className={styles.eleInfo}>
                  {/* <div>押金:{res.cashPledge}</div> */}
                  <div>
                    月租费:{res.leaseRent}({res.isRefundRent === '1' ? '可退' : '不可退'})
                  </div>
                  <div>换电:{res.packageType === '2' ? res.exchangeNum + '次' : '不限次数'}</div>
                  <div hidden={res.packageType === '2'}>租期:{res.leaseDate}天</div>
                  <div hidden={res.packageType !== '2'}>有效期:{res.leaseDate}天</div>
                </div>
                <div className={styles.price}>
                  ¥
                  <span>
                    {getUserInfo().ifPayDeposit === '1' && res.id === packageId
                      ? res.leaseRent
                      : parseFloat(res.leaseRent)}
                  </span>
                </div>
              </div>
            </div>
          ),
        )}

        {/* <div className={styles.packageTitle}>{selectOffer.packageName}</div>
        <div className={styles.packageSubTitle}>{selectOffer.packageRemark}</div> */}
        {/* <div className={styles.packageView}>
          <div style={{ whiteSpace: 'nowrap', width: 'auto' }}> */}
        {/* {packageArray.map(
              (
                res: { id: string | number | undefined; leaseRent: React.ReactNode },
                index: number,
              ) => (
                <div
                  onClick={() => {
                    getCanPay(packageArray[index].id);
                    dispatch!({
                      type: 'packageList/getPckageDetail',
                      payload: {
                        cityCode: packageArray[index].cityCode,
                        packageID: packageArray[index].id,
                        callback: offer => {},
                      },
                    });
                    dispatch!({
                      type: 'packageList/save',
                      payload: {
                        selectIndex: index,
                        // selectOffer: packageArray[index],
                      },
                    });
                  }}
                  key={res.id}
                  className={`${styles.packageInfo} ${selectIndex === index && styles.active}`}
                >
                  <div className={styles.packageInfoWrapper}>
                    <div className={styles.packageInfoHd}>{getOfferTitle(res)}</div>
                    <div className={styles.packageInfoBd}>
                      ¥<span>{res.leaseRent}</span>
                    </div>
                  </div>
                </div>
              ),
            )} */}

        {/* </div>
        </div> */}
        {/* <div className={styles.packageTips}>
          <div className={styles.packageDes}>
            {getOfferDetail().map((res, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className={styles.desW}>
                  <div className={styles.label}>{res.label}:</div>
                  <div className={styles.value}>{res.value}</div>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
      <div className={styles.packageFooter}>
        <div className={styles.price}>
          <span>￥</span>
          <span className={styles.priceNum}>
            {getUserInfo().ifPayDeposit === '1' && selectOffer.id === packageId
              ? selectOffer.leaseRent
              : parseFloat(selectOffer.leaseRent)}
          </span>
        </div>
        <Button
          disabled={!canPayType}
          className={styles.payBtn}
          onClick={() => {
            if (selectOffer.isRefundRent !== '1') {
              Modal.alert(
                '提示',
                '该套餐不可退费，购买后可能会影响您其他套餐退费，请确认是否继续？',
                [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定',
                    onPress: () => {
                      setPayDeposits('(月租费缴费)');
                      if (getUserInfo().ifPayDeposit === '1' || getUserInfo().driverType === '1') {
                        setShowPayPop(true);
                      }
                    },
                  },
                ],
                'iOS',
              );
            } else {
              setPayDeposits('(月租费缴费)');
              if (getUserInfo().ifPayDeposit === '1' || getUserInfo().driverType === '1') {
                setShowPayPop(true);
              }
            }

            // 0,当前买M送N套餐  1、首次购买套餐   2、已有套餐
            // if (canPayType === '0') {
            //   Toast.info('当前套餐有效期结束后，才能续费');
            // } else if (canPayType === '1') {
            //   setShowPayPop(true);
            // } else if (canPayType === '2') {
            //   if (selectOffer.packageId === packageId) {
            //     setShowPayPop(true);
            //   } else {
            //     Toast.info('当前套餐有效期结束后，才能续费');
            //   }
            // }

            // setShowPayPop(true);

            // if (canPay) {
            //   setShowPayPop(true);
            // } else {
            //   Toast.info('当前套餐有效期结束后，才能续费');
            // }
          }}
        >
          立即支付
        </Button>
      </div>
      <AlertAction
        visiable={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        list={
          showFreeBtn
            ? [
                {
                  key: '01',
                  title: '授权免押',
                  onClick: () => {
                    fundPreFreezeReq();
                  },
                },
                {
                  key: '02',
                  title: '缴纳押金',
                  onClick: () => {
                    //
                    // fundPreFreezeReq();
                    pushToDeposit();
                    // router.push({
                    //   pathname: '/myWallet/deposit',
                    //   query: {
                    //     ...selectOffer,
                    //     payType,
                    //   },
                    // });
                  },
                },
              ]
            : [
                {
                  key: '02',
                  title: '缴纳押金',
                  onClick: () => {
                    pushToDeposit();
                  },
                },
              ]
        }
      />
      <PayTypePopView
        visiable={showPayPop}
        onOk={key => {
          setPayType(key);
          if (key === 'ali') {
            // reFundPreFreezeReq();
            // fundPreFreezeReq();

            // pushToDeposit();
            aliPaySignReq();
          }
          if (key === 'wx') {
            wxPaySignReq();
          }
        }}
        amount={selectOffer.leaseRent}
        feeType={payDeposits}
        onClose={() => setShowPayPop(false)}
        payTypes={[
          {
            icon: IconAliApp,
            text: '支付宝',
            key: 'ali',
          },
          {
            icon: IconWxApp,
            text: '微信',
            key: 'wx',
          },
        ]}
      />
    </div>
  ) : (
    <EmptyPage title="暂无数据" />
  );
};

export default connect(({ packageList }: { packageList: PackageListModelState }) => ({
  packageList,
}))(PackageListPage);

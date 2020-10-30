import React, { FC, useEffect, useState } from 'react';
import { MyOrderModelState, ConnectProps, connect, history } from 'alita';
import { Toast } from 'antd-mobile';
import { getLoginInfo, getUserInfo } from '@/utils';
import { MyOrderCell } from './components/myOrderCell';
import { commonFunc } from '@/utils/cordovapluigs';
import styles from './index.less';
import EmptyPage from '@/components/EmptyPage';
import {
  getUserRefundFee,
  aliRefund,
  wxRefund,
  aliPayForSign,
  unifiedOrder,
} from '@/services/netRequest';
import { aliPayMethod, wxPayMethod, getRefundStatusConfirmRequest } from '@/utils/payUtils';

let modalObject = null;

interface PageProps extends ConnectProps {
  myOrder: MyOrderModelState;
}

const MyOrderPage: FC<PageProps> = ({ myOrder, dispatch }) => {
  const [firstLoading, setFirstLoading] = useState(true);
  const { cityId, deptId, provinceId, driverId, phoneNumber } = getUserInfo();
  const getOrderInfoList = (isRefund: boolean, text?: string) => {
    dispatch!({
      type: 'myOrder/getOrderInfoList',
      payload: {
        driverId: getLoginInfo().driverId,
        callback: () => {
          if (isRefund) {
            Toast.success(text);
          }
        },
      },
    });
  };

  //  重新支付
  const onRePayClick = (res: any) => {
    const { orderId, payMetnod, packageId } = res;
    if (payMetnod === '02') {
      //  支付宝
      aliPayMethod({
        data: {
          cityCode: cityId,
          deptId,
          outTradeNo: orderId,
          packageId,
          payClassify: '1',
          payMethod: '02',
          payType: '2',
          provinceCode: provinceId,
          userId: driverId,
          userPhone: phoneNumber,
        },
        success: () => {
          Toast.success('套餐购买成功!');
        },

        fail: () => {
          Toast.fail('套餐购买失败');
        },
      });
    }

    if (payMetnod === '03') {
      // 微信支付
      wxPayMethod({
        data: {
          cityCode: cityId,
          deptId,
          outTradeNo: orderId,
          packageId,
          payClassify: '1',
          payMethod: '02',
          payType: '2',
          provinceCode: provinceId,
          // "totalFee": "58.20",
          userId: driverId,
          userPhone: phoneNumber,
        },
        success: () => {
          // Toast.success('套餐购买成功!');
          getOrderInfoList(true, '套餐购买成功');
        },
        fail: () => {
          Toast.fail('套餐购买失败');
        },
      });
    }
  };

  const onRefundClick = (res: { orderId: any }) => {
    const { driverId, deptId, cityId, provinceId } = getLoginInfo();
    // getRefundStatusConfirmRequest({

    getRefundStatusConfirmRequest({
      refundType: '2',
      callback: e => {
        modalObject = e;
      },
      ok: () => {
        getUserRefundFee({
          outTradeNo: res.orderId,
          refundType: '2', // 退款类型（1押金退款 2服务费退款 3车电一体退款 暂不支持车电一体类型退款）
          userId: driverId,
        }).then(req => {
          const {
            resultObject: { refundMethod, refundFee, outTradeNo },
          } = req;
          if (refundMethod === '02') {
            // 支付宝退款
            aliRefund({
              deptId,
              outTradeNo,
              refundFee,
              refundMethod,
              refundType: '2',
              userId: driverId,
              cityCode: cityId,
              provinceCode: provinceId,
            })
              .then(resKey => {
                if (resKey.resultCode === '000') {
                  getOrderInfoList(true, resKey.resultMsg);
                  commonFunc({
                    method: 'notificationNative',
                    params: {
                      key: 'updateUser',
                    },
                  });
                } else {
                  Toast.fail(resKey.resultMsg);
                }
              })
              .catch(err => {
                Toast.fail(err);
              });
          }
          if (refundMethod === '03') {
            // 微信退款
            wxRefund({
              deptId,
              outTradeNo,
              refundFee,
              refundMethod,
              refundType: '2',
              userId: driverId,
              cityCode: cityId,
              provinceCode: provinceId,
            })
              .then(resKey => {
                if (resKey.resultCode === '000') {
                  getOrderInfoList(true, resKey.resultMsg);
                  commonFunc({
                    method: 'notificationNative',
                    params: {
                      key: 'updateUser',
                    },
                  });
                } else {
                  Toast.fail(resKey.resultMsg);
                }
              })
              .catch(err => {
                Toast.fail(err);
              });
          }
        });
      },
    });
  };
  // 这里发起了初始化请求
  useEffect(() => {
    getOrderInfoList(false);

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      if (modalObject) {
        modalObject.close();
      }
    };
  }, []);

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { orderList } = myOrder;

  const renderContent = () => {
    if (firstLoading) {
      setFirstLoading(false);
      return '';
    }
    if (orderList.length === 0) {
      return <EmptyPage title="暂无数据" />;
    }

    return orderList.map((res: any) => (
      <MyOrderCell
        key={res.orderId}
        item={res}
        onClick={type => {
          if (type === '1') {
            history.push({
              pathname: '/couponsDetail',
              query: {
                orderId: res.id,
              },
            });
          } else {
            history.push({
              pathname: '/myOrder/myOrderDetail',
              query: {
                packageId: res.packageId,
                cityId: res.cityId,
                expireTime: res.expireTime,
                startTime: res.startTime,
              },
            });
          }
        }}
        onRefundClick={() => {
          onRefundClick(res);
        }}
        onRePayClick={() => {
          // 重新付款
          onRePayClick(res);
        }}
      />
    ));
  };

  return <div className={styles.orderList}>{renderContent()}</div>;
};

export default connect(({ myOrder }: { myOrder: MyOrderModelState }) => ({ myOrder }))(MyOrderPage);

import React, { FC, useEffect, useState } from 'react';
import { ApplyRefundListModelState, ConnectProps, connect, history, router } from 'alita';
import { getLoginInfo } from '@/utils';
import { ApplyRefundCell } from './components/applyRefundCell';
import EmptyPage from '@/components/EmptyPage';
import { Toast } from 'antd-mobile';
import {
  aliRefund,
  wxRefund,
  fundPreUnFreeze,
  selectUserAuthPaymentRecord,
  getUserRefundFee,
  getRefundStatusConfirm,
} from '@/services/netRequest';
import { aliPayMethod, wxPayMethod, getRefundStatusConfirmRequest } from '@/utils/payUtils';
import styles from './index.less';

let modalObject = null;

interface PageProps extends ConnectProps {
  applyRefundList: ApplyRefundListModelState;
}

const ApplyRefundListPage: FC<PageProps> = ({ applyRefundList, dispatch }) => {
  
  const { driverId, deptId, cityId, provinceId } = getLoginInfo();
  const [firstLoading, setFirstLoading] = useState(true);
  
  const getApplyRefundList = () => {
    dispatch!({
      type: 'applyRefundList/getApplyRefundList',
      payload: {
        driverId: getLoginInfo().driverId,
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
        if (resultCode === '000' || resultCode === '2' || resultCode === '3') {
          Toast.success(resultMsg);
          setTimeout(() => {
            router.goBack();
          },1000);
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
        if (resultCode === '000' || resultCode === '2' || resultCode === '3') {
          Toast.success(resultMsg);
          setTimeout(() => {
            router.goBack();
          },1000);
        }
      });
    }
  };

  const onRefundClick = (infoDetail) => {
    refundTypeReq(infoDetail.refundMethod, {
      deptId,
      refundType: infoDetail.refundType || '1',
      userId: driverId,
      cityCode: cityId,
      provinceCode: provinceId,
      refundFee: infoDetail.actualRefundFee,
      outTradeNo: infoDetail.orderId,
    });
  };

  /* const onRefundClick = (infoDetail) => {
    // getRefundStatusConfirmRequest({

    getRefundStatusConfirmRequest({
      refundType: '1',
      callback: e => {
        modalObject = e;
      },
      ok: () => {
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
      },
    });
  }; */

  // 这里发起了初始化请求
  useEffect(() => {
    getApplyRefundList();
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      if (modalObject) {
        modalObject.close();
      }
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { refundList } = applyRefundList;
  const renderContent = () => {
    if (firstLoading) {
      setFirstLoading(false);
      return '';
    }
    if (refundList.length === 0) {
      return <EmptyPage title="暂无数据" />;
    }

    return refundList.map((res: any) => (
      <ApplyRefundCell
        key={res.id}
        item={res}
        onClick={() => {
          history.push({
            pathname: '/myWallet/applyRefundList/applyRefundDetail',
            query: {
              refundId: res.refundId,
            },
          });
        }}
        onRefundClick={() => {
          onRefundClick(res);
        }}
      />
    ));
  };
  return <div className={styles.orderList}>{renderContent()}</div>;
};

export default connect(({ applyRefundList }:{ applyRefundList: ApplyRefundListModelState; }) => ({ applyRefundList }))(ApplyRefundListPage);

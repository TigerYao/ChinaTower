import React, { FC, useEffect } from 'react';
import { CouponsDetailModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';
import { getUserInfo } from '@/utils';

interface PageProps extends ConnectProps {
  couponsDetail: CouponsDetailModelState;
}

const CouponsDetailPage: FC<PageProps> = ({ couponsDetail, dispatch, location }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'couponsDetail/getCouponInfoByOrderId',
      payload: {
        // ...location.query,
        orderId: location.query.orderId,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { couponsInfo } = couponsDetail;

  const getOfferDetail = () => {
    // （1 按月套餐 2 按次套餐 3买M送N套餐 4车电一体套餐）
    const type = [
      {
        label: '优惠券名称',
        value: couponsInfo.couponName,
      },
      {
        label: '优惠券类型',
        value: couponsInfo.couponType === '1' ? '赠送天数' : '赠送次数',
      },
    ];

    if (couponsInfo.couponType === '1') {
      type.push({
        label: '优惠天数',
        value: couponsInfo.couponDays,
      });
    } else {
      type.push({
        label: '优惠次数',
        value: couponsInfo.couponTimes,
      });
    }

    type.push({
      label: '生效时间(优惠活动)',
      value: couponsInfo.validTime,
    });

    type.push({
      label: '失效时间(优惠活动)',
      value: couponsInfo.invalidTime,
    });

    return type;
  };

  return (
    <div className={styles.center}>
      {getOfferDetail().map(res => {
        if (res.type === 'vertical') {
          return (
            <div className={styles.cellBox} key={res.value}>
              <div>{res.label}</div>
              <div className={styles.cellContent}>{res.value}</div>
            </div>
          );
        }
        return (
          <div className={styles.cellWrapper} key={res.value}>
            <div>{res.label}</div>
            <div>{res.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default connect(({ couponsDetail }: { couponsDetail: CouponsDetailModelState }) => ({
  couponsDetail,
}))(CouponsDetailPage);

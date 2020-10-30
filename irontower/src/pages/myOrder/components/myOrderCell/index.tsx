import React, { FC } from 'react';
import styles from './index.less';
import { Modal } from 'antd-mobile';
import { packageTypeDict } from '@/utils/constant';

interface MyOrderCellProps {
  item: any;
  onClick: () => void;
  onRefundClick: () => void;
  onRePayClick: () => void;
}

const statusMap = {
  0: '创建',
  1: '成功',
  2: '已退款',
  3: '已失效',
};

//  canRefund 1、可退费；0、不可退费
const MyOrderCell: FC<MyOrderCellProps> = ({
  item,
  onClick = (type: string) => {},
  onRefundClick = () => {},
  onRePayClick = () => {},
}) => (
  <div
    className={styles.myOrderCell}
    onClick={() => {
      onClick(item.orderType);
    }}
  >
    <div style={{ width: 0, flex: 1 }}>
      <div className={styles.title}>
        {item.orderType === '1' ? '优惠券' : packageTypeDict[item.packageType]}
      </div>
      <div>订单号：{item.orderId}</div>
      <div>订单类型：{item.packageName}</div>
      <div>订单状态：{statusMap[item.orderStatus]}</div>
      <div className={styles.startTime}>生效时间：{item.startTime}</div>
      <div className={styles.expireTime}>失效时间：{item.expireTime}</div>
    </div>
    {item.orderStatus === 0 ? (
      <div
        className={styles.refundBtn}
        onClick={e => {
          e.stopPropagation();
          onRePayClick();
        }}
      >
        待支付
      </div>
    ) : (
      ''
    )}
    {item.canRefund === '1' && item.orderStatus === 1 ? (
      <div
        className={styles.refundBtn}
        onClick={e => {
          e.stopPropagation();
          onRefundClick();
          // 退租金后将无法使用换电业务,确定继续?
          // Modal.alert('温馨提示', '退租金后将无法使用换电业务,确定继续?', [
          //   {
          //     text: '取消',
          //   },
          //   {
          //     text: '确定',
          //     onPress: () => {

          //     },
          //   },
          // ]);
        }}
      >
        退款
      </div>
    ) : (
      ''
    )}
  </div>
);

export { MyOrderCell };

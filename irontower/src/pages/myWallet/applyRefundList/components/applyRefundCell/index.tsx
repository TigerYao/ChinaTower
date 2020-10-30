import React, { FC, useEffect } from 'react';
import { ApplyRefundCellModelState, ConnectProps, connect } from 'alita';
import { packageTypeDict, payMethodDict } from '@/utils/constant';
import styles from './index.less';

interface ApplyRefundCellProps {
  item: any;
  key: string,
  onClick: () => void;
  onRefundClick: () => void;
}

//  canRefund 1、可退费；0、不可退费
const ApplyRefundCell: FC<ApplyRefundCellProps> = ({
  item,
  onClick = (type: string) => {},
  onRefundClick = () => {},
}) => (
  <div
    className={styles.applyRefundCell}
    onClick={() => {
      onClick(item.orderType);
    }}
    key={item.id}
  >
    <div style={{ width: 0, flex: 1 }}>
      <div className={styles.title}>
        {item.orderType === '1' ? '优惠券' : packageTypeDict[item.packageType]}
      </div>
      <div>申请单号：{item.refundId}</div>
      <div>申请时间：{item.createTime}</div>
      <div>缴纳押金金额：{item.incomeFee || 0}元</div>
      <div>申请退款金额：{item.refundFee || 0}元</div>
      <div>退款方式：{payMethodDict[item.refundMethod]}</div>
      <div>退款原因：{item.refundReason}</div>
      {
        item.refundStatus !== '0' && item.refundConfirm !== '3' && (
          <div>
            <div>是否全额退款：{item.ifFullRefund === '1' ? '是' : '否'}</div>
            <div>实际退款金额：{item.actualRefundFee || 0}元</div>
          </div>
        )
      }
      {
        item.refundConfirm === '2' && item.ifFullRefund === '0' && (
          <div>
            <div>扣款金额：{item.deductionFee || 0}元</div>
            <div>扣款说明：{item.deductionDesc || '无'}</div>
          </div>
        )
      }
      {
        item.refundStatus !== '0' ? (
          <div>
            <div>审批结果：{item.refundConfirm === '2' ? '通过' : '不通过'}</div>
            <div>退款状态：已完成</div>
            {
              item.refundConfirm === '2' && (<div>退款到账完成日期：{item.refundFinishTime}</div>)
            }
            <div>备注说明：{item.remark }</div>
          </div>
        ) : (
          <div>
            <div>退款状态：处理中</div>
          </div>
        )
      }
    </div>
    {(item.refundConfirm === '2' || item.refundConfirm === '3') && item.refundStatus === '0' ? (
      <div
        className={styles.refundBtn}
        onClick={e => {
          e.stopPropagation();
          onRefundClick();
        }}
      >
        确认
      </div>
    ) : (
      ''
    )}
  </div>
);

export { ApplyRefundCell };

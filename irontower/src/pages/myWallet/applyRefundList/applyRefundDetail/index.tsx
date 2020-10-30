import React, { FC, useEffect } from 'react';
import { ApplyRefundDetailModelState, ConnectProps, connect } from 'alita';
import { payMethodDict } from '@/utils/constant';
import styles from './index.less';

interface PageProps extends ConnectProps {
  applyRefundDetail: ApplyRefundDetailModelState;
}

const ApplyRefundDetailPage: FC<PageProps> = ({ applyRefundDetail, dispatch, location }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'applyRefundDetail/getApplyRefundInfo',
      payload: {
        refundId: location.query.refundId,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { applyRefundInfo } = applyRefundDetail;

  const refundConfirmLabel = (refundConfirm: string) => {
    let resLabel = '未审批';
    switch (refundConfirm) {
      case '2':
        resLabel = '通过';
        break;
      case '3':
        resLabel = '不通过';
        break;
      default:
        resLabel = '未审批';
        break;
    }
    return resLabel;
  };

  const getOfferDetail = () => {
    let objArr = [
      {
        label: '申请单号',
        value: applyRefundInfo.refundId,
        key: 'refundId',
      },
      {
        label: '申请时间',
        value: applyRefundInfo.refundTime,
        key: 'refundTime',
      },
      {
        label: '缴纳押金金额',
        value: `${applyRefundInfo.incomeFee || 0}元`,
        key: 'incomeFee',
      },
      {
        label: '申请退款金额',
        value: `${applyRefundInfo.refundFee || 0}元`,
        key: 'refundFee',
      },
      {
        label: '退款方式',
        value: payMethodDict[applyRefundInfo.refundMethod],
        key: 'refundMethod',
      },
      {
        label: '退款原因',
        value: applyRefundInfo.refundReason,
        key: 'refundReason',
      },
      {
        label: '退款类型',
        value: '车电一体退款',
        key: 'type',
      },
      {
        label: '是否全额退款',
        value: applyRefundInfo.ifFullRefund === '1' ? '是' : '否',
        key: 'ifFullRefund',
      },
      {
        label: '实际退款金额',
        value: `${applyRefundInfo.actualRefundFee || 0}元`,
        key: 'actualRefundFee',
      },
      {
        label: '扣款金额',
        value: `${applyRefundInfo.deductionFee || 0}元`,
        key: 'deductionFee',
      },
      {
        label: '扣款说明',
        value: applyRefundInfo.deductionDesc,
        key: 'deductionDesc',
      },
      {
        label: '审批结果',
        value: refundConfirmLabel(applyRefundInfo.refundConfirm),
        key: 'refundConfirm',
      },
      {
        label: '审批人',
        value: applyRefundInfo.approvedBy,
        key: 'approvedBy',
      },
      {
        label: '审批时间',
        value: applyRefundInfo.approvedTime,
        key: 'approvedTime',
      },
      {
        label: `备注说明：${applyRefundInfo.remark ? applyRefundInfo.remark : ''}`,
        value: '',
        key: 'remark',
      },
      {
        label: '退款状态',
        value: applyRefundInfo.refundStatus !== '0' ? '已完成' : '处理中',
        key: 'refundStatus',
      },
    ];
    // 未审批
    if (applyRefundInfo.refundConfirm === '1') {
      objArr = objArr.filter(
        item =>
          item.key !== 'ifFullRefund' &&
          item.key !== 'actualRefundFee' &&
          item.key !== 'deductionFee' &&
          item.key !== 'deductionDesc' &&
          item.key !== 'approvedBy' &&
          item.key !== 'approvedTime' &&
          item.key !== 'remark',
      );
    } else if (applyRefundInfo.refundConfirm === '2' && applyRefundInfo.ifFullRefund === '1') {
      // 审批全款通过
      objArr = objArr.filter(item => item.key !== 'deductionFee' && item.key !== 'deductionDesc');
    } else if (applyRefundInfo.refundConfirm === '3') {
      // 审批不通过
      objArr = objArr.filter(
        item =>
          item.key !== 'ifFullRefund' &&
          item.key !== 'actualRefundFee' &&
          item.key !== 'deductionFee' &&
          item.key !== 'deductionDesc',
      );
    }
    return objArr;
  };

  return (
    <div className={styles.center}>
      {getOfferDetail().map((res, index) => (
        <div className={styles.cellWrapper} key={index}>
          <div>{res.label}</div>
          <div>{res.value}</div>
        </div>
      ))}
    </div>
  );
};

export default connect(
  ({ applyRefundDetail }: { applyRefundDetail: ApplyRefundDetailModelState }) => ({
    applyRefundDetail,
  }),
)(ApplyRefundDetailPage);

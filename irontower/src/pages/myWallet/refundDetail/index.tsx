import React, { FC, useEffect } from 'react';
import { RefundDetailModelState, ConnectProps, connect } from 'alita';
import { TextareaItem } from "antd-mobile";
import styles from './index.less';

interface PageProps extends ConnectProps {
  refundDetail: RefundDetailModelState;
}

const RefundDetailPage: FC<PageProps> = ({ refundDetail, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'refundDetail/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = refundDetail;
  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.titleLine}>
          <div>申请单编号：TB12322231123</div>
          <div className={styles.status}>审核中</div>
        </div>
        <div className={styles.line}>
          <div>套餐名称</div><div>车电一体化套餐</div>
        </div>
        <div className={styles.line}>
          <div>服务费</div><div>200元</div>
        </div>
        <div className={styles.line}>
          <div>押金</div><div>2000元</div>
        </div>
        <div className={styles.line}>
          <div>扣款金额</div><div>200元</div>
        </div>
        <div className={styles.line}>
          <div>扣款说明</div><div>车子有部分损坏</div>
        </div>
        <div className={styles.detail}>
          <div className={styles.detailTip}>退款说明</div>
          <TextareaItem
            value="我不想用电动车了！"
            rows={5}
            editable={false}
          />
        </div>
        <div className={styles.line}>
          <div>备注</div><div>车子有部分损坏</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.line}>
          <div>用户提交时间</div><div>2020-03-20 12:20</div>
        </div>
        <div className={styles.line}>
          <div>审核时间</div><div>2020-03-20 12:20</div>
        </div>
        <div className={styles.line}>
          <div>审核人</div><div>张凯</div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ refundDetail }:{ refundDetail: RefundDetailModelState; }) => ({ refundDetail }))(RefundDetailPage);

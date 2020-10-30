import React, { FC, useEffect } from 'react';
import { TradingDetailModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';
import { getLoginInfo } from '@/utils';
import { payMethodDict, payTypeDict } from '@/utils/constant';
import EmptyPage from '@/components/EmptyPage';
interface PageProps extends ConnectProps {
  tradingDetail: TradingDetailModelState;
}
const TradingDetailPage: FC<PageProps> = ({ tradingDetail, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    const { driverId } = getLoginInfo();
    dispatch!({
      type: 'tradingDetail/getPaymentInfoList',
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
  const { detailList } = tradingDetail;
  console.log(detailList);
  // const detailList = [
  //   {
  //     orderId: '278772840619',
  //     from: '缴付押金｜支付宝',
  //     money: '-¥999.00',
  //     date: '2020-01-03 11:34:57',
  //   },
  //   {
  //     orderId: '278772840619',
  //     from: '退款｜支付宝',
  //     money: '+¥999.00',
  //     date: '2020-01-03 11:34:57',
  //   },
  //   {
  //     orderId: '278772840619',
  //     from: '单车次卡｜支付宝',
  //     money: '-¥99.00',
  //     date: '2020-01-03 11:34:57',
  //   },
  // ];

  const getPayTypeText = (payType, type) => {
    if (type === 1) {
      return '退款';
    }
    return payTypeDict[payType];
  };

  // 0 支付记录 1 退款记录
  const getCell = (item, index) => (
    <div className={styles.cellContainer} key={index}>
      <div className={styles.txtS}>订单号：{item.orderId}</div>
      <div className={styles.cellCenter}>
        <div>
          {getPayTypeText(item.payType, item.type)}
          {' | '}
          {payMethodDict[item.payMethod]}
        </div>
        {item.type === 1 ? (
          <div className={styles.fuAmount}>+¥{item.payAmount}</div>
        ) : (
          <div className={styles.amount}>-¥{item.payAmount}</div>
        )}
      </div>
      <div className={styles.txtS}>{item.payTime}</div>
    </div>
  );

  return (
    <div className={styles.center}>
      {detailList.length === 0 ? (
        <EmptyPage />
      ) : (
        detailList.map((item, index) => getCell(item, index))
      )}
    </div>
  );
};

export default connect(({ tradingDetail }: { tradingDetail: TradingDetailModelState }) => ({
  tradingDetail,
}))(TradingDetailPage);

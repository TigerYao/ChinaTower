import React, { FC, useEffect } from 'react';
import { PointsExchangeModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';
import EmptyPage from '@/components/EmptyPage';
import awaitSrc from '@/assets/images/await.png';

interface PageProps extends ConnectProps {
  pointsExchange: PointsExchangeModelState;
}

const PointsExchangePage: FC<PageProps> = ({ pointsExchange, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'pointsExchange/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = pointsExchange;
  return (
    <div className={styles.center}>
      <EmptyPage imgSrc={awaitSrc} title="功能正在开发中..." />
    </div>
  );
};

export default connect(({ pointsExchange }:{ pointsExchange: PointsExchangeModelState; }) => ({ pointsExchange }))(PointsExchangePage);

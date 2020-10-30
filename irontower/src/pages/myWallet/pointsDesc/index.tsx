import React, { FC, useEffect } from 'react';
import { PointsDescModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';

interface PageProps extends ConnectProps {
  pointsDesc: PointsDescModelState;
}

const PointsDescPage: FC<PageProps> = ({ pointsDesc, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'pointsDesc/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = pointsDesc;
  return (
    <div className={styles.center}>
      <h3>
        铁塔换电积分规则如下：
      </h3>
      <p>（1）每缴费10元，积1分；</p>
      <p>（2）介绍新用户注册缴费，积10分；</p>
      <p>（3）赠送、优惠活动不参与积分；</p>
      <p>（4）退费将相应扣减积分。</p>
    </div>
  );
};

export default connect(({ pointsDesc }:{ pointsDesc: PointsDescModelState; }) => ({ pointsDesc }))(PointsDescPage);

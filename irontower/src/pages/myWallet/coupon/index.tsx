import React, { FC, useEffect } from 'react';
import { CouponModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';

interface PageProps extends ConnectProps {
  coupon: CouponModelState;
}

const CouponPage: FC<PageProps> = ({ coupon, dispatch }) => {
  const { packageList = [] } = coupon;
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'coupon/getPckageConfigList',
    //   payload: {
    //     cityCode: '410100',
    //     packageID: '901253',
    //   },
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = coupon;

  // const packageList = [
  //   {
  //     discount: '5',
  //     title: '18次换电卡折扣券',
  //     date: '2020.02.10~2020.03.30',
  //   },
  //   {
  //     discount: '5',
  //     title: '18次换电卡折扣券',
  //     date: '2020.02.10~2020.03.30',
  //   },
  // ];

  const getCell = (item, index) => (
    <div className={styles.cellContainer}>
      <div className={styles.discount}>
        {item.discount}
        <span>折</span>
      </div>
      <div className={styles.contentBox}>
        <div>{item.title}</div>
        <div>有效期：{item.date}</div>
      </div>
      <div className={styles.btn}>去使用</div>
    </div>
  );

  return (
    <div className={styles.center}>{packageList.map((item, index) => getCell(item, index))}</div>
  );
};

export default connect(({ coupon }: { coupon: CouponModelState }) => ({ coupon }))(CouponPage);

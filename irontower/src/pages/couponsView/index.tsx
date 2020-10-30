import React, { FC, useEffect, useState } from 'react';
import { CouponsViewModelState, ConnectProps, connect } from 'alita';
import { Tabs } from 'antd-mobile';
import CouponsCard from './components/CouponsCard';
import styles from './index.less';

import EmptyPage from '@/components/EmptyPage';

interface PageProps extends ConnectProps {
  couponsView: CouponsViewModelState;
}

const CouponsViewPage: FC<PageProps> = ({ couponsView, dispatch }) => {
  const { couponList = [] } = couponsView;
  const [initialPage, setInitialPage] = useState(0);
  // 这里发起了初始化请求
  useEffect(() => {
    // 类型（0未启用，1已启用）
    dispatch!({
      type: 'couponsView/getCouponInfoByDriverId',
      payload: {
        type: `${initialPage}`,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  const TabBar = ({ keys = '0', title = '' }) => {
    const className =
      `${initialPage}` === keys ? `${styles.activeStyle} ${styles.tabDefault}` : styles.tabDefault;
    return (
      <div className={className}>
        <span>{title}</span>
      </div>
    );
  };

  const renderContent = (props: { key: string }) => {
    const couponsViews = couponList;
    console.log(couponList);
    if (couponList.length === 0) {
      return (
        <div className={styles.empty}>
          <EmptyPage />
        </div>
      );
    }
    return (
      <div className={styles.couponsView}>
        {couponsViews.map((item: any) => {
          return (
            <CouponsCard
              isEnable={item.useStatus === '0'}
              item={item}
              key={item.couponNo}
              onUseClick={() => {
                dispatch!({
                  type: 'couponsView/enableCouponById',
                  payload: {
                    type: `${initialPage}`,
                    couponNo: item.couponNo,
                  },
                });
              }}
            ></CouponsCard>
          );
        })}
      </div>
    );
  };

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = couponsView;
  return (
    <div className={styles.center}>
      <Tabs
        animated={false}
        swipeable={false}
        initialPage={initialPage}
        onTabClick={(e, index) => {
          setInitialPage(index);
          dispatch!({
            type: 'couponsView/getCouponInfoByDriverId',
            payload: {
              type: `${index}`,
            },
          });
        }}
        useOnPan={false}
        renderTab={e => {
          return <TabBar keys={e.key} title={e.title} />;
        }}
        tabs={[
          {
            title: '未启用',
            key: '0',
          },
          {
            title: '已启用',
            key: '1',
          },
        ]}
      >
        {renderContent}
      </Tabs>
    </div>
  );
};

export default connect(({ couponsView }: { couponsView: CouponsViewModelState }) => ({
  couponsView,
}))(CouponsViewPage);

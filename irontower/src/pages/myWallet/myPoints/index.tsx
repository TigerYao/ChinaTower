import React, { FC, useEffect, useState } from 'react';
import { MyPointsModelState, ConnectProps, connect, router, setPageNavBar } from 'alita';
import classnames from 'classnames';
import EmptyPage from '@/components/EmptyPage';
import { ActionSheet, Toast } from 'antd-mobile';
import { getUserInfo } from '@/utils';
import styles from './index.less';

interface PageProps extends ConnectProps {
  myPoints: MyPointsModelState;
}

const operationList = [
  {
    value: '',
    title: '全部',
  },
  {
    value: '1',
    title: '收入',
  },
  {
    value: '2',
    title: '支出',
  },
];

const MyPointsPage: FC<PageProps> = ({ myPoints, dispatch }) => {
  const [showType, setShowType] = useState('');
  const { driverId, integral } = getUserInfo();
  const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

  // 获取积分列表
  const getMyPointsList = (changeType = '') => {
    dispatch!({
      type: 'myPoints/getMyPointsList',
      payload: {
        driverId,
        changeType,
      },
    });
  }

  const showShareActionSheet = () => {
    ActionSheet.showShareActionSheetWithOptions({
      options: [],
      // title: 'title',
      message: (
        <div className={styles.pointRules}>
          <h3>
            铁塔换电积分规则如下：
          </h3>
          <p>（1）每缴费10元，积1分；</p>
          <p>（2）介绍新用户注册，积10分；</p>
          <p>（3）赠送、优惠活动不参与积分；</p>
          <p>（4）退费将相应扣减积分。</p>
        </div>
      ),
    });
  };
  
  // 这里发起了初始化请求
  useEffect(() => {
    getMyPointsList();

    setPageNavBar({
      pagePath: '/myWallet/myPoints',
      navBar: {
        rightContent: (
          <div
            style={{ color: '#00BF83' }}
            onClick={() => {
              showShareActionSheet();
              /* router.push({
                pathname: '/myWallet/pointsDesc',
              }); */
            }}
          >
            积分介绍
          </div>
        ),
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { pointList } = myPoints;

  const renderHeader = () => (
    <div className={styles.headerContain}>
      <span>
        {integral}
      </span>
      <div
        className={styles.pointsExchange}
        onClick={() => {
          router.push({
            pathname: '/myWallet/pointsExchange',
          });
        }}
      >
        积分兑换
      </div>
    </div>
  );

  const handleShowTypeClick = (key) => {
    setShowType(key);
    getMyPointsList(key);
  }

  // 0 支付记录 1 退款记录
  const getCell = (item, index) => (
    <div className={styles.cellContainer} key={index}>
      <div className={styles.cellDesc}>
        <div className={styles.txtDesc}>{item.integralDesc}</div>
        <div className={styles.dateTime}>{item.createTime}</div>
      </div>
      <div className={styles.cellPoints}>
        {
          item.changeType === '1' ? (
            <div className={styles.fuAmount}>{item.integralValue}</div>
          ) : (
            <div className={styles.amount}>{item.integralValue}</div>
          )
        }
      </div>
    </div>
  );

  const renderPointsList = () => (
    <div className={styles.listContain}>
      <div className={styles.operation}>
        {operationList.map(item => (
          <div
            className={classnames(styles.title, showType === item.value && styles.selected)}
            key={item.value}
            onClick={() => handleShowTypeClick(item.value)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className={styles.pointsContain}>
          {
            pointList.length ? (
              pointList.map((item, index) => {
                return getCell(item, index);
              })
            ) : (
              <EmptyPage />
            )
          }
      </div>
    </div>
  );

  return (
    <div className={styles.center}>
      {renderHeader()}
      {renderPointsList()}
    </div>
  );
};

export default connect(({ myPoints }:{ myPoints: MyPointsModelState; }) => ({ myPoints }))(MyPointsPage);

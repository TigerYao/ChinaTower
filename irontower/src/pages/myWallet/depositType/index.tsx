import React, { FC, useEffect, useState } from 'react';
import { DepositModelState, ConnectProps, connect, router } from 'alita';
import { Flex, Button } from 'antd-mobile';
import depositSrc from '@/assets/images/deposit_bg.png';
import styles from './index.less';

interface PageProps extends ConnectProps {
  depositType: DepositTypeModelState;
}

const DepositTypePage: FC<PageProps> = ({ depositType, dispatch, location }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    /* dispatch!({
      type: 'depositType/query',
    }); */
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = depositType;
  return (
    <div className={styles.center}>
      <img src={depositSrc} />
      <div className={styles.depositTypeContain}>
        <Flex>
          <Flex.Item>
            <Button
              type="primary"
              onClick={() => {
                router.push({
                  pathname: '/myWallet/deposit',
                  query: {
                    payClassify: 1,
                    ...location.query,
                  },
                });
              }}
            >
              我要租电池
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button
              type="primary"
              onClick={() => {
                router.push({
                  pathname: '/myWallet/deposit',
                  query: {
                    payClassify: 0,
                    ...location.query,
                  },
                });
              }}
            >
              我要租车
            </Button>
          </Flex.Item>
        </Flex>
      </div>
    </div>
  );
};

export default connect(({ depositType }:{ depositType: DepositTypeModelState; }) => ({ depositType }))(DepositTypePage);

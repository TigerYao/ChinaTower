import React, { FC, useEffect, useRef, useState } from 'react';
import { RentCarListModelState, ConnectProps, connect, router } from 'alita';
import LoadMoreListView, { LoadMoreListAttributes } from '@alitajs/list-view';
import { Toast, Modal, Button, Flex, List, Card, Grid } from 'antd-mobile'; 
import EmptyPage from '@/components/EmptyPage';
import classnames from 'classnames';
import { queryRentCarList } from '@/services/netRequest';
import {
  getUserInfo,
} from '@/utils';

import styles from './index.less';

interface PageProps extends ConnectProps {
  rentCarList: RentCarListModelState;
}

const RentCarListPage: FC<PageProps> = ({ rentCarList, dispatch }) => {
  const { rentList } = rentCarList;
  const { driverId } = getUserInfo();
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'rentCarList/queryRentCarList',
      payload: {
        driverId
      }
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const goDetail = data => {
    router.push({
      pathname: '/rentCarDetail',
      query: {
        ...data
      }
    })
  }

  // 点击退还跳转
  const onClickBack = e => {
    e.stopPropagation();
  }

  return (
    <Flex direction="column" className={ styles.center } align="start">
      <Flex.Item className={ styles.list_content }>
        {rentList.length > 0 ? rentList.map((map, index) => (
          <Card className={styles.info_card} key={`car_list_item_${ index }`} onClick={ () => { goDetail( map ); } }>
            <div>
              <div className={styles.leftDiv}>
                <div className={styles.idText}>车辆编号：{map.ecarNo}</div>
                <div className={styles.textSen}>车牌号：{map.licenceNo}</div>
                <div className={classnames([styles.textSen, styles.borrowTime])}>租车时间：{map.borrowTime}</div>
                {map.borrowState === '0' ? null : <div className={classnames([styles.textSen, styles.returnTime])}>还车时间：{map.returnTime} </div>}
              </div>
              <div className={styles.rightDiv}>
                <div className={styles.statusText}
                  style={{ color: map.borrowState === '0' ? '#00BF8F' : '#FA6400' }}
                >
                  {map.borrowState === '0' ? '正在使用' : '已退还'}
                </div>
                {/* {map.borrowState === '0' ? <button className={styles.backBtn} onClick={ onClickBack }>退还</button> : null} */}
              </div>
            </div>
          </Card>
        )) : <EmptyPage />
      }
      </Flex.Item>
      <Flex.Item className={ styles.buttomFlex }>
        <div className={ styles.buttomDiv }/>
      </Flex.Item>
    </Flex>
  );
};

export default connect(({ rentCarList }:{ rentCarList: RentCarListModelState; }) => ({ rentCarList }))(RentCarListPage);

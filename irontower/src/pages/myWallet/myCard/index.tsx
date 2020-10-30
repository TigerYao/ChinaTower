import React, { FC, useEffect, useState } from 'react';
import { MyCardModelState, ConnectProps, connect } from 'alita';
import { Carousel, Toast } from 'antd-mobile';
import styles from './index.less';
import { InputItem } from '@alitajs/dform';

interface PageProps extends ConnectProps {
  myCard: MyCardModelState;
}

const MyCardPage: FC<PageProps> = ({ myCard, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'myCard/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = myCard;

  const [tipIndex, setTipIndex] = useState(0);

  const cardList = [
    {
      title: '换电套餐·全国',
      status: true,
      current: '8', // 剩余次数
      total: '20', // 总次数
      date: '2020-3-20', // 有效期至
      instruction: '这是说明鬼畜的说明说明说明说明说明说明说明什么说明啊',
    },
    {
      title: '换电套餐·全国',
      status: false,
      current: '8', // 剩余次数
      total: '20', // 总次数
      date: '2020-3-20', // 有效期至
      instruction: '这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明',
    },
    {
      title: '换电套餐·全国',
      status: true,
      current: '5', // 剩余次数
      total: '20', // 总次数
      date: '2020-3-20', // 有效期至
      instruction: '明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这是说明这',
    },
  ];

  const getCard = (item, index) => (
    <div className={styles.cardBox} key={index}>
      <div className={styles.card} style={{background: item.status ? 'rgba(0,191,131,1)' : '#69696D'}}>
        <div className={styles.titleBox}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.status}>{item.status ? '' : '不可用'}</div>
        </div>
        <div className={styles.centerBox}>
          <div className={styles.detail}>剩余{item.current}次/总次数{item.total}</div>
          <div className={styles.btn} style={{background: item.status ? 'rgba(255,255,255,1)' : '#69696D'}}>{item.status ? '去续费' : ''}</div>
        </div>
        <div className={styles.detail}>
          有效期至{item.date}
        </div>
      </div>
    </div>
  );

  const getDetail = (item) => (
    <div className={styles.detailBox}>
      <div className={styles.title}>换电权益</div>
      <div className={styles.nameBox}>
        <div className={styles.name}>{item.title}</div>
        <div className={styles.curr}>剩余{item.current}次</div>
      </div>
      <div style={{display: item.status ? 'none' : 'block'}}>
        <div className={styles.tipCard}>
          不在当前的服务区内，换电套餐不可用
        </div>
      </div>
      <div className={styles.instr}>{item.instruction}</div>
    </div>
  );

  return (
    <div className={styles.center}>
       <div className={styles.bannerBox}>
        <Carousel 
          autoplay={false}
          infinite
          afterChange={index => {console.log("index==", index); setTipIndex(index);}}
        >
          {
            cardList.map((item, index) => getCard(item, index))
          }
        </Carousel>
        {getDetail(cardList[tipIndex])}
      </div>
    </div>
  );
};

export default connect(({ myCard }:{ myCard: MyCardModelState; }) => ({ myCard }))(MyCardPage);

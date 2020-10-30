import React, { FC, useEffect, useState } from 'react';
import { NewsModelState, ConnectProps, connect, router } from 'alita';
import NewsView from "@/components/NewsView"
import redTipsIcon from "@/assets/images/redtips_img.png"
import systemIcon from "@/assets/images/system_img.png"
import warningIcon from "@/assets/images/warning_img.png"
import activityIcon from "@/assets/images/activity_img.png"
import { getNoticeInfo } from '@/utils/index';
import styles from './index.less';

interface PageProps extends ConnectProps {
  news: NewsModelState;
}

const NewsPage: FC<PageProps> = ({ news, dispatch }) => {
  const [sysNewsCount, updateSysNewsCount] = useState(0)
  const [activityNewsCount, updateActivityNewsCount] = useState(0)

  const { newsCount = {} } = news;
  const {
    warnNewsCount = 0,
  } = newsCount;

  const noticeInfo = getNoticeInfo();
  const getNotice = () => {
    Object.keys(noticeInfo).forEach(item => {
      if (noticeInfo[item].type === '501' && !noticeInfo[item].isRead) {
        updateSysNewsCount(sysNewsCount + 1);
      } else if (noticeInfo[item].type === '502' && !noticeInfo[item].isRead) {
        updateActivityNewsCount(activityNewsCount + 1);
      }
      // 无标题无内容，空数据，接口获取详情
      if (!noticeInfo[item].noticeTitle && !noticeInfo[item].noticeContent) {
        console.log('开始请求详情接口===', item);
        dispatch!({
          type: 'news/getSysNoticeInfoByNoticeId',
          payload: {
            ...noticeInfo[item],
          }
        });
      }
    });
  }
  // 这里发起了初始化请求
  useEffect(() => {
    getNotice();
    dispatch!({
      type: 'news/selectAccountNewsByGroup',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

 

  const redTips = (count: number) => <img src={redTipsIcon} style={{width:'.42rem',height:'.28rem',display: count > 0 ? 'block' : 'none'}} alt=""/>

  const toMessageList = (title: string, count: number) => {
    if (true) {
      let newsType = '';
      if (title === '通知公告') {
        newsType = '0';
      } else if (title === '预警消息') {
        newsType = '1';
      } else if (title === '活动消息') {
        newsType = '2';
      } 
  
      router.push({
        pathname: '/news/systemMessage',
        query: {
          title,
          newsType,
        },
      });

    } else {
      router.push({
        pathname: '/news/noNews',
      });
    }
    
  };

  const Data = [{
    logoImg: systemIcon,
    title: '通知公告',
    rignhImg: redTips(sysNewsCount),
    onClick: () => toMessageList('通知公告', sysNewsCount),
  },{
    logoImg: warningIcon,
    title: '预警消息',
    onClick: () => toMessageList('预警消息', warnNewsCount),
    rignhImg: redTips(warnNewsCount),
  },{
    logoImg: activityIcon,
    title: '活动消息',
    onClick: () => toMessageList('活动消息', activityNewsCount),
    rignhImg: redTips(activityNewsCount),
  }];

  return (
    <div className={styles.NewsPage}>
      {Data.map((item,index)=>(
        // eslint-disable-next-line react/no-array-index-key
        <NewsView Data={item} key={index} />
      ))}
    </div>
  );
};

export default connect(({ news }:{ news: NewsModelState; }) => ({ news }))(NewsPage);

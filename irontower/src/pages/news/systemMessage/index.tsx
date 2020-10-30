import React, { FC, useEffect } from 'react';
import { SystemMessageModelState, MessageDetailModelState, ConnectProps, connect, router } from 'alita';
import { Icon, WhiteSpace } from 'antd-mobile';
import NewsCard from "@/components/NewsCard";
import EmptyPage from '@/components/EmptyPage';
import { getNoticeInfo } from '@/utils/index';
import styles from './index.less';

interface PageProps extends ConnectProps {
  systemMessage: SystemMessageModelState;
  messageDetail: MessageDetailModelState;
}

const SystemMessagePage: FC<PageProps> = ({ systemMessage, dispatch, location, messageDetail }) => {
  const { newsType } = location.query;

  const newDataSource = () => {
    const dataSource: any = [];
    const dataList = getNoticeInfo(); 
      Object.keys(dataList).forEach(item => {
        if (newsType === '0' && dataList[item].type === '501') {
          dataSource.unshift(dataList[item]);
        } else if (newsType === '2' && dataList[item].type === '502') {
          dataSource.unshift(dataList[item]);
        }
      });
    return dataSource;
  }
  
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'systemMessage/selectAccountNews',
      payload: {
        newsType: location.query.newsType,
      }
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  
  /* const { formData = [], } = systemMessage; */

  const toDetail = (data: any) => {
    router.push({
      pathname: '/news/messageDetail',
      query: {
        title: location.query.title || "",
        noticeId: data.noticeId,
        type: data.type,
      }
    });
  };

  return (
    <div className={styles.systemMessage}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon type="left" onClick={e => {
              e.stopPropagation();
              router.goBack();
            }}
          />
        </div>
        <div className={styles.title}>{location.query ? location.query.title : ''}</div>
        <div className={styles.right}>
          <Icon type="left" style={{color: '#fff'}} />
        </div>
      </div>
      {
        newDataSource().length ? (
          <div className={styles.cardItems}>
            {
              (newDataSource() || []).map((i, index) => {
                const item = {
                  title: i.noticeTitle || '',
                  dateTime: i.publishTime || '',
                  desc: i.noticeContent || '',
                  imgSrc: i.noticeBanner || '',
                  isRead: i.isRead, // 默认已读
                };
                // eslint-disable-next-line react/no-array-index-key
                return (
                  <div>
                    <NewsCard formData={item} key={index} click={() => toDetail(i)} />
                    <WhiteSpace size="lg" />
                  </div>
                )
              })
            }
          </div>
        ): <div className={styles.cardItemsEmpty}><EmptyPage /></div>
      }
      {/* <PersonItem formData={formData}/> */}
      {/* <div className={styles.line}></div> */}
    </div>
  );
};

export default connect(
  ({ 
    systemMessage,
    messageDetail,
  }: { 
    systemMessage: SystemMessageModelState;
    messageDetail: MessageDetailModelState;
  }) => ({ systemMessage, messageDetail })
)(SystemMessagePage);

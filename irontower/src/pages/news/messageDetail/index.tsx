import React, { FC, useEffect, useState } from 'react';
import { MessageDetailModelState, ConnectProps, connect, router } from 'alita';
import { Icon } from 'antd-mobile';
import { getNoticeInfo, saveNoticeInfo } from '@/utils/index';
import EmptyPage from '@/components/EmptyPage';
import styles from './index.less';

interface PageProps extends ConnectProps {
  messageDetail: MessageDetailModelState;
}

const MessageDetailPage: FC<PageProps> = ({ messageDetail, dispatch, location }) => {
  const { noticeId, type } = location.query;
  const [currentInfo, updateCurrentInfo] = useState(getNoticeInfo()[noticeId] || {});
  const querNoticeInfo = () => {
    dispatch!({
      type: 'news/getSysNoticeInfoByNoticeId',
      payload: {
        noticeId,
        type,
        isRead: true,
        callback: (resNoticeInfo = {}) => {
          updateCurrentInfo(resNoticeInfo)
        }
      }
    });
  }
  // 这里发起了初始化请求
  useEffect(() => {
    if (!currentInfo.noticeTitle && !currentInfo.noticeContent) {
      querNoticeInfo();
    } else {
      currentInfo.isRead = true;
      saveNoticeInfo(noticeId, currentInfo);
    }
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { detail = {}, } = messageDetail;

  return (
    <div>
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
        currentInfo && currentInfo.noticeTitle && currentInfo.noticeContent ? (
          <div className={styles.MessageDetailPage}>
            <div className={styles.title}>{currentInfo?.noticeTitle}</div>
            <div className={styles.time}>{currentInfo?.publishTime}</div>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: currentInfo?.noticeContent}}></div>
          </div>
        ) : <div className={styles.emptyContain}><EmptyPage /></div>
      }
      
    </div>
  );
};

export default connect(({ messageDetail }:{ messageDetail: MessageDetailModelState; }) => ({ messageDetail }))(MessageDetailPage);

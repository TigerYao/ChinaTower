import React, { FC, useEffect } from 'react';
import { InvateHistoryModelState, ConnectProps, connect } from 'alita';
import { getLoginInfo } from '@/utils';
import EmptyPage from '@/components/EmptyPage';
import styles from './index.less';

interface PageProps extends ConnectProps {
  InvateHistory: InvateHistoryModelState;
}

const InvateHistoryPage: FC<PageProps> = ({ InvateHistory, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'InvateHistory/getHistoryInvitationCodeWithDriver',
      payload: {
        inviter: getLoginInfo().driverId,//'e1fbe94e669448aba4c926e2a89bc138', // 
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name, historyList = [] } = InvateHistory;
  return (
    <div className={styles.hisList}>
      {historyList.length === 0 ? (
        <EmptyPage />
      ) : (
        historyList.map((item, index) => (
          <div className={styles.itemStyle}>
            <div style={{ width: 0, flex: 1 }}>
              <div className={styles.itemLine}>
                <div>邀请码：{item.invitationCode}</div>
                <div className={styles.itemLineContent}>绑定时间：{item.createTime}</div>
              </div>
              <div className={styles.itemLine}>
                <div>被邀请人：{item.inviteeName}</div>
                <div className={styles.itemLineContent}>手机号：{item.inviteePhoneNumber}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default connect(({ InvateHistory }: { InvateHistory: InvateHistoryModelState }) => ({
  InvateHistory,
}))(InvateHistoryPage);

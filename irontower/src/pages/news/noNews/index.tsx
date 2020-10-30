import React, { FC, useEffect } from 'react';
import { NoNewsModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';

import nonewsIcon from '@/assets/images/noNews_img.png'
interface PageProps extends ConnectProps {
  noNews: NoNewsModelState;
}

const NoNewsPage: FC<PageProps> = ({ noNews, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'noNews/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = noNews;
  return (
    <div className={styles.NoNewsPage}>
      <img src={nonewsIcon} alt=""/>
      <div className={styles.tips}>暂无消息</div>
    </div>
  );
};

export default connect(({ noNews }:{ noNews: NoNewsModelState; }) => ({ noNews }))(NoNewsPage);

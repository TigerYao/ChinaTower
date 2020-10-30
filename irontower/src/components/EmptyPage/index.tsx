import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';

import IconEmpty from '@/assets/images/empty-icon.png';

interface EmptyPageProps {
  imgSrc?: NodeRequire;
  title?: string;
}

const EmptyPage: FC<EmptyPageProps> = props => {
  const { imgSrc = IconEmpty, title = '暂无数据' } = props;
  return (
    <div className={styles.emptyPage}>
      {imgSrc ? (
        <div className={styles.emptyImg}>
          <img src={imgSrc} alt="" />
        </div>
      ) : (
        <></>
      )}
      <div className={styles.emptyTitle}>{title}</div>
    </div>
  );
};

export default EmptyPage;

import React, { FC } from 'react';
import styles from './index.less';

interface TipsViewProps {
  type: 'Close' | 'Button';
  tip: string;
}

const TipsView: FC<TipsViewProps> = props => {
  const { tip, type } = props;
  return (
    <div className={styles.tipsView}>
      <div>{tip}</div>
    </div>
  );
};

export default TipsView;

import React, { FC } from 'react';
import styles from './index.less';
import { connect } from 'alita';
interface EleTowerProps {
  precent?: string | number;
  click?: () => void;
  isoutLine?: boolean; // 是否离线
}

/**
 * 导航条电量显示
 */
const EleTower: FC<EleTowerProps> = ({ precent, click = () => {}, isoutLine = false }) => {
  const eleBgColor = () => {
    if (isoutLine) {
      return '#808080';
    }

    const precentNum = parseInt(precent);
    if (precentNum >= 30) {
      return 'rgba(0, 191, 143, 1)';
    }

    if (precentNum >= 20) {
      return 'orange';
    }

    return '#ff4f1d';
  };

  const OutLineBattery = () => (
    <div hidden={!isoutLine}>
      {/* <span className={styles.text} style={{ color: eleBgColor() }}>
        离线
      </span> */}
      <span className={styles.text} style={{ color: eleBgColor() }}>
        {precent}%
      </span>
      <div className={styles.tower}>
        <div
          style={{
            height: `${precent}%`,
            backgroundColor: eleBgColor(),
          }}
        ></div>
      </div>
    </div>
  );

  const NomalBattery = () => (
    <div hidden={isoutLine}>
      <span className={styles.text} style={{ color: eleBgColor() }}>
        {precent}%
      </span>
      <div className={styles.tower}>
        <div
          style={{
            height: `${precent}%`,
            backgroundColor: eleBgColor(),
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className={styles.eleTower} onClick={click}>
      <NomalBattery />
      <OutLineBattery />
    </div>
  );
};

export default connect(({ common }) => ({ common }))(EleTower);

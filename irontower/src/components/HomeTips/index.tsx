import React, { FC } from 'react';
import styles from './index.less';

import CloseBtn from '@/assets/images/close-btn.png';

interface HomeTipsProps {
  text?: string;
  onClose?: () => void;
  type?: 'Close' | 'Button' | 'Default';
  btnObj?: {
    text?: string;
    onClick?: () => void;
  };
}

const HomeTips: FC<HomeTipsProps> = ({ text = '', onClose = () => {}, btnObj, type = 'Close' }) => {
  const renderRightView = () => {
    switch (type) {
      case 'Close':
        return <img className={styles.closeBtn} src={CloseBtn} alt="" onClick={onClose} />;
      case 'Button':
        return (
          <div
            className={styles.btnStyle}
            onClick={() => {
              if (btnObj!.onClick) {
                btnObj!.onClick();
              }
            }}
          >
            {btnObj?.text}
          </div>
        );
      case 'Default':
        return '';

      default:
        break;
    }
  };

  return (
    <div className={styles.homeTips}>
      <div className={styles.tipsWrapper}>
        <span>{text}</span>
        {renderRightView()}
      </div>
    </div>
  );
};

export default HomeTips;

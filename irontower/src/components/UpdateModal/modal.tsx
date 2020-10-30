import React, { Component } from 'react';
import styles from './index.less';
// eslint-disable-next-line react/prefer-stateless-function
import IconShareClose from '@/assets/images/share_close.png';

interface Props {
  version: string;
  tips: string;
  downloadUrl: string;
  show: boolean;
  onClose: () => void;
  isForceUpgrade: boolean;
}

// eslint-disable-next-line react/prefer-stateless-function
class Modal extends Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Readonly<{}>) {
    super(props);
  }

  render() {
    const {
      version,
      tips,
      downloadUrl,
      show = true,
      onClose = () => {},
      isForceUpgrade,
    } = this.props;
    return (
      <>
        <div hidden={!show} className={styles.updateModalsBg}></div>
        <div className={`${styles.updateModalContent} ${show && styles.show}`}>
          <div className={styles.updateModalContentTitleWrapper}>
            <div className={styles.updateModalTitle}>发现新版本</div>
            <div className={styles.updateModalVersion}>{version}</div>
          </div>
          <div className={styles.uploadContent}>
            <div className={styles.tips}>{tips}</div>
            <a
              href={downloadUrl}
              className={styles.uploadBtn}
              onClick={e => {
                e.stopPropagation();
                onClose();
              }}
            >
              立即升级
            </a>
          </div>
          {!isForceUpgrade && (
            <div className={styles.closeBtn}>
              <img onClick={onClose} src={IconShareClose} alt="" />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Modal;

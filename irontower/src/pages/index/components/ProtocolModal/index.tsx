import React, { FC } from 'react';
import { Modal } from 'antd-mobile';
import classnames from 'classnames';
import { history } from 'alita';
import { setAgreementPro, saveLoginInfo, clearLoginInfo, clearUserInfo, setAgreementProByUserId, getLoginInfo } from '@/utils';
import { commonFunc } from '@/utils/cordovapluigs';
import styles from './index.less';
interface ProtocolModalProps {
  visible: boolean;
  onClose: () => void;
  goProtocol: () => void;
}

/**
 * 协议弹窗
 * @param props
 */
const ProtocolModal: FC<ProtocolModalProps> = ({ visible = false, onClose = () => {}, goProtocol = () => {} }) => {
  return (
    <Modal className={styles.protocolBox} transparent visible={visible}>
      <div className={styles.modalWrapper}>
        <div className={styles.modalTitle}>铁塔换电隐私政策</div>
        <div className={styles.modalContent}>
        欢迎使用“铁塔换电”，基于对个人信息的保护，在使用前请仔细阅读
          <span
            onClick={() => {
              // history.push({
              //   pathname: '/',
              // });

              goProtocol();

              // commonFunc({
              //   method: 'openWebView',
              //   params: {
              //     url: '',
              //     title: '铁塔换电隐私政策',
              //   },
              // });

              // onClose();
            }}
          >
            《铁塔换电隐私政策》
          </span>
          ，我们将严格遵照您的意愿使用个人信息，以便为您提供更好的服务。
        </div>
        <div className={styles.footer}>
          <div
            className={classnames(styles.footerItem, styles.noAgree)}
            onClick={() => {
              onClose();
              setAgreementProByUserId(false);
              
              clearLoginInfo();
              clearUserInfo();
              history.push({ pathname: '/' });
              // localStorage.setItem('setProtocolVisible', 'true')
              setAgreementPro(false);
            }}
          >
            不同意
          </div>
          <div
            className={styles.footerItem}
            onClick={() => {
              onClose();
              // setAgreementPro(true);
              setAgreementProByUserId(true);
            }}
          >
            同意
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProtocolModal;

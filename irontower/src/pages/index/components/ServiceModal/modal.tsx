import React, { Component } from 'react';
import styles from './index.less';
import { commonFunc } from '@/utils/cordovapluigs';
import { getUserInfo } from '@/utils';


// eslint-disable-next-line react/prefer-stateless-function
interface Props {
  show: boolean;
  onClose: () => void;
}

// eslint-disable-next-line react/prefer-stateless-function
class SelectModal extends Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Readonly<{}>) {
    super(props);
  }

  render() {
    const { show = true, onClose = () => {} } = this.props;
    const { phoneNumber, realName, provinceName, cityName } = getUserInfo();

    return (
      <>
        <div hidden={!show} className={styles.updateModalsBg}></div>
        <div className={`${styles.updateModalContent} ${show && styles.show}`}>
          <div className={styles.uploadContent}>
            <div
              className={styles.tips}
              onClick={e => {
                e.stopPropagation();
                onClose();
                window.location.href = 'tel:10096';
              }}
            >
              拨打电话
            </div>

            <div
              className={styles.tips1}
              onClick={e => {
                e.stopPropagation();
                onClose();
                commonFunc({
                  method: 'openWebView',
                  params: {
                    url: `http://im5.7x24cc.com/phone_webChat.html?accountId=N000000022137&chatId=8bd6ba4a-1b03-4813-bae4-e269b7192c57&phone=${phoneNumber}&nickName=${realName}(${provinceName}${cityName})`,
                    title: '客服服务',
                  },
                });
              }}
            >
              在线客服
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SelectModal;

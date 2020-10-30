import React, { FC, useEffect } from 'react';
import { ProtocolModelState, ConnectProps, connect, router, setPageNavBar } from 'alita';
import { Icon } from 'antd-mobile';
import { getLoginInfo, getAgreement, } from '@/utils';
import styles from './index.less';

interface PageProps extends ConnectProps {
  protocol: ProtocolModelState;
}

const ProtocolPage: FC<PageProps> = ({ protocol, dispatch, location }) => {
  
  const { name, protocolDetail } = protocol;

  // 这里发起了初始化请求
  useEffect(() => {
    if (protocolDetail) {
      document.getElementById("ProtocolPage_mainContainer").innerHTML = protocolDetail;
    }

    const tmpTitle = location.query.title;
    if (tmpTitle.indexOf('隐私政策') > -1) {
      localStorage.setItem('setProtocolVisible', 'true');
    }
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  return (
    <div className={styles.center}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon type="left" onClick={e => {
              e.stopPropagation();
              // const { loginCount } = getLoginInfo();
              // if (loginCount === 0) {
              //   localStorage.setItem('setProtocolVisible', 'true');
              // } else if (!getAgreement()) {
              //   localStorage.setItem('setProtocolVisible', 'true');
              // }
              const tmpTitle = location.query.title;
              if (tmpTitle.indexOf('隐私政策') > -1) {
                localStorage.setItem('setProtocolVisible', 'true');
              }
              router.goBack();
            }}
          />
        </div>
        <div className={styles.title}>{location.query ? location.query.title : ''}</div>
        <div className={styles.right}>
          <Icon type="left" style={{color: '#fff'}} />
        </div>
      </div>

      <div className={styles.mainContainer} id="ProtocolPage_mainContainer">

      </div>

    </div>
  );
};

export default connect(({ protocol }:{ protocol: ProtocolModelState; }) => ({ protocol }))(ProtocolPage);

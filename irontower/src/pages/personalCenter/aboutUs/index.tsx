import React, { FC, useEffect, useState } from 'react';
import { AboutUsModelState, ConnectProps, connect } from 'alita';
import copy from 'copy-to-clipboard';
import logoIcon from '@/assets/images/logo-new.png';
import { getAppVersion, isNeedUpdate, checkAppVersionUpdate } from '@/global';
import { Toast } from 'antd-mobile';
import styles from './index.less';
import { commonFunc } from '@/utils/cordovapluigs';

interface PageProps extends ConnectProps {
  aboutUs: AboutUsModelState;
}

const AboutUsPage: FC<PageProps> = ({ aboutUs, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'aboutUs/selectObjectsByKeys',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { telephone, service, website, email } = aboutUs;
  const [version, setVersion] = useState('');

  getAppVersion().then(res => {
    setVersion(res);
  });
  const copyBtn = () => {
    const content = document.getElementById('Email')?.innerHTML;
    copy(content);
  };
  const checkUpdate = () => {
    commonFunc({
      method: 'showUpdateView',
    });
    // if (isNeedUpdate) {
    //   checkAppVersionUpdate();
    // } else {
    //   Toast.info('您目前版本为最新版本');
    // }
  };
  return (
    <div className={styles.AboutUsPage}>
      <div className={styles.header}>
        <img src={logoIcon} alt="" />
        <div className={styles.app}>铁塔换电</div>
        <div>{version}</div>

        <div className={styles.checkVersion} onClick={checkUpdate}>
          检查新版本
        </div>
      </div>
      <div className={styles.foot}>
        <div>
          微信服务号：<span>{service}</span>
        </div>
        <div>
          官方网站：<span>{website}</span>
        </div>
        <div className={styles.flex}>
          <div>
            联系电话：<span>{telephone}</span>
          </div>
          <div className={styles.call}>
            <a href={`tel:${telephone}`}>拨打</a>
          </div>
        </div>
        {/* <div className={styles.flex}>
          <div>电子邮箱：<span id="Email">{email}</span></div>
          <div className={styles.copy} onClick={copyBtn}>复制</div>
        </div> */}
      </div>
      {/* <div className={styles.line}></div> */}
      {/* <div id="Email">{email}</div>
          <button  onClick={copy}>复制</button> */}
    </div>
  );
};

export default connect(({ aboutUs }: { aboutUs: AboutUsModelState }) => ({ aboutUs }))(AboutUsPage);

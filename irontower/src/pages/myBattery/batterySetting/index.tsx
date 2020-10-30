import React, { FC, useEffect, useState } from 'react';
import { BatterySettingModelState, ConnectProps, connect } from 'alita';
import SettingCloseIcon from '@/assets/images/setting-close.png';
import SettingOpenIcon from '@/assets/images/setting-open.png';
import { Switch } from 'antd-mobile';
import styles from './index.less';

interface PageProps extends ConnectProps {
  batterySetting: BatterySettingModelState;
}

const BatterySettingPage: FC<PageProps> = ({ batterySetting, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'batterySetting/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = batterySetting;
  const [isOpen, setIsOpen] = useState(false);
  const change = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles.center}>
      <div className={styles.card}>
        {/* <div>低电量提醒设置</div>
        <img src={ isOpen ? SettingOpenIcon : SettingCloseIcon} onClick={change} /> */}
      </div>
    </div>
  );
};

export default connect(({ batterySetting }: { batterySetting: BatterySettingModelState }) => ({
  batterySetting,
}))(BatterySettingPage);

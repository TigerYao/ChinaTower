import React, { FC, useEffect } from 'react';
import { setPageNavBar, connect, SettingsModelState, ConnectProps } from 'alita';
import { Icon } from 'antd-mobile';
import EmptyPage from '@/components/EmptyPage';
import styles from './index.less';

interface PageProps extends ConnectProps {
  settings: SettingsModelState;
}

const SettingsPage: FC<PageProps> = ({ settings, dispatch, location }) => {
  const onLeftClick = () => {
    console.log('click left');
  };
  useEffect(() => {
    console.log(location);
    // setPageNavBar({
    //   pagePath: location.pathname,
    //   navBar: {
    //     // onLeftClick,
    //     rightContent: [
    //       <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
    //       <Icon key="1" type="ellipsis" />,
    //     ],
    //     // leftContent: [<Icon key="1" type="ellipsis" />],
    //   },
    // });
    // dispatch!({
    //   type: 'settings/query',
    // });
  }, []);
  const { name } = settings;

  // return <EmptyPage title="暂无消息">Hello {name}</EmptyPage>;
  return (
    <div
      style={{
        writingMode: 'vertical-lr',
      }}
    >
      啊啊啊啊
    </div>
  );
};

export default connect(({ settings }: { settings: SettingsModelState }) => ({ settings }))(
  SettingsPage,
);

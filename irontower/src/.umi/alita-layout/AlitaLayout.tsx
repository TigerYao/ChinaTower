// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export default (props) => {
  const layoutConfig = plugin.applyPlugins({
    key: 'mobileLayout',
    type: ApplyPluginsType.modify,
    initialValue: {},
  }) || {};
  return React.createElement(require('/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/@alitajs/layout/lib/layout/index.js').default, {
    layoutConfig,
    hasKeepAlive: true,
    ...props
  })
}

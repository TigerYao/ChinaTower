// @ts-nocheck
import './core/polyfill';
import '@@/core/devScripts';
import '../global.ts';
import { plugin } from './core/plugin';
import './core/pluginRegister';
import { createHistory } from './core/history';
import { ApplyPluginsType } from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/@umijs/runtime';
import { renderClient } from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/@umijs/renderer-react/dist/index.js';
import { getRoutes } from './core/routes';
import '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/node_modules/@alitajs/hd/lib/template.js';

require('../global.less');

const getClientRender = (args: { hot?: boolean; routes?: any[] } = {}) => plugin.applyPlugins({
  key: 'render',
  type: ApplyPluginsType.compose,
  initialValue: () => {
    const opts = plugin.applyPlugins({
      key: 'modifyClientRenderOpts',
      type: ApplyPluginsType.modify,
      initialValue: {
        routes: args.routes || getRoutes(),
        plugin,
        history: createHistory(args.hot),
        isServer: process.env.__IS_SERVER,
        rootElement: 'root',
        defaultTitle: ``,
      },
    });
    return renderClient(opts);
  },
  args,
});

const clientRender = getClientRender();
export default clientRender();


    window.g_umi = {
      version: '3.2.16',
    };
  

// hot module replacement
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./core/routes', () => {
    const ret = require('./core/routes');
    if (ret.then) {
      ret.then(({ getRoutes }) => {
        getClientRender({ hot: true, routes: getRoutes() })();
      });
    } else {
      getClientRender({ hot: true, routes: ret.getRoutes() })();
    }
  });
}

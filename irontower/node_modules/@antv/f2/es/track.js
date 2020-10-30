/**
 * @fileOverview track f2
 * @author sima.zhang1990@gmail.com
 */
import Global from './global';
import { isBrowser } from './util/common';
var SERVER_URL = 'https://kcart.alipay.com/web/bi.do';
setTimeout(function () {
  if (Global.trackable && isBrowser) {
    // Only works for H5 env
    var image = new Image();
    var newObj = {
      pg: document.URL,
      r: new Date().getTime(),
      f2: true,
      version: Global.version,
      page_type: 'syslog'
    };
    var d = encodeURIComponent(JSON.stringify([newObj]));
    image.src = "".concat(SERVER_URL, "?BIProfile=merge&d=").concat(d);
  }
}, 3000);
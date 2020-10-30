"use strict";

var _global = _interopRequireDefault(require("./global"));

var _common = require("./util/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview track f2
 * @author sima.zhang1990@gmail.com
 */
var SERVER_URL = 'https://kcart.alipay.com/web/bi.do';
setTimeout(function () {
  if (_global["default"].trackable && _common.isBrowser) {
    // Only works for H5 env
    var image = new Image();
    var newObj = {
      pg: document.URL,
      r: new Date().getTime(),
      f2: true,
      version: _global["default"].version,
      page_type: 'syslog'
    };
    var d = encodeURIComponent(JSON.stringify([newObj]));
    image.src = SERVER_URL + "?BIProfile=merge&d=" + d;
  }
}, 3000);
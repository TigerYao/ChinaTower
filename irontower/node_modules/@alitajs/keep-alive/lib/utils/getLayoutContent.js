"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(keepalive, path) {
  return "import React from 'react';\n\nconst KeepAliveLayout = (props:any) => {\n  return React.createElement(require('".concat(path, "').default, {\n    keepalive:[").concat(keepalive, "],\n    ...props\n  })\n}\nexport {KeepAliveLayout}\n");
};

exports.default = _default;
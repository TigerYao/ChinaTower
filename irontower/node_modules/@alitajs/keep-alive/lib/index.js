"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _getLayoutContent = _interopRequireDefault(require("./utils/getLayoutContent"));

var _getKeepAliveLayout = _interopRequireDefault(require("./utils/getKeepAliveLayout"));

var _getModelContent = _interopRequireDefault(require("./utils/getModelContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DIR_NAME = 'keep-alive';
const MODEL_NAME = 'KeepAlive';
const RELATIVE_MODEL = (0, _path().join)(DIR_NAME, MODEL_NAME); // keepalive:['route path','route path']
// import { dropByCacheKey } from 'umi';
// dropByCacheKey('/list');

var _default = api => {
  if (!api.userConfig.keepalive) return;
  api.describe({
    key: 'keepalive',
    config: {
      default: {},

      schema(joi) {
        return joi.array();
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });

  const configStringify = config => {
    return config.map(item => {
      if (item instanceof RegExp) {
        return item;
      }

      return `'${item}'`;
    });
  };

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: (0, _path().join)(DIR_NAME, 'KeepAliveLayout.tsx'),
      content: (0, _getKeepAliveLayout.default)(api.paths.absTmpPath || '')
    });
    api.writeTmpFile({
      path: (0, _path().join)(DIR_NAME, 'KeepAlive.tsx'),
      content: (0, _getLayoutContent.default)(configStringify(api.userConfig.keepalive), './KeepAliveLayout')
    });
    api.writeTmpFile({
      path: (0, _path().join)(DIR_NAME, 'KeepAliveModel.tsx'),
      content: (0, _getModelContent.default)()
    });
  });
  api.addUmiExports(() => [{
    exportAll: true,
    source: `../${RELATIVE_MODEL}`
  }, {
    exportAll: true,
    source: `../${(0, _path().join)(DIR_NAME, 'KeepAliveModel')}`
  }]);
};

exports.default = _default;
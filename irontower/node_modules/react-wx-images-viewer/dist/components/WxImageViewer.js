'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _WrapViewer = require('./WrapViewer');

var _WrapViewer2 = _interopRequireDefault(_WrapViewer);

require('./WxImageViewer.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WxImageViewer = function (_Component) {
  _inherits(WxImageViewer, _Component);

  function WxImageViewer(props) {
    _classCallCheck(this, WxImageViewer);

    var _this = _possibleConstructorReturn(this, (WxImageViewer.__proto__ || Object.getPrototypeOf(WxImageViewer)).call(this, props));

    _this.node = document.createElement('div');
    return _this;
  }

  _createClass(WxImageViewer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { onClose: this.props.onClose };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.body.appendChild(this.node);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.body.removeChild(this.node);
    }
  }, {
    key: 'render',
    value: function render() {
      return _reactDom2.default.createPortal(_react2.default.createElement(_WrapViewer2.default, this.props), this.node);
    }
  }]);

  return WxImageViewer;
}(_react.Component);

WxImageViewer.propTypes = {
  maxZoomNum: _propTypes2.default.number, // 最大放大倍数
  zIndex: _propTypes2.default.number, // 组件图层深度
  index: _propTypes2.default.number, // 当前显示图片的http链接
  urls: _propTypes2.default.array.isRequired, // 需要预览的图片http链接列表
  gap: _propTypes2.default.number, // 间隙
  speed: _propTypes2.default.number, // Duration of transition between slides (in ms)
  onClose: _propTypes2.default.func.isRequired // 关闭组件回调
};
WxImageViewer.childContextTypes = {
  onClose: _propTypes2.default.func
};
WxImageViewer.defaultProps = {
  maxZoomNum: 4,
  zIndex: 100,
  index: 0,
  gap: 10,
  speed: 300
};
exports.default = WxImageViewer;
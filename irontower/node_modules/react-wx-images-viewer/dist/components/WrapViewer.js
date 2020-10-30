'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ListContainer = require('./ListContainer');

var _ListContainer2 = _interopRequireDefault(_ListContainer);

var _Pointer = require('./Pointer');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var screenWidth = typeof document !== 'undefined' && document.documentElement.clientWidth;
var screenHeight = typeof document !== 'undefined' && document.documentElement.clientHeight;

var WrapViewer = function (_Component) {
  _inherits(WrapViewer, _Component);

  function WrapViewer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, WrapViewer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrapViewer.__proto__ || Object.getPrototypeOf(WrapViewer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      index: 0
    }, _this.changeIndex = function (index) {
      console.info('changeIndex index = ', index);
      _this.setState({
        index: index
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WrapViewer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var index = this.props.index;


      this.setState({
        index: index
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          zIndex = _props.zIndex,
          urls = _props.urls,
          maxZoomNum = _props.maxZoomNum,
          gap = _props.gap,
          speed = _props.speed;
      var index = this.state.index;


      return _react2.default.createElement(
        'div',
        { className: 'wx-image-viewer', style: { zIndex: zIndex } },
        _react2.default.createElement('div', { className: 'viewer-cover' }),
        _react2.default.createElement(_ListContainer2.default, {
          screenWidth: screenWidth,
          screenHeight: screenHeight,
          changeIndex: this.changeIndex,
          urls: urls,
          maxZoomNum: maxZoomNum,
          gap: gap,
          speed: speed,
          index: index
        }),
        _react2.default.createElement(_Pointer2.default, { length: urls.length, index: index, changeIndex: this.changeIndex })
      );
    }
  }]);

  return WrapViewer;
}(_react.Component);

WrapViewer.propTypes = {
  index: _propTypes2.default.number.isRequired, // 当前显示图片的http链接
  urls: _propTypes2.default.array.isRequired, // 需要预览的图片http链接列表
  maxZoomNum: _propTypes2.default.number.isRequired, // 最大放大倍数
  zIndex: _propTypes2.default.number.isRequired, // 组件图层深度
  gap: _propTypes2.default.number.isRequired, // 间隙
  speed: _propTypes2.default.number.isRequired // Duration of transition between slides (in ms)
};
exports.default = WrapViewer;
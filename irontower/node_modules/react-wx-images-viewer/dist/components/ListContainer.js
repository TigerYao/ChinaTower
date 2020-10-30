'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ImageContainer = require('./ImageContainer');

var _ImageContainer2 = _interopRequireDefault(_ImageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 快速拖动时间限制
var DEFAULT_TIME_DIFF = 200;

var ListContainer = function (_PureComponent) {
  _inherits(ListContainer, _PureComponent);

  function ListContainer() {
    _classCallCheck(this, ListContainer);

    var _this = _possibleConstructorReturn(this, (ListContainer.__proto__ || Object.getPrototypeOf(ListContainer)).call(this));

    _this.state = {
      left: 0
    };

    _this.easing = function (distance) {
      var t = distance;
      var b = 0;
      var d = _this.props.screenWidth; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };

    _this.handleStart = function () {
      // console.info("ListContainer handleStart")
      _this.startLeft = _this.state.left;
      _this.startTime = new Date().getTime();
      _this.isNeedSpring = false;
    };

    _this.handleMove = function (diffX) {
      // console.info("ListContainer handleStart diffX = %s",diffX);
      var nDiffx = diffX;
      // 限制最大 diffx 值
      if (Math.abs(nDiffx) > _this.props.screenWidth) {
        if (nDiffx < 0) {
          nDiffx = -_this.props.screenWidth;
        }
        if (nDiffx > 0) {
          nDiffx = _this.props.screenWidth;
        }
      }

      if (_this.state.left >= 0 && nDiffx > 0) {
        nDiffx = _this.easing(nDiffx);
      } else if (_this.state.left <= -_this.maxLeft && nDiffx < 0) {
        nDiffx = -_this.easing(-nDiffx);
      }

      _this.setState({
        left: _this.startLeft + nDiffx
      });
    };

    _this.handleEnd = function (isAllowChange) {
      var index = void 0;
      var diffTime = new Date().getTime() - _this.startTime;
      console.info('handleEnd %s', isAllowChange, diffTime, _this.state.left, _this.startLeft, _this.props.index);
      // 快速拖动情况下切换图片
      if (isAllowChange && diffTime < DEFAULT_TIME_DIFF) {
        if (_this.state.left < _this.startLeft) {
          index = _this.props.index + 1;
        } else {
          index = _this.props.index - 1;
        }
      } else {
        index = Math.abs(Math.round(_this.state.left / _this.perDistance));
      }

      // 处理边界情况
      if (index < 0) {
        index = 0;
      } else if (index > _this.length - 1) {
        index = _this.length - 1;
      }

      _this.setState({
        left: -_this.perDistance * index
      });
      _this.isNeedSpring = true;
      if (index !== _this.props.index) {
        _this.props.changeIndex(index);
        return true;
      }
      return false;
    };

    _this.isNeedSpring = false;
    return _this;
  }

  _createClass(ListContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          screenWidth = _props.screenWidth,
          urls = _props.urls,
          index = _props.index,
          gap = _props.gap;


      this.length = urls.length;
      this.perDistance = screenWidth + gap;
      this.maxLeft = this.perDistance * (this.length - 1);
      this.isNeedSpring = false;

      this.setState({
        left: -this.perDistance * index
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.index !== nextProps.index) {
        this.isNeedSpring = true;
        this.setState({
          left: -this.perDistance * nextProps.index
        });
      }
    }

    /**
     * 拖拽的缓动公式 - easeOutSine
     * Link http://easings.net/zh-cn#
     * t: current time（当前时间）；
     * b: beginning value（初始值）；
     * c: change in value（变化量）；
     * d: duration（持续时间）。
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          maxZoomNum = _props2.maxZoomNum,
          screenWidth = _props2.screenWidth,
          screenHeight = _props2.screenHeight,
          urls = _props2.urls,
          speed = _props2.speed;
      var left = this.state.left;


      var defaultStyle = {};

      if (this.isNeedSpring) {
        var duration = speed + 'ms';
        defaultStyle.WebkitTransitionDuration = duration;
        defaultStyle.transitionDuration = duration;
      }
      var translate = 'translate3d(' + left + 'px, 0, 0)';
      defaultStyle.WebkitTransform = translate;
      defaultStyle.transform = translate;

      return _react2.default.createElement(
        'div',
        {
          className: 'viewer-list-container',
          style: defaultStyle
        },
        urls.map(function (item, i) {
          return _react2.default.createElement(_ImageContainer2.default, {
            key: i // eslint-disable-line
            , src: item,
            maxZoomNum: maxZoomNum,
            handleStart: _this2.handleStart,
            handleMove: _this2.handleMove,
            handleEnd: _this2.handleEnd,
            left: _this2.perDistance * i,
            screenWidth: screenWidth,
            screenHeight: screenHeight
          });
        })
      );
    }
  }]);

  return ListContainer;
}(_react.PureComponent);

ListContainer.propTypes = {
  maxZoomNum: _propTypes2.default.number.isRequired,
  changeIndex: _propTypes2.default.func.isRequired,
  gap: _propTypes2.default.number.isRequired,
  speed: _propTypes2.default.number.isRequired // Duration of transition between slides (in ms)
};
exports.default = ListContainer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pointer = function (_PureComponent) {
  _inherits(Pointer, _PureComponent);

  function Pointer() {
    _classCallCheck(this, Pointer);

    return _possibleConstructorReturn(this, (Pointer.__proto__ || Object.getPrototypeOf(Pointer)).apply(this, arguments));
  }

  _createClass(Pointer, [{
    key: 'render',
    value: function render() {
      console.info("Point render");

      var _props = this.props,
          length = _props.length,
          changeIndex = _props.changeIndex,
          index = _props.index;


      var i = 0,
          items = [];
      for (i; i < length; i++) {
        if (i === index) {
          items.push(_react2.default.createElement('span', { onClick: changeIndex.bind(null, i), key: i, className: 'pointer on' }));
        } else {
          items.push(_react2.default.createElement('span', { onClick: changeIndex.bind(null, i), key: i, className: 'pointer' }));
        }
      }

      return _react2.default.createElement(
        'div',
        { className: 'viewer-image-pointer' },
        items
      );
    }
  }]);

  return Pointer;
}(_react.PureComponent);

Pointer.propTypes = {
  length: _propTypes2.default.number.isRequired,
  index: _propTypes2.default.number.isRequired,
  changeIndex: _propTypes2.default.func
};
exports.default = Pointer;
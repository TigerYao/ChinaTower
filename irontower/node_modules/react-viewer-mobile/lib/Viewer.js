'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _ViewerCore = require('./ViewerCore');

var _ViewerCore2 = _interopRequireDefault(_ViewerCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Viewer = function (_React$Component) {
    (0, _inherits3.default)(Viewer, _React$Component);

    function Viewer() {
        (0, _classCallCheck3.default)(this, Viewer);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));

        _this.container = null;
        _this.component = null;
        return _this;
    }

    Viewer.prototype.renderViewer = function renderViewer() {
        if (this.props.visible || this.component) {
            if (!this.container) {
                this.container = document.createElement('div');
                document.body.appendChild(this.container);
            }
            var instance = this;
            ReactDOM.unstable_renderSubtreeIntoContainer(this, React.createElement(_ViewerCore2.default, this.props), this.container, function () {
                instance.component = this;
            });
        }
    };

    Viewer.prototype.removeViewer = function removeViewer() {
        if (this.container) {
            var container = this.container;
            ReactDOM.unmountComponentAtNode(container);
            container.parentNode.removeChild(container);
            this.container = null;
            this.component = null;
        }
    };

    Viewer.prototype.componentWillUnmount = function componentWillUnmount() {
        this.removeViewer();
    };

    Viewer.prototype.componentDidMount = function componentDidMount() {
        this.renderViewer();
    };

    Viewer.prototype.componentDidUpdate = function componentDidUpdate() {
        this.renderViewer();
    };

    Viewer.prototype.render = function render() {
        return null;
    };

    return Viewer;
}(React.Component);

exports.default = Viewer;
module.exports = exports['default'];
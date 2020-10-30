"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _emit = _interopRequireDefault(require("./event/emit"));

var _controller = _interopRequireDefault(require("./event/controller"));

var _canvasElement = _interopRequireDefault(require("./canvas-element"));

var _common = require("../util/common");

var _container = _interopRequireDefault(require("./container"));

var _group = _interopRequireDefault(require("./group"));

var _requestAnimationFrame = require("./util/requestAnimationFrame");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Canvas = /*#__PURE__*/function (_EventEmit) {
  _inheritsLoose(Canvas, _EventEmit);

  var _proto = Canvas.prototype;

  _proto.get = function get(name) {
    return this._attrs[name];
  };

  _proto.set = function set(name, value) {
    this._attrs[name] = value;
  };

  function Canvas(cfg) {
    var _this;

    _this = _EventEmit.call(this) || this;
    _this._attrs = (0, _common.mix)({
      type: 'canvas',
      children: []
    }, cfg);

    _this._initPixelRatio();

    _this._initCanvas();

    return _this;
  }

  _proto._initPixelRatio = function _initPixelRatio() {
    var pixelRatio = this.get('pixelRatio');

    if (!pixelRatio) {
      this.set('pixelRatio', (0, _common.getPixelRatio)());
    }
  };

  _proto.beforeDraw = function beforeDraw() {
    var context = this._attrs.context;
    var el = this._attrs.el;
    context && context.clearRect && context.clearRect(0, 0, el.width, el.height);
  };

  _proto._initCanvas = function _initCanvas() {
    var self = this;
    var el = self.get('el');
    var context = self.get('context');

    if (!el && !context) {
      throw new Error('Please specify the id, el or context of the chart!');
    }

    var canvas;

    if (el) {
      // DOMElement or String
      canvas = (0, _common.isString)(el) ? (0, _common.getDomById)(el) : el;
    } else {
      // 说明没有指定el
      canvas = _canvasElement["default"].create(context);
    }

    if (context && canvas && !canvas.getContext) {
      canvas.getContext = function () {
        return context;
      };
    }

    var width = self.get('width');

    if (!width) {
      width = (0, _common.getWidth)(canvas);
    }

    var height = self.get('height');

    if (!height) {
      height = (0, _common.getHeight)(canvas);
    }

    self.set('canvas', this);
    self.set('el', canvas);
    self.set('context', context || canvas.getContext('2d'));
    self.changeSize(width, height); // 初始化事件控制器

    var eventController = new _controller["default"]({
      canvas: this,
      el: canvas
    });
    self.set('eventController', eventController);
  };

  _proto.changeSize = function changeSize(width, height) {
    var pixelRatio = this.get('pixelRatio');
    var canvasDOM = this.get('el'); // HTMLCanvasElement or canvasElement
    // 浏览器环境设置style样式

    if (canvasDOM.style) {
      canvasDOM.style.width = width + 'px';
      canvasDOM.style.height = height + 'px';
    }

    if ((0, _common.isCanvasElement)(canvasDOM)) {
      canvasDOM.width = width * pixelRatio;
      canvasDOM.height = height * pixelRatio;

      if (pixelRatio !== 1) {
        var ctx = this.get('context');
        ctx.scale(pixelRatio, pixelRatio);
      }
    }

    this.set('width', width);
    this.set('height', height);
  };

  _proto.getWidth = function getWidth() {
    var pixelRatio = this.get('pixelRatio');
    var width = this.get('width');
    return width * pixelRatio;
  };

  _proto.getHeight = function getHeight() {
    var pixelRatio = this.get('pixelRatio');
    var height = this.get('height');
    return height * pixelRatio;
  };

  _proto.getPointByClient = function getPointByClient(clientX, clientY) {
    var el = this.get('el');
    var bbox = el.getBoundingClientRect();
    var width = bbox.right - bbox.left;
    var height = bbox.bottom - bbox.top;
    return {
      x: (clientX - bbox.left) * (el.width / width),
      y: (clientY - bbox.top) * (el.height / height)
    };
  };

  _proto._beginDraw = function _beginDraw() {
    this._attrs.toDraw = true;
  };

  _proto._endDraw = function _endDraw() {
    this._attrs.toDraw = false;
  };

  _proto.draw = function draw() {
    var self = this;

    function drawInner() {
      self.set('animateHandler', (0, _requestAnimationFrame.requestAnimationFrame)(function () {
        self.set('animateHandler', undefined);

        if (self.get('toDraw')) {
          drawInner();
        }
      }));
      self.beforeDraw();

      try {
        var context = self._attrs.context;
        self.drawInner(context); // 支付宝，微信小程序，需要调context.draw才能完成绘制， 所以这里直接判断是否有.draw方法

        if (context.draw) {
          context.draw();
        }
      } catch (ev) {
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);

        self._endDraw();
      }

      self._endDraw();
    }

    if (self.get('destroyed')) {
      return;
    }

    if (self.get('animateHandler')) {
      this._beginDraw();
    } else {
      drawInner();
    }
  };

  _proto.destroy = function destroy() {
    if (this.get('destroyed')) {
      return;
    } // 需要清理 canvas 画布内容，否则会导致 spa 应用 ios 下 canvas 白屏
    // https://stackoverflow.com/questions/52532614/total-canvas-memory-use-exceeds-the-maximum-limit-safari-12
    // https://github.com/antvis/F2/issues/630


    var el = this.get('el');
    el.width = 0;
    el.height = 0;
    this.clear();
    this._attrs = {};
    this.set('destroyed', true);
  };

  _proto.isDestroyed = function isDestroyed() {
    return this.get('destroyed');
  };

  return Canvas;
}(_emit["default"]);

(0, _common.mix)(Canvas.prototype, _container["default"], {
  getGroupClass: function getGroupClass() {
    return _group["default"];
  }
});
var _default = Canvas;
exports["default"] = _default;
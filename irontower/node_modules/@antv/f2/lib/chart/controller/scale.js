"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _scale = require("../../scale");

var _common = require("../../util/common");

var _global = _interopRequireDefault(require("../../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isFullCircle(coord) {
  if (!coord.isPolar) {
    return false;
  }

  var startAngle = coord.startAngle;
  var endAngle = coord.endAngle;

  if (!(0, _common.isNil)(startAngle) && !(0, _common.isNil)(endAngle) && endAngle - startAngle < Math.PI * 2) {
    return false;
  }

  return true;
}

function clearObj(obj) {
  Object.keys(obj).forEach(function (key) {
    delete obj[key];
  });
}

var ScaleController = /*#__PURE__*/function () {
  function ScaleController(cfg) {
    // defs 列定义
    this.defs = {}; // 已经实例化的scale

    this.scales = {};
    (0, _common.mix)(this, cfg);
  }

  var _proto = ScaleController.prototype;

  _proto.setFieldDef = function setFieldDef(field, cfg) {
    var defs = this.defs;

    if ((0, _common.isObject)(field)) {
      (0, _common.mix)(defs, field);
    } else {
      defs[field] = cfg;
    } // 因为可能同时变更多个scale，所以要把所有已实例化的scale都更新下


    this.updateScales();
  };

  _proto._getDef = function _getDef(field) {
    var defs = this.defs;
    var def = null;

    if (_global["default"].scales[field] || defs[field]) {
      def = (0, _common.mix)({}, _global["default"].scales[field]);
      (0, _common.each)(defs[field], function (v, k) {
        if ((0, _common.isNil)(v)) {
          delete def[k];
        } else {
          def[k] = v;
        }
      });
    }

    return def;
  };

  _proto._getDefaultType = function _getDefaultType(field, data, def) {
    if (def && def.type) {
      return def.type;
    }

    var type = 'linear';

    var value = _common.Array.firstValue(data, field);

    if ((0, _common.isArray)(value)) {
      value = value[0];
    }

    if ((0, _common.isString)(value)) {
      type = 'cat';
    }

    return type;
  };

  _proto._getScaleDef = function _getScaleDef(type, field, data, def) {
    var values;

    if (def && def.values) {
      values = def.values;
    } else {
      values = _common.Array.values(data, field);
    }

    var cfg = {
      field: field,
      values: values
    };

    if (type !== 'cat' && type !== 'timeCat') {
      if (!def || !(def.min && def.max)) {
        var _Array$getRange = _common.Array.getRange(values),
            min = _Array$getRange.min,
            max = _Array$getRange.max;

        cfg.min = min;
        cfg.max = max;
        cfg.nice = true;
      }
    } else {
      cfg.isRounding = false; // used for tickCount calculation
    }

    return cfg;
  } // 调整range，为了让图形居中
  ;

  _proto._adjustRange = function _adjustRange(type, cfg) {
    var range = cfg.range,
        values = cfg.values; // 如果是线性, 或者有自定义range都不处理

    if (type === 'linear' || range || !values) {
      return cfg;
    }

    var count = values.length; // 单只有一条数据时，在中间显示

    if (count === 1) {
      cfg.range = [0.5, 1];
    } else {
      var chart = this.chart;
      var coord = chart.get('coord');
      var widthRatio = _global["default"].widthRatio.multiplePie;
      var offset = 0;

      if (isFullCircle(coord)) {
        if (!coord.transposed) {
          cfg.range = [0, 1 - 1 / count];
        } else {
          offset = 1 / count * widthRatio;
          cfg.range = [offset / 2, 1 - offset / 2];
        }
      } else {
        // 为了让图形居中，所以才设置range
        offset = 1 / count * 0.5; // 这里可能用0.25会更合理

        cfg.range = [offset, 1 - offset];
      }
    }

    return cfg;
  };

  _proto._getScaleCfg = function _getScaleCfg(field, data) {
    var self = this;

    var def = self._getDef(field);

    if (!data || !data.length) {
      if (def && def.type) {
        def.field = field;
        return {
          type: def.type,
          cfg: def
        };
      }

      return {
        type: 'identity',
        cfg: {
          value: field,
          field: field.toString(),
          values: [field]
        }
      };
    }

    var firstObj = data[0];
    var firstValue = firstObj[field];

    if (firstValue === null) {
      firstValue = _common.Array.firstValue(data, field);
    }

    if ((0, _common.isNumber)(field) || (0, _common.isNil)(firstValue) && !def) {
      return {
        type: 'identity',
        cfg: {
          value: field,
          field: field.toString(),
          values: [field]
        }
      };
    }

    var type = self._getDefaultType(field, data, def);

    var cfg = self._getScaleDef(type, field, data, def);

    def && (0, _common.mix)(cfg, def);
    cfg = this._adjustRange(type, cfg);
    return {
      type: type,
      cfg: cfg
    };
  };

  _proto.createScale = function createScale(field, data) {
    var scales = this.scales;

    var _this$_getScaleCfg = this._getScaleCfg(field, data),
        type = _this$_getScaleCfg.type,
        cfg = _this$_getScaleCfg.cfg;

    var scale = scales[field]; // 如果已经存在，且类型相等时直接返回

    if (scale && scale.type === type) {
      scale.change(cfg);
      return scale;
    }

    var Scale = (0, _scale.getScale)(type);
    var newScale = new Scale(cfg);
    scales[field] = newScale;
    return newScale;
  };

  _proto._updateScale = function _updateScale(scale) {
    var field = scale.field; // 因为每个field的数据都会不同

    var data = this.chart._getScaleData(field);

    var _this$_getScaleCfg2 = this._getScaleCfg(field, data),
        cfg = _this$_getScaleCfg2.cfg;

    scale.change(cfg);
  };

  _proto.updateScales = function updateScales() {
    var _this = this;

    var scales = this.scales; // 修改完列定义后，需要更新已经实例化的scale
    // 如果是还没有实例化的，在geom初始化的时候会被实例化，所以这里可以不用更新

    (0, _common.each)(scales, function (scale) {
      _this._updateScale(scale);
    });
  } // 调整scale从0开始
  ;

  _proto.adjustStartZero = function adjustStartZero(scale) {
    var defs = this.defs;
    var field = scale.field,
        min = scale.min,
        max = scale.max; // 如果有定义，则不处理

    if (defs[field] && defs[field].min) {
      return;
    }

    if (min > 0) {
      scale.change({
        min: 0
      });
    } else if (max < 0) {
      scale.change({
        max: 0
      });
    }
  };

  _proto.clear = function clear() {
    // this.defs = {};
    // this.scales = {};
    clearObj(this.defs);
    clearObj(this.scales);
    this.data = null;
  };

  return ScaleController;
}();

var _default = ScaleController;
exports["default"] = _default;
import { getScale } from '../../scale';
import { isNil, mix, isObject, each, isArray, isString, isNumber, Array } from '../../util/common';
import Global from '../../global';

function isFullCircle(coord) {
  if (!coord.isPolar) {
    return false;
  }

  var startAngle = coord.startAngle;
  var endAngle = coord.endAngle;

  if (!isNil(startAngle) && !isNil(endAngle) && endAngle - startAngle < Math.PI * 2) {
    return false;
  }

  return true;
}

function clearObj(obj) {
  Object.keys(obj).forEach(function (key) {
    delete obj[key];
  });
}

class ScaleController {
  constructor(cfg) {
    // defs 列定义
    this.defs = {}; // 已经实例化的scale

    this.scales = {};
    mix(this, cfg);
  }

  setFieldDef(field, cfg) {
    var {
      defs
    } = this;

    if (isObject(field)) {
      mix(defs, field);
    } else {
      defs[field] = cfg;
    } // 因为可能同时变更多个scale，所以要把所有已实例化的scale都更新下


    this.updateScales();
  }

  _getDef(field) {
    var defs = this.defs;
    var def = null;

    if (Global.scales[field] || defs[field]) {
      def = mix({}, Global.scales[field]);
      each(defs[field], function (v, k) {
        if (isNil(v)) {
          delete def[k];
        } else {
          def[k] = v;
        }
      });
    }

    return def;
  }

  _getDefaultType(field, data, def) {
    if (def && def.type) {
      return def.type;
    }

    var type = 'linear';
    var value = Array.firstValue(data, field);

    if (isArray(value)) {
      value = value[0];
    }

    if (isString(value)) {
      type = 'cat';
    }

    return type;
  }

  _getScaleDef(type, field, data, def) {
    var values;

    if (def && def.values) {
      values = def.values;
    } else {
      values = Array.values(data, field);
    }

    var cfg = {
      field,
      values
    };

    if (type !== 'cat' && type !== 'timeCat') {
      if (!def || !(def.min && def.max)) {
        var {
          min,
          max
        } = Array.getRange(values);
        cfg.min = min;
        cfg.max = max;
        cfg.nice = true;
      }
    } else {
      cfg.isRounding = false; // used for tickCount calculation
    }

    return cfg;
  } // 调整range，为了让图形居中


  _adjustRange(type, cfg) {
    var {
      range,
      values
    } = cfg; // 如果是线性, 或者有自定义range都不处理

    if (type === 'linear' || range || !values) {
      return cfg;
    }

    var count = values.length; // 单只有一条数据时，在中间显示

    if (count === 1) {
      cfg.range = [0.5, 1];
    } else {
      var {
        chart
      } = this;
      var coord = chart.get('coord');
      var widthRatio = Global.widthRatio.multiplePie;
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
  }

  _getScaleCfg(field, data) {
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
      firstValue = Array.firstValue(data, field);
    }

    if (isNumber(field) || isNil(firstValue) && !def) {
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

    def && mix(cfg, def);
    cfg = this._adjustRange(type, cfg);
    return {
      type,
      cfg
    };
  }

  createScale(field, data) {
    var {
      scales
    } = this;

    var {
      type,
      cfg
    } = this._getScaleCfg(field, data);

    var scale = scales[field]; // 如果已经存在，且类型相等时直接返回

    if (scale && scale.type === type) {
      scale.change(cfg);
      return scale;
    }

    var Scale = getScale(type);
    var newScale = new Scale(cfg);
    scales[field] = newScale;
    return newScale;
  }

  _updateScale(scale) {
    var {
      field
    } = scale; // 因为每个field的数据都会不同

    var data = this.chart._getScaleData(field);

    var {
      cfg
    } = this._getScaleCfg(field, data);

    scale.change(cfg);
  }

  updateScales() {
    var _this = this;

    var {
      scales
    } = this; // 修改完列定义后，需要更新已经实例化的scale
    // 如果是还没有实例化的，在geom初始化的时候会被实例化，所以这里可以不用更新

    each(scales, function (scale) {
      _this._updateScale(scale);
    });
  } // 调整scale从0开始


  adjustStartZero(scale) {
    var {
      defs
    } = this;
    var {
      field,
      min,
      max
    } = scale; // 如果有定义，则不处理

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
  }

  clear() {
    // this.defs = {};
    // this.scales = {};
    clearObj(this.defs);
    clearObj(this.scales);
    this.data = null;
  }

}

export default ScaleController;
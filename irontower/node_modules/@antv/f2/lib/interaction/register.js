"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _chart = _interopRequireDefault(require("../chart/chart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_chart["default"]._Interactions = {};

_chart["default"].registerInteraction = function (type, constructor) {
  _chart["default"]._Interactions[type] = constructor;
};

_chart["default"].getInteraction = function (type) {
  return _chart["default"]._Interactions[type];
};

_chart["default"].prototype.interaction = function (type, cfg) {
  var interactions = this._interactions || {};

  if (interactions[type]) {
    // if reprated, destroy last
    interactions[type].destroy();
  }

  var Ctor = _chart["default"].getInteraction(type);

  var interact = new Ctor(cfg, this);
  interactions[type] = interact;
  this._interactions = interactions;
  return this;
};

_chart["default"].prototype.clearInteraction = function (type) {
  var interactions = this._interactions;
  if (!interactions) return;

  if (type) {
    interactions[type] && interactions[type].destroy();
    delete interactions[type];
  } else {
    (0, _common.each)(interactions, function (interaction, key) {
      interaction.destroy();
      delete interactions[key];
    });
  }

  return this;
};

var _default = _chart["default"];
exports["default"] = _default;
"use strict";

exports.__esModule = true;
exports._bindPress = _bindPress;
exports.reset = reset;
exports._handlePress = _handlePress;

var _common = require("../../util/common");

function _bindPress() {
  var chart = this.chart,
      hammer = this.hammer,
      el = this.el,
      pressThreshold = this.pressThreshold,
      pressTime = this.pressTime;
  var tooltipController = chart.get('tooltipController');

  if (tooltipController && tooltipController.enable) {
    chart.set('_closeTooltip', true); // 用于交互的特殊标示量

    if (hammer) {
      hammer.get('press').set({
        threshold: pressThreshold,
        time: pressTime
      });
      hammer.on('press', (0, _common.wrapBehavior)(this, '_handlePress'));
    } else {
      (0, _common.addEventListener)(el, 'press', (0, _common.wrapBehavior)(this, '_handlePress'));
    }
  }
}

function reset() {
  var chart = this.chart;
  var tooltipController = chart.get('tooltipController');

  if (tooltipController) {
    this.pressed = false;
    !tooltipController.cfg.alwaysShow && chart.hideTooltip();
    chart.set('_closeTooltip', true); // 用于交互的特殊标示量
  }
}

function _handlePress(e) {
  this.pressed = true;
  var center = e.center || e.touches[0];
  this.chart.set('_closeTooltip', false); // 用于交互的特殊标示量

  this.chart.showTooltip(center);
}
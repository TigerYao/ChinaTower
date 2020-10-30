import { requestAnimationFrame } from '../util/requestAnimationFrame';
var clock = typeof performance === 'object' && performance.now ? performance : Date;

class Timeline {
  constructor() {
    this.anims = [];
    this.time = null;
    this.playing = false;
    this.canvas = [];
  }

  play() {
    var self = this;
    self.time = clock.now();
    self.playing = true;

    function step() {
      if (self.playing) {
        requestAnimationFrame(step);
        self.update();
      }
    }

    requestAnimationFrame(step);
  }

  stop() {
    this.playing = false;
    this.time = null;
    this.canvas = [];
  }

  pushAnim(animInfo) {
    this.anims.push(animInfo);

    if (this.playing) {
      return;
    }

    this.play();
  }

  update() {
    var currentTime = clock.now();
    this.canvas = [];

    if (!this.anims.length) {
      this.stop();
      return;
    }

    for (var i = 0; i < this.anims.length; i++) {
      var propertyAnim = this.anims[i];

      if (currentTime < propertyAnim.startTime || propertyAnim.hasEnded) {
        continue;
      }

      var shape = propertyAnim.shape; // shape

      if (shape.get('destroyed')) {
        this.anims.splice(i, 1);
        i--;
        continue;
      }

      var {
        startState,
        endState,
        interpolate,
        duration
      } = propertyAnim;

      if (currentTime >= propertyAnim.startTime && !propertyAnim.hasStarted) {
        propertyAnim.hasStarted = true;

        if (propertyAnim.onStart) {
          propertyAnim.onStart();
        }
      }

      var t = (currentTime - propertyAnim.startTime) / duration;
      t = Math.max(0, Math.min(t, 1));
      t = propertyAnim.easing(t);

      if (propertyAnim.onFrame) {
        propertyAnim.onFrame(t);
      } else {
        for (var key in interpolate) {
          var diff = interpolate[key];
          var value = diff(t);
          var newValue = void 0;

          if (key === 'points') {
            newValue = [];
            var aLen = Math.max(startState.points.length, endState.points.length);

            for (var j = 0; j < aLen; j += 2) {
              newValue.push({
                x: value[j],
                y: value[j + 1]
              });
            }
          } else {
            newValue = value;
          }

          shape._attrs.attrs[key] = newValue;
          shape._attrs.bbox = null; // should clear calculated bbox
        }
      }

      var canvas = shape.get('canvas');

      if (this.canvas.indexOf(canvas) === -1) {
        this.canvas.push(canvas);
      }

      if (propertyAnim.onUpdate) {
        propertyAnim.onUpdate(t);
      }

      if (currentTime >= propertyAnim.endTime && !propertyAnim.hasEnded) {
        propertyAnim.hasEnded = true;

        if (propertyAnim.onEnd) {
          propertyAnim.onEnd();
        }
      }

      if (t === 1) {
        // end
        this.anims.splice(i, 1);
        i--;
      }
    }

    this.canvas.map(function (c) {
      c.draw();
      return c;
    });
    this.time = clock.now();
  }

}

export default Timeline;
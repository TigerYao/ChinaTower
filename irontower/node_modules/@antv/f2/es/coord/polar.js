import Base from './base';
import Vector2 from '../graphic/util/vector2';
import Matrix from '../graphic/util/matrix';

class Polar extends Base {
  _initDefaultCfg() {
    this.type = 'polar';
    this.startAngle = -Math.PI / 2;
    this.endAngle = Math.PI * 3 / 2;
    this.inner = 0;
    this.innerRadius = 0; // alias

    this.isPolar = true;
    this.transposed = false;
    this.center = null;
    this.radius = null; // relative, 0 ~ 1
  }

  init(start, end) {
    super.init(start, end);
    var self = this;
    var inner = self.inner || self.innerRadius;
    var width = Math.abs(end.x - start.x);
    var height = Math.abs(end.y - start.y);
    var maxRadius;
    var center;

    if (self.startAngle === -Math.PI && self.endAngle === 0) {
      maxRadius = Math.min(width / 2, height);
      center = {
        x: (start.x + end.x) / 2,
        y: start.y
      };
    } else {
      maxRadius = Math.min(width, height) / 2;
      center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };
    }

    var radius = self.radius;

    if (radius > 0 && radius <= 1) {
      maxRadius = maxRadius * radius;
    }

    this.x = {
      start: self.startAngle,
      end: self.endAngle
    };
    this.y = {
      start: maxRadius * inner,
      end: maxRadius
    };
    this.center = center;
    this.circleRadius = maxRadius; // the radius value in px
  }

  _convertPoint(point) {
    var self = this;
    var center = self.center;
    var transposed = self.transposed;
    var xDim = transposed ? 'y' : 'x';
    var yDim = transposed ? 'x' : 'y';
    var x = self.x;
    var y = self.y;
    var angle = x.start + (x.end - x.start) * point[xDim];
    var radius = y.start + (y.end - y.start) * point[yDim];
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  }

  _invertPoint(point) {
    var self = this;
    var {
      center,
      transposed,
      x,
      y
    } = self;
    var xDim = transposed ? 'y' : 'x';
    var yDim = transposed ? 'x' : 'y';
    var m = [1, 0, 0, 1, 0, 0];
    Matrix.rotate(m, m, x.start);
    var startV = [1, 0];
    Vector2.transformMat2d(startV, startV, m);
    startV = [startV[0], startV[1]];
    var pointV = [point.x - center.x, point.y - center.y];

    if (Vector2.zero(pointV)) {
      return {
        x: 0,
        y: 0
      };
    }

    var theta = Vector2.angleTo(startV, pointV, x.end < x.start);

    if (Math.abs(theta - Math.PI * 2) < 0.001) {
      theta = 0;
    }

    var l = Vector2.length(pointV);
    var percentX = theta / (x.end - x.start);
    percentX = x.end - x.start > 0 ? percentX : -percentX;
    var percentY = (l - y.start) / (y.end - y.start);
    var rst = {};
    rst[xDim] = percentX;
    rst[yDim] = percentY;
    return rst;
  }

}

Base.Polar = Polar;
export default Polar;
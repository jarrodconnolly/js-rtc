const Helpers = require('./helpers');

class Intersect {
  static intersection(t, shape) {
    return {
      t: t,
      object: shape,
    };
  }

  static intersections(...rest) {
    return rest;
  }

  static hit(xs) {
    return xs.filter((i) => i.t >= 0).sort((a, b) => a.t - b.t)[0];
  }

  /**
   *
   * @param {Object} intersection
   * @param {Ray} ray
   * @param {Array} xs
   */
  static prepareComputations(intersection, ray, xs = [intersection]) {
    const comps = {};

    if (process.env.DEBUG === 'true') {
      console.log('Intersections:');
      xs.forEach((x) => {
        console.log(`t(${x.t}) ior(${x.object.material.refractiveIndex}) ID:${x.object.ID}`);
      });
    }
    comps.t = intersection.t;
    comps.object = intersection.object;
    comps.point = ray.position(comps.t);
    comps.eyev = ray.direction.negate();
    comps.normalv = comps.object.normalAt(comps.point);
    if (comps.normalv.dotProduct(comps.eyev) < 0) {
      comps.inside = true;
      comps.normalv = comps.normalv.negate();
    } else {
      comps.inside = false;
    }
    comps.reflectv = ray.direction.reflect(comps.normalv);
    comps.overPoint = comps.point.add(comps.normalv.multiply(Helpers.EPSILON));
    comps.underPoint = comps.point.subtract(comps.normalv.multiply(Helpers.EPSILON));
    const containers = [];
    for (let n = 0; n < xs.length; n++) {
      const i = xs[n];
      if (i === intersection) {
        if (containers.length === 0) {
          comps.n1 = 1.0;
        } else {
          comps.n1 = containers[containers.length - 1].material.refractiveIndex;
        }
      }
      const objectIndex = containers.indexOf(i.object);
      if (objectIndex !== -1) {
        containers.splice(objectIndex, 1);
      } else {
        containers.push(i.object);
      }
      if (i === intersection) {
        if (containers.length === 0) {
          comps.n2 = 1.0;
        } else {
          comps.n2 = containers[containers.length - 1].material.refractiveIndex;
        }
        break;
      }
    }
    return comps;
  }

  static schlick(comps) {
    let cos = comps.eyev.dotProduct(comps.normalv);
    if (comps.n1 > comps.n2) {
      const n = comps.n1 / comps.n2;
      const sin2T = (n ** 2) * (1.0 - cos ** 2);
      if (sin2T > 1.0) {
        return 1.0;
      }

      const cosT = Math.sqrt(1.0 - sin2T);
      cos = cosT;
    }
    const r0 = ((comps.n1 - comps.n2) / (comps.n1 + comps.n2)) ** 2;
    return r0 + (1 - r0) * (1 - cos) ** 5;
  }
}

module.exports = Intersect;

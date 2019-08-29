class Intersect {
  static intersection(t, shape) {
    return {
      t: t,
      object: shape,
    };
  }

  static intersections(...rest) {
    return rest.filter((i) => i.t >= 0);
  }

  static hit(xs) {
    return xs.sort((a, b) => a.t - b.t)[0];
  }

  /**
   *
   * @param {Object} intersection
   * @param {Ray} ray
   * @param {Array} xs
   */
  static prepareComputations(intersection, ray, xs = [intersection]) {
    const comps = {};
    comps.t = intersection.t;
    comps.object = intersection.object;
    comps.point = ray.position(comps.t);
    comps.eyev = ray.direction.negate();
    comps.normalv = comps.object.normalAt(comps.point);
    if (comps.normalv.dotProduct(comps.eyev) < 0) {
      comps.inside = true;
      comps.normalv = comps.normalv.multiply(-1);
    } else {
      comps.inside = false;
    }
    comps.reflectv = ray.direction.reflect(comps.normalv);
    // TODO: something up here. book says * EPSILON ? I had to * 20000
    // I see examples using 0.000001 here for EPSILON
    comps.overPoint = comps.point.add(comps.normalv.multiply(Number.EPSILON * 20000));

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
}

module.exports = Intersect;

const Intersect = require('./intersect');
const Colour = require('./colour');
const Ray = require('./ray');

class World {
  constructor(light, objects) {
    this.objects = objects || [];
    this.light = light;
    this.shadowEnabled = true;
  }

  intersectWorld(ray) {
    const xs = [];
    this.objects.forEach((o) => {
      const xso = o.intersect(ray);
      xs.push(...xso);
    });
    return Intersect.intersections(...xs).sort((a, b) => a.t - b.t);
  }

  /**
   *
   * @param comps
   * @param {Number} remaining
   * @return {Colour}
   */
  shadeHit(comps, remaining) {
    const shadowed = this.shadowEnabled && this.isShadowed(comps.overPoint);
    const surface = comps.object.material.lighting(
      comps.object,
      this.light,
      comps.overPoint,
      comps.eyev,
      comps.normalv,
      shadowed
    );
    const reflected = this.reflectedColour(comps, remaining);
    return surface.add(reflected);
  }

  /**
   *
   * @param {Ray} ray
   * @param {Number} remaining
   * @return {Colour}
   */
  colourAt(ray, remaining) {
    const xs = this.intersectWorld(ray);
    const hit = xs[0];
    if (!hit) {
      return new Colour(0, 0, 0);
    }
    const comps = Intersect.prepareComputations(xs[0], ray, xs);
    return this.shadeHit(comps, remaining);
  }

  isShadowed(point) {
    const v = this.light.position.subtract(point);
    const distance = v.magnitude();
    const direction = v.normalize();

    const r = new Ray(point, direction);
    const xs = this.intersectWorld(r);

    const h = Intersect.hit(xs);
    if (h && h.t < distance) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param comps
   * @param {Number} remaining
   * @return {Colour}
   */
  reflectedColour(comps, remaining) {
    if (remaining <= 0) {
      return Colour.black();
    }
    if (comps.object.material.reflective === 0) {
      return Colour.black();
    }

    const reflectRay = new Ray(comps.overPoint, comps.reflectv);
    const remainingReflections = remaining - 1;
    const colour = this.colourAt(reflectRay, remainingReflections);

    return colour.multiply(comps.object.material.reflective);
  }
}

module.exports = World;

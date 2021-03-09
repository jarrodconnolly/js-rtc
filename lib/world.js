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
    //return Intersect.intersections(...xs).filter((i) => i.t >= 0).sort((a, b) => a.t - b.t);
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

    let reflected = this.reflectedColour(comps, remaining);
    let refracted = this.refractedColour(comps, remaining);

    if (comps.object.material.reflective > 0 && comps.object.material.transparency > 0) {
      const reflectance = Intersect.schlick(comps);
      reflected = reflected.multiply(reflectance);
      refracted = refracted.multiply(1 - reflectance);
    }
    return surface.add(reflected).add(refracted);
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
    const colour = this.colourAt(reflectRay, remaining - 1);

    return colour.multiply(comps.object.material.reflective);
  }

  refractedColour(comps, remaining) {
    if (remaining <= 0) {
      return Colour.black();
    }

    if (comps.object.material.transparency === 0) {
      return Colour.black();
    }

    const nRatio = comps.n1 / comps.n2;
    const cosI = comps.eyev.dotProduct(comps.normalv);
    const sin2T = (nRatio ** 2) * (1 - cosI ** 2);
    if (sin2T > 1) {
      return Colour.black();
    }

    const cosT = Math.sqrt(1.0 - sin2T);
    const direction = comps.normalv.multiply(nRatio * cosI - cosT).subtract(comps.eyev.multiply(nRatio));
    const refractRay = new Ray(comps.underPoint, direction);
    const refractedColour = this.colourAt(refractRay, remaining - 1).multiply(comps.object.material.transparency);

    if (process.env.DEBUG === 'true') {
      console.log(`\n== remaining ${remaining} ==`);
      console.log(`object: ${comps.object.ID}`);
      console.log(`n1: ${comps.n1}`);
      console.log(`n2: ${comps.n2}`);
      console.log(`eyev: v(${comps.eyev.x.toFixed(4)},${comps.eyev.y.toFixed(4)},${comps.eyev.z.toFixed(4)})`);
      console.log(`normalv: v(${comps.normalv.x.toFixed(4)},${comps.normalv.y.toFixed(4)},${comps.normalv.z.toFixed(4)})`);
      console.log(`under point: p(${comps.underPoint.x.toFixed(4)},${comps.underPoint.y.toFixed(4)},${comps.underPoint.z.toFixed(4)})`);
      console.log(`n_ratio: ${nRatio}`);
      console.log(`cos_i: ${cosI}`);
      console.log(`sin2_t: ${sin2T}`);
      console.log(`cos_t: ${cosT}`);
      console.log(`refract direction: v(${direction.x.toFixed(4)},${direction.y.toFixed(4)},${direction.z.toFixed(4)})`);
      console.log(`refracted color: v(${refractedColour.r.toFixed(4)},${refractedColour.g.toFixed(4)},${refractedColour.b.toFixed(4)})`);
    }
    return refractedColour;
  }
}

module.exports = World;

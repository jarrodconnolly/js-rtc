const Colour = require('./colour');

class Material {
  constructor(colour = new Colour(1, 1, 1), ambient = 0.1, diffuse = 0.9, specular = 0.9, shininess = 200.0) {
    this.colour = colour;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }

  lighting(light, point, eyev, normalv) {
    // combine the surface color with the light's color/intensity
    const effectiveColour = this.colour.multiply(light.intensity);

    // find the direction to the light source
    const lightv = light.position.subtract(point).normalize();

    // compute the ambient contribution
    const ambient = effectiveColour.multiply(this.ambient);

    // light_dot_normal represents the cosine of the angle between the
    // light vector and the normal vector. A negative number means the
    // light is on the other side of the surface.
    let diffuse;
    let specular;
    const lightDotNormal = lightv.dotProduct(normalv);
    if (lightDotNormal < 0) {
      diffuse = new Colour(0, 0, 0);
      specular = new Colour(0, 0, 0);
    } else {
      // compute the diffuse contribution
      diffuse = effectiveColour.multiply(this.diffuse).multiply(lightDotNormal);

      // reflect_dot_eye represents the cosine of the angle between the
      // reflection vector and the eye vector. A negative number means the
      // light reflects away from the eye.
      const reflectv = lightv.multiply(-1).reflect(normalv);
      const reflectDotEye = reflectv.dotProduct(eyev);
      if (reflectDotEye <= 0) {
        specular = new Colour(0, 0, 0);
      } else {
        // compute the specular contribution
        const factor = reflectDotEye ** this.shininess;
        specular = light.intensity.multiply(this.specular).multiply(factor);
      }
    }
    return ambient.add(diffuse).add(specular);
  }
}

module.exports = Material;

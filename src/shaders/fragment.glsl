#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_center;
uniform float u_scale;

#define MAX_ITERATIONS 400
#define MAX_VALUE 4.0

vec2 complex_square(vec2 z) {
  return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

vec3 hsv_to_rgb(vec3 c) {
    vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
    return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
}

// Returns value between 0 and 1
float mandelbrot(vec2 c) {
  float n = 0.0;
  vec2 z = vec2(0.0);
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    z = complex_square(z) + c;
    if (dot(z, z) > MAX_VALUE) break;
    n += 1.0;
  }
  return (n - log2(log2(dot(z, z))) + 4.0) / float(MAX_ITERATIONS);
}

void main() {
  vec2 st = (gl_FragCoord.xy - u_center) * u_scale;
  float mandelbrot_value = mandelbrot(st);
  vec3 hsv_color = vec3(mandelbrot_value, 1.0, 1.0);
  gl_FragColor = vec4(hsv_to_rgb(hsv_color), 1.0);
}

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_center;
uniform float u_scale;

#define MAX_ITERATIONS 800
#define MAX_VALUE 2.0

vec2 complex_product(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 complex_square(vec2 a) {
  return complex_product(a, a);
}

float complex_magnitude(vec2 a) {
  return length(a);
}

vec2 mandelbrot_function(vec2 z, vec2 c) {
  return complex_square(z) + c;
}

vec3 hsv_to_rgb(vec3 c) {
    vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
    return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
}

// Returns value between 0 and 1
float mandelbrot(vec2 c) {
  vec2 accumulator = vec2(0.0);
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    if (complex_magnitude(accumulator) >= MAX_VALUE) return float(i) / float(MAX_ITERATIONS);
    accumulator = mandelbrot_function(accumulator, c);
  }
  return 0.0;
}

void main() {
  // For some reason I need to multiply center by 1.25 but I'm not sure why
  vec2 st = (gl_FragCoord.xy - (u_center * 1.25)) * u_scale;
  float mandelbrot_value = mandelbrot(st);
  vec3 hsv_color = vec3(mandelbrot_value, 1.0, ceil(mandelbrot_value));
  gl_FragColor = vec4(hsv_to_rgb(hsv_color), 1.0);
}

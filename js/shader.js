export const fragmentShaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_center;
uniform float u_scale;

#define MAX_ITERATIONS 400
#define MAX_VALUE 4.0

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

vec3 mandelbrot_color(vec2 start_z, vec2 c) {
  vec2 accumulator = start_z;
  int iterations = 0;
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    iterations = i;
    if (complex_magnitude(accumulator) >= MAX_VALUE) return vec3(float(iterations) / float(MAX_ITERATIONS));
    accumulator = mandelbrot_function(accumulator, c);
  }
  return vec3(0.0);
}

void main() {
  // For some reason I need to multiply center by 1.25 but I'm not sure why
  vec2 st = (gl_FragCoord.xy - (u_center * 1.25)) * u_scale;

  vec3 color = mandelbrot_color(vec2(0.0), st);
  gl_FragColor = vec4(color, 1.0);
}
`;

export const vertexShaderSource = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;


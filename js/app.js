import {
  Scene,
  WebGLRenderer,
  Mesh,
  ShaderMaterial,
  Vector2,
  Camera,
  PlaneBufferGeometry,
} from "../node_modules/three/src/Three.js";
import { fragmentShaderSource, vertexShaderSource } from "./shader.js";

//
const SHADER_SCALE_STEP = 1.05;
const SHADER_START_SCALE = 0.004;

let scene, camera, renderer, mesh, uniforms;

// Init
const init = () => {
  // Create scene
  scene = new Scene();

  // Create camera
  camera = new Camera();
  camera.position.z = 1;

  // Create renderer
  renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create geometry
  const geometry = new PlaneBufferGeometry(2, 2);

  // Initialize uniforms
  uniforms = {
    u_center: {
      type: "v2",
      value: new Vector2(window.innerWidth / 2, window.innerHeight / 2),
    },
    u_resolution: {
      type: "v2",
      value: new Vector2(window.innerWidth, window.innerHeight),
    },
    u_scale: { type: "f", value: SHADER_START_SCALE },
  };

  // Create material
  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
  });

  // Create mesh
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  // Set resize handler
  window.addEventListener("resize", () => {
    // Update Resolution Uniform
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Set mouse wheel handler
  window.addEventListener("wheel", (e) => {
    // Calculate the change in scale
    const scaleDelta = Math.pow(SHADER_SCALE_STEP, Math.sign(e.deltaY));

    // Determine anchor point for scaling
    const anchor = new Vector2(e.pageX, window.innerHeight - e.pageY);

    // Calculate new center point
    const center = uniforms.u_center.value.clone();
    center.sub(anchor);
    center.multiplyScalar(1 / scaleDelta);
    center.add(anchor);

    // Update center and scale
    uniforms.u_center.value = center;
    uniforms.u_scale.value *= scaleDelta;
  });
};

// Animate
const animate = () => {
  requestAnimationFrame(animate);
  render();
};

// Render
const render = () => {
  // Render scene
  renderer.render(scene, camera);
};

init();
animate();

/* ============================================================
   Spherical WebGL gallery — phantom.land-inspired
   Camera at origin, project cards tiled on the inner surface
   of a sphere. Drag to orbit with lenis-style damping.
   Data: products.json (single source of truth).
   ============================================================ */

import * as THREE from 'three';

const gsap = window.gsap;

/* ---------- Tunables ---------- */
const RADIUS = 20;              // sphere radius (cards sit here, facing inward)
const REPEATS = 10;             // each project tiled N times around the sphere
const CARD_W = 4.4, CARD_H = 3.0;
const SENSITIVITY = 0.0035;     // rad per px of drag
const LERP = 0.075;             // per-frame damping factor (the lenis feel)
const VELOCITY_DECAY = 0.95;    // inertia decay per frame after release
const PITCH_LIMIT = 0.8;        // rad — never flip over the poles (and never face the empty cap)
const LAT_BAND = (50 * Math.PI) / 180; // cards stay within ±50° latitude
const IDLE_DELAY = 4000;        // ms before auto-drift kicks in
const IDLE_DRIFT = 0.0004;      // rad/frame yaw drift when idle
const CLICK_SLOP = 6;           // px — more movement than this means it was a drag
const DIM = 0.9;                // resting card brightness (hover goes to 1.0)

/* ---------- DOM ---------- */
const canvas = document.getElementById('gl');
const loader = document.getElementById('loader');
const dragHint = document.getElementById('dragHint');
const hoverTitle = document.getElementById('hoverTitle');
const hoverCategory = document.getElementById('hoverCategory');
const hoverName = document.getElementById('hoverName');
const detail = document.getElementById('detail');
const detailBack = document.getElementById('detailBack');
const detailCategory = document.getElementById('detailCategory');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailBody = document.getElementById('detailBody');
const detailLink = document.getElementById('detailLink');

/* ---------- Scene ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16120d); // --dark

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 60);
camera.position.set(0, 0, 0);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2(2, 2); // offscreen until first move

/* ---------- Rotation state ---------- */
let targetYaw = 0, targetPitch = 0;
let currentYaw = 0, currentPitch = 0;
let velYaw = 0, velPitch = 0;
let dragging = false;
let lastX = 0, lastY = 0;
let downX = 0, downY = 0;
let lastInteraction = performance.now();
let hintDismissed = false;
let detailOpen = false;
let detailTl = null;
let hoveredMesh = null;
const cards = [];
const blurProxy = { v: 0 };

/* ---------- Card textures: rounded-rect canvas compositing ---------- */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function makeCardTexture(project) {
  const W = 800, H = 550, R = 26;
  const cnv = document.createElement('canvas');
  cnv.width = W; cnv.height = H;
  const ctx = cnv.getContext('2d');

  let img = null;
  const sources = [];
  if (project.screenshot) sources.push(project.screenshot);
  sources.push(`https://picsum.photos/seed/${project.id}/800/600`);
  for (const src of sources) {
    try { img = await loadImage(src); break; } catch { /* try next */ }
  }

  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, R);
  ctx.clip();
  if (img) {
    // cover-fit
    const s = Math.max(W / img.width, H / img.height);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = '#211b14';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#b8ad99';
    ctx.font = '500 30px IBM Plex Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(project.name, W / 2, H / 2);
  }
  // hairline edge so dark screenshots separate from the void
  ctx.strokeStyle = 'rgba(243,239,231,0.16)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(1.5, 1.5, W - 3, H - 3, R);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

/* ---------- Layout: golden-spiral within a latitude band ---------- */
function buildCards(projects, textures) {
  const total = projects.length * REPEATS;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const sinBand = Math.sin(LAT_BAND);
  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);

  // shuffle each repeat cycle so the same project never tiles in a row
  const order = [];
  for (let r = 0; r < REPEATS; r++) {
    const cycle = projects.map((_, idx) => idx);
    for (let j = cycle.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [cycle[j], cycle[k]] = [cycle[k], cycle[j]];
    }
    order.push(...cycle);
  }

  for (let i = 0; i < total; i++) {
    const project = projects[order[i]];
    // even distribution in sin(latitude) across the band, plus jitter
    const t = (i + 0.5) / total;
    const lat = Math.asin(sinBand * (2 * t - 1)) + (Math.random() - 0.5) * 0.07;
    const lon = i * golden + (Math.random() - 0.5) * 0.1;

    const mat = new THREE.MeshBasicMaterial({
      map: textures[order[i]],
      transparent: true,
      color: new THREE.Color(DIM, DIM, DIM),
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      RADIUS * Math.cos(lat) * Math.sin(lon),
      RADIUS * Math.sin(lat),
      RADIUS * Math.cos(lat) * Math.cos(lon)
    );
    mesh.lookAt(0, 0, 0);
    mesh.rotateZ((Math.random() - 0.5) * 0.105); // ±3° organic tilt
    mesh.userData = {
      project,
      basePos: mesh.position.clone(),
      baseQuat: mesh.quaternion.clone(),
    };
    scene.add(mesh);
    cards.push(mesh);
  }
}

/* ---------- Pointer: drag + inertia + click discrimination ---------- */
canvas.addEventListener('pointerdown', (e) => {
  if (detailOpen) return;
  dragging = true;
  velYaw = velPitch = 0;
  lastX = downX = e.clientX;
  lastY = downY = e.clientY;
  pointerNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  lastInteraction = performance.now();
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
  if (!hintDismissed) {
    hintDismissed = true;
    gsap.to(dragHint, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' });
  }
});

canvas.addEventListener('pointermove', (e) => {
  pointerNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  targetYaw += dx * SENSITIVITY;
  targetPitch += dy * SENSITIVITY;
  targetPitch = THREE.MathUtils.clamp(targetPitch, -PITCH_LIMIT, PITCH_LIMIT);
  // velocity = blend of recent frame deltas
  velYaw = velYaw * 0.6 + dx * SENSITIVITY * 0.4;
  velPitch = velPitch * 0.6 + dy * SENSITIVITY * 0.4;
  lastInteraction = performance.now();
});

function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  canvas.classList.remove('dragging');
  lastInteraction = performance.now();
  const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
  if (moved < CLICK_SLOP) {
    velYaw = velPitch = 0;
    handleClick();
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

/* ---------- Hover ---------- */
function setHover(mesh) {
  if (hoveredMesh === mesh) return;
  if (hoveredMesh) {
    gsap.to(hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(hoveredMesh.material.color, { r: DIM, g: DIM, b: DIM, duration: 0.4, ease: 'power2.out' });
  }
  hoveredMesh = mesh;
  canvas.classList.toggle('card-hover', !!mesh);
  if (mesh) {
    gsap.to(mesh.scale, { x: 1.06, y: 1.06, z: 1.06, duration: 0.4, ease: 'power2.out' });
    gsap.to(mesh.material.color, { r: 1, g: 1, b: 1, duration: 0.4, ease: 'power2.out' });
    const p = mesh.userData.project;
    hoverCategory.textContent = (p.tags || []).slice(0, 3).join(' · ');
    hoverName.textContent = p.name;
    gsap.fromTo(hoverTitle, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  } else {
    gsap.to(hoverTitle, { autoAlpha: 0, y: 8, duration: 0.3, ease: 'power2.out' });
  }
}

function updateHover() {
  if (dragging || detailOpen) return;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(cards);
  setHover(hits.length ? hits[0].object : null);
}

/* ---------- Click → detail transition ---------- */
function handleClick() {
  if (detailOpen) return;
  // raycast at the click point itself — works on touch, where hover never fires
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(cards);
  if (!hits.length) return;
  const mesh = hits[0].object;
  setHover(null);
  detailOpen = true;
  const p = mesh.userData.project;

  // populate the stub from products.json
  detailCategory.textContent = (p.tags || []).join(' · ');
  detailTitle.textContent = p.name;
  detailMeta.textContent = [p.role || 'Product Manager', p.year, p.stage].filter(Boolean).join(' · ');
  detailBody.textContent = p.description || '';
  detailLink.href = `project.html?id=${encodeURIComponent(p.id)}`;
  detailLink.classList.remove('hidden');

  // clicked card flies toward the camera (camera is at origin, so just
  // pull it in along its own radius — it stays facing us by construction)
  const heroPos = mesh.userData.basePos.clone().normalize().multiplyScalar(3.4);

  detailTl = gsap.timeline({
    onReverseComplete: () => {
      detailOpen = false;
      detail.classList.remove('open');
      detail.setAttribute('aria-hidden', 'true');
      lastInteraction = performance.now();
    },
  });
  for (const c of cards) {
    if (c === mesh) continue;
    const drift = c.userData.basePos.clone().multiplyScalar(1.15);
    detailTl.to(c.material, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 0);
    detailTl.to(c.position, { x: drift.x, y: drift.y, z: drift.z, duration: 0.7, ease: 'power2.inOut' }, 0);
  }
  detailTl.to(mesh.position, { x: heroPos.x, y: heroPos.y, z: heroPos.z, duration: 0.85, ease: 'power3.inOut' }, 0);
  detailTl.to(blurProxy, {
    v: 14, duration: 0.6, ease: 'power2.inOut',
    onUpdate: () => { canvas.style.filter = `blur(${blurProxy.v}px)`; },
  }, 0.2);
  detailTl.add(() => {
    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');
  }, 0.45);
  detailTl.fromTo(detail, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.5);
}

function closeDetail() {
  if (!detailOpen || !detailTl) return;
  detailTl.reverse();
}
detailBack.addEventListener('click', closeDetail);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });

/* ---------- Frame loop ---------- */
function tick() {
  requestAnimationFrame(tick);

  if (!dragging) {
    // inertia: release velocity keeps feeding the target, decaying
    if (Math.abs(velYaw) > 1e-5 || Math.abs(velPitch) > 1e-5) {
      targetYaw += velYaw;
      targetPitch = THREE.MathUtils.clamp(targetPitch + velPitch, -PITCH_LIMIT, PITCH_LIMIT);
      velYaw *= VELOCITY_DECAY;
      velPitch *= VELOCITY_DECAY;
    }
    // idle drift
    if (!detailOpen && performance.now() - lastInteraction > IDLE_DELAY) {
      targetYaw += IDLE_DRIFT;
    }
  }

  currentYaw += (targetYaw - currentYaw) * LERP;
  currentPitch += (targetPitch - currentPitch) * LERP;
  camera.rotation.set(currentPitch, currentYaw, 0);

  updateHover();
  renderer.render(scene, camera);
}

/* ---------- Resize ---------- */
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ---------- Boot ---------- */
async function init() {
  const res = await fetch('products.json');
  const data = await res.json();
  const projects = data.projects || [];
  const textures = await Promise.all(projects.map(makeCardTexture));
  buildCards(projects, textures);
  tick();
  loader.classList.add('done');
}

init().catch((err) => {
  console.error('Gallery failed to initialise:', err);
  loader.querySelector('.mono-meta').textContent = 'gallery failed to load — see console';
});

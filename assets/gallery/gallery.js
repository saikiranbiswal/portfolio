/* ============================================================
   Spherical WebGL gallery — phantom.land-inspired
   Camera at origin, project cards tiled on the inner surface
   of a sphere. Drag to orbit with lenis-style damping.
   Data: products.json (single source of truth).
   ============================================================ */

import * as THREE from 'three';

const gsap = window.gsap;

/* ---------- Tunables ---------- */
const RADIUS = 17.5;            // closer sphere keeps screenshots visually present
const REPEATS = 6;              // enough coverage without making repetition obvious
const CARD_W = 6.35, CARD_H = 4.35;
const SENSITIVITY = 0.0035;     // rad per px of drag
const LERP = 0.075;             // per-frame damping factor (the lenis feel)
const VELOCITY_DECAY = 0.95;    // inertia decay per frame after release
const PITCH_LIMIT = 0.8;        // rad — never flip over the poles (and never face the empty cap)
const LAT_BAND = (56 * Math.PI) / 180; // broader coverage reduces empty polar areas
const IDLE_DELAY = 4000;        // ms before auto-drift kicks in
const IDLE_DRIFT = 0.00048;     // rad/frame yaw drift when idle (20% faster)
const CLICK_SLOP = 6;           // px — more movement than this means it was a drag
const DIM = 0.94;               // resting card brightness (hover goes to 1.0)

/* ---------- DOM ---------- */
const canvas = document.getElementById('gl');
const loader = document.getElementById('loader');
const dragHint = document.getElementById('dragHint');
const galleryIntro = document.getElementById('galleryIntro');
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
scene.background = new THREE.Color(0xd2bda3); // warm clay atmosphere

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 60);
camera.position.set(0, 0, 0);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2(2, 2); // offscreen until first move

/* ---------- Rotation state ---------- */
// Start on a deliberately dense, varied view rather than an arbitrary seam.
let targetYaw = -2.49, targetPitch = -0.3;
let currentYaw = targetYaw, currentPitch = targetPitch;
let velYaw = 0, velPitch = 0;
let dragging = false;
let lastX = 0, lastY = 0;
let downX = 0, downY = 0;
let lastInteraction = performance.now();
let hintDismissed = false;
let introDismissed = false;
let detailOpen = false;
let detailTl = null;
let hoveredMesh = null;
const cards = [];
const blurProxy = { v: 0 };
let randomState = 0x5a17c9e3;

function random() {
  randomState = (randomState * 1664525 + 1013904223) >>> 0;
  return randomState / 4294967296;
}

function dismissIntro() {
  if (introDismissed || !galleryIntro) return;
  introDismissed = true;
  gsap.to(galleryIntro, { autoAlpha: 0, y: 10, duration: 0.45, ease: 'power2.out' });
}

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
    // contain-fit on a paper mat — shows the whole screenshot (incl. wide
    // ones like the Excel tools) without cropping the toolbars off the sides.
    ctx.fillStyle = '#ece6da';
    ctx.fillRect(0, 0, W, H);
    const s = Math.min(W / img.width, H / img.height);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = '#ece6da';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3a342d';
    ctx.font = '500 30px IBM Plex Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(project.name, W / 2, H / 2);
  }
  // hairline edge so screenshots separate from the warm atmosphere
  ctx.strokeStyle = 'rgba(58,52,45,0.24)';
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
  const placements = [];

  for (let i = 0; i < total; i++) {
    // even distribution in sin(latitude) across the band, plus jitter
    const t = (i + 0.5) / total;
    const lat = Math.asin(sinBand * (2 * t - 1)) + (random() - 0.5) * 0.055;
    const lon = i * golden + (random() - 0.5) * 0.08;
    const depth = RADIUS + (random() - 0.5) * 1.7;
    const scale = 0.9 + random() * 0.24;
    const direction = new THREE.Vector3(
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon)
    );
    placements.push({ direction, depth, scale, tilt: (random() - 0.5) * 0.08 });
  }

  // Assign repeats by spatial distance, not sequence position. This keeps
  // the same project from appearing twice in one wide desktop view.
  const remaining = projects.map(() => REPEATS);
  const assignedDirections = projects.map(() => []);
  const assignment = placements.map((placement) => {
    let best = -1;
    let bestScore = Infinity;
    for (let p = 0; p < projects.length; p++) {
      if (!remaining[p]) continue;
      const nearestRepeat = assignedDirections[p].reduce(
        (maxDot, direction) => Math.max(maxDot, placement.direction.dot(direction)),
        -1
      );
      const score = nearestRepeat + random() * 0.0001;
      if (score < bestScore) {
        best = p;
        bestScore = score;
      }
    }
    remaining[best]--;
    assignedDirections[best].push(placement.direction);
    return best;
  });

  placements.forEach((placement, i) => {
    const projectIndex = assignment[i];
    const project = projects[projectIndex];
    const mat = new THREE.MeshBasicMaterial({
      map: textures[projectIndex],
      transparent: true,
      color: new THREE.Color(DIM, DIM, DIM),
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(placement.direction).multiplyScalar(placement.depth);
    mesh.lookAt(0, 0, 0);
    mesh.rotateZ(placement.tilt);
    mesh.scale.setScalar(placement.scale);
    mesh.userData = {
      project,
      basePos: mesh.position.clone(),
      baseQuat: mesh.quaternion.clone(),
      baseScale: placement.scale,
    };
    scene.add(mesh);
    cards.push(mesh);
  });
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
  dismissIntro();
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
    const base = hoveredMesh.userData.baseScale;
    gsap.to(hoveredMesh.scale, { x: base, y: base, z: base, duration: 0.4, ease: 'power2.out' });
    gsap.to(hoveredMesh.material.color, { r: DIM, g: DIM, b: DIM, duration: 0.4, ease: 'power2.out' });
  }
  hoveredMesh = mesh;
  canvas.classList.toggle('card-hover', !!mesh);
  if (mesh) {
    dismissIntro();
    const hoverScale = mesh.userData.baseScale * 1.06;
    gsap.to(mesh.scale, { x: hoverScale, y: hoverScale, z: hoverScale, duration: 0.4, ease: 'power2.out' });
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
  const res = await fetch('content/products.json');
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

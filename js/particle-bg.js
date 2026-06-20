(function () {
  "use strict";

  var canvas = document.querySelector("canvas.particle-bg");
  if (!canvas) return;

  var context = canvas.getContext("2d", { alpha: false });
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  var ripples = [];
  var pointer = { x: 0.5, y: 0.46, tx: 0.5, ty: 0.46, active: false };
  var width = 0;
  var height = 0;
  var ratio = 1;
  var frame = 0;
  var running = true;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createStar(initial) {
    return {
      x: Math.random(),
      y: Math.random(),
      depth: random(0.18, 1),
      size: random(0.45, 1.8),
      alpha: random(0.22, 0.92),
      phase: random(0, Math.PI * 2),
      speed: random(0.000015, 0.000055),
      vx: initial ? 0 : random(-0.00015, 0.00015),
      vy: initial ? 0 : random(-0.00015, 0.00015),
      hue: Math.random() > 0.82 ? random(188, 228) : random(214, 242)
    };
  }

  function seed() {
    var density = Math.round((width * height) / 7200);
    var target = Math.max(110, Math.min(270, density));
    stars = Array.from({ length: target }, function () { return createStar(true); });
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    seed();
  }

  function onPointer(event) {
    pointer.tx = event.clientX / Math.max(width, 1);
    pointer.ty = event.clientY / Math.max(height, 1);
    pointer.active = true;
  }

  function onLeave() {
    pointer.tx = 0.5;
    pointer.ty = 0.46;
    pointer.active = false;
  }

  function onBurst(event) {
    var x = event.clientX / Math.max(width, 1);
    var y = event.clientY / Math.max(height, 1);
    ripples.push({ x: event.clientX, y: event.clientY, radius: 0, alpha: 0.34 });
    stars.forEach(function (star) {
      var dx = star.x - x;
      var dy = star.y - y;
      var distance = Math.max(Math.hypot(dx * width, dy * height), 38);
      if (distance < Math.min(width, height) * 0.34) {
        var force = (1 - distance / (Math.min(width, height) * 0.34)) * 0.0028;
        star.vx += (dx / distance) * force * height;
        star.vy += (dy / distance) * force * width;
      }
    });
  }

  function palette() {
    return document.documentElement.dataset.theme === "light"
      ? { top: "#e9eef5", bottom: "#cfd8e7", glow: "rgba(77,111,154,0.14)", star: 0.7 }
      : { top: "#040711", bottom: "#0a1323", glow: "rgba(63,114,179,0.22)", star: 1 };
  }

  function drawBackground(colors) {
    var base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, colors.top);
    base.addColorStop(1, colors.bottom);
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    var glowX = pointer.x * width;
    var glowY = pointer.y * height;
    var glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.7);
    glow.addColorStop(0, colors.glow);
    glow.addColorStop(0.42, "rgba(90,60,145,0.08)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  function drawConnections(colors) {
    var nearest = stars.filter(function (star) { return star.depth > 0.62; });
    context.lineWidth = 0.45;
    for (var i = 0; i < nearest.length; i += 1) {
      var a = nearest[i];
      for (var j = i + 1; j < Math.min(nearest.length, i + 10); j += 1) {
        var b = nearest[j];
        var ax = a.x * width;
        var ay = a.y * height;
        var bx = b.x * width;
        var by = b.y * height;
        var distance = Math.hypot(ax - bx, ay - by);
        if (distance > 112) continue;
        context.strokeStyle = "rgba(135,174,226," + ((1 - distance / 112) * 0.075 * colors.star) + ")";
        context.beginPath();
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
      }
    }
  }

  function drawStars(time, colors) {
    pointer.x += (pointer.tx - pointer.x) * 0.035;
    pointer.y += (pointer.ty - pointer.y) * 0.035;
    var parallaxX = (pointer.x - 0.5) * 18;
    var parallaxY = (pointer.y - 0.5) * 14;

    stars.forEach(function (star) {
      if (!reducedMotion) {
        star.x += star.speed * star.depth + star.vx;
        star.y += star.speed * 0.28 * star.depth + star.vy;
        star.vx *= 0.94;
        star.vy *= 0.94;
      }
      if (star.x > 1.025) star.x = -0.025;
      if (star.x < -0.03) star.x = 1.02;
      if (star.y > 1.03) star.y = -0.03;
      if (star.y < -0.03) star.y = 1.02;

      var x = star.x * width - parallaxX * star.depth;
      var y = star.y * height - parallaxY * star.depth;
      var twinkle = 0.74 + Math.sin(time * 0.0012 + star.phase) * 0.26;
      var radius = star.size * (0.55 + star.depth * 0.72);
      context.fillStyle = "hsla(" + star.hue + ", 78%, 88%, " + (star.alpha * twinkle * colors.star) + ")";
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function drawRipples() {
    ripples = ripples.filter(function (ripple) {
      ripple.radius += reducedMotion ? 7 : 2.8;
      ripple.alpha *= reducedMotion ? 0.72 : 0.965;
      context.strokeStyle = "rgba(136,184,238," + ripple.alpha + ")";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.stroke();
      return ripple.alpha > 0.015;
    });
  }

  function tick(time) {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    var colors = palette();
    drawBackground(colors);
    drawConnections(colors);
    drawStars(time, colors);
    drawRipples();
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onBurst, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) frame = requestAnimationFrame(tick);
    else cancelAnimationFrame(frame);
  });

  resize();
  frame = requestAnimationFrame(tick);
}());

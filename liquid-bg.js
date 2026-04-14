(function () {
  // Секции, на которых рисуем фон
  const SECTION_IDS = ['about', 'tariffs', 'shops', 'reviews', 'guide', 'faq'];

  function noise(x, y, t) {
    return (
      Math.sin(x * 0.011 + t * 0.9) * Math.cos(y * 0.009 - t * 0.6) +
      Math.sin((x * 1.3 - y) * 0.007 + t * 0.5) * Math.cos(x * 0.005 + y * 0.006 - t * 0.4) +
      Math.sin(x * 0.02 - t * 0.5) * Math.cos(y * 0.018 + t * 0.3) +
      Math.cos(Math.sqrt(x * x * 0.00001 + y * y * 0.00001) + t * 0.4) +
      4
    ) / 8;
  }

  function createLiquidBg(section) {
    // Обёртка чтобы canvas был абсолютным внутри секции
    section.style.position = 'relative';
    section.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.className = 'liquid-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    // Вставляем первым дочерним элементом
    section.insertBefore(canvas, section.firstChild);

    let W, H, img, t = 0, animId = null, visible = false;

    function resize() {
      W = canvas.width  = section.offsetWidth  || 800;
      H = canvas.height = section.offsetHeight || 600;
      img = new ImageData(W, H);
    }

    function drawFrame() {
      const step = 3; // шаг пикселей — баланс качество/производительность
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const n = noise(x, y, t);
          const v = Math.pow(n, 1.8);
          let r, g, b;
          if (v < 0.3) {
            const k = v / 0.3;
            r = Math.round(5  + 8  * k);
            g = Math.round(2  + 4  * k);
            b = Math.round(15 + 20 * k);
          } else if (v < 0.6) {
            const k = (v - 0.3) / 0.3;
            r = Math.round(13 + 0x7E * k);
            g = Math.round(6  + 0x3B * k);
            b = Math.round(35 + 0xD8 * k);
          } else {
            const k = (v - 0.6) / 0.4;
            r = Math.round(0x7E + (0xC6 - 0x7E) * k);
            g = Math.round(0x3B + (0xFF - 0x3B) * k);
            b = Math.round(0xED + (0x34 - 0xED) * k);
          }
          for (let dy = 0; dy < step && y + dy < H; dy++) {
            for (let dx = 0; dx < step && x + dx < W; dx++) {
              const i = ((y + dy) * W + (x + dx)) * 4;
              img.data[i]     = r;
              img.data[i + 1] = g;
              img.data[i + 2] = b;
              img.data[i + 3] = 255;
            }
          }
        }
      }
      const ctx = canvas.getContext('2d');
      ctx.putImageData(img, 0, 0);
      t += 0.007;
      animId = requestAnimationFrame(drawFrame);
    }

    function start() {
      if (animId) return;
      resize();
      drawFrame();
    }
    function stop() {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }

    // Запускаем только когда секция в viewport (экономим CPU)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { visible = true;  start(); }
        else                  { visible = false; stop();  }
      });
    }, { threshold: 0.01 });
    obs.observe(section);

    // Обновляем размер при ресайзе
    const ro = new ResizeObserver(() => {
      if (visible) { stop(); resize(); drawFrame(); }
      else          { resize(); }
    });
    ro.observe(section);
  }

  // Инициализируем после загрузки DOM
  function init() {
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) createLiquidBg(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

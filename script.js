/* ============================================================
   script.js — Guía Interactiva Completa
   ============================================================
   CONDICIONES SECRETAS:
     1 → Sección Variables: nombre + tipo + clic en botón
     2 → Sección Bucles:    número + clic en "Generar Tabla"
     3 → Sección DOM:       cualquier texto + clic en "Aplicar Cambios"
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// ESTADO GLOBAL
// ─────────────────────────────────────────────────────────────
let condicion1_cumplida = false;
let condicion2_cumplida = false;
let condicion3_cumplida = false;
let misionActivada      = false;

// ─────────────────────────────────────────────────────────────
// PARTÍCULAS DE FONDO
// ─────────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#7c3aed','#38bdf8','#ec4899','#a78bfa','#14b8a6'];
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.body.scrollHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = 1 + Math.random() * 2.5;
    this.vx   = (Math.random() - .5) * .4;
    this.vy   = (Math.random() - .5) * .4;
    this.color= COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha= .08 + Math.random() * .18;
    this.life = 0;
    this.maxLife = 300 + Math.random() * 400;
  };

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife ||
        this.x < 0 || this.x > W ||
        this.y < 0 || this.y > H) {
      this.reset();
    }
  };

  Particle.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function init() {
    resize();
    particles = Array.from({length: 120}, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = a.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
  });

  init();
  draw();
})();

// ─────────────────────────────────────────────────────────────
// SCROLL → CARD REVEAL (Intersection Observer)
// ─────────────────────────────────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.card').forEach(card => observer.observe(card));
})();

// ─────────────────────────────────────────────────────────────
// MISIÓN — HELPERS
// ─────────────────────────────────────────────────────────────
function actualizarBandera(num) {
  const labels = {1:'✅ Condición 1', 2:'✅ Condición 2', 3:'✅ Condición 3'};
  const el = document.getElementById(`flag${num}`);
  if (el && !el.classList.contains('done')) {
    el.textContent = labels[num];
    el.classList.add('done');
  }
}

function verificarMision() {
  if (condicion1_cumplida && condicion2_cumplida && condicion3_cumplida && !misionActivada) {
    misionActivada = true;
    // Pequeño delay dramático
    setTimeout(activarAgentDOM, 400);
  }
}

// ─────────────────────────────────────────────────────────────
// ACTIVACIÓN DEL AGENTE DOM
// ─────────────────────────────────────────────────────────────
function activarAgentDOM() {
  const h1 = document.getElementById('titulo-principal');

  // 1. Dorado en el h1
  h1.style.setProperty('background', '#FFD700', 'important');
  h1.style.setProperty('-webkit-background-clip', 'unset', 'important');
  h1.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
  h1.style.setProperty('background-clip', 'unset', 'important');
  h1.style.setProperty('color', '#000000', 'important');
  h1.classList.add('activated');

  // 2. Párrafo secreto
  const mensaje = document.createElement('p');
  mensaje.id = 'mission-success-msg';
  mensaje.textContent = '🎉 Misión Cumplida: Agente DOM activado.';
  h1.insertAdjacentElement('afterend', mensaje);

  // 3. Hint box glow
  const hint = document.getElementById('mission-hint');
  if (hint) {
    hint.style.borderColor = '#FFD700';
    hint.style.background  = 'rgba(255,215,0,.08)';
    hint.style.boxShadow   = '0 0 40px rgba(255,215,0,.2)';
  }

  // 4. Confeti
  launchConfetti();

  // 5. Scroll suave al top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  console.log('%c🕵️ AGENTE DOM ACTIVADO', 'color:#FFD700;font-size:20px;font-weight:900;background:#000;padding:4px 12px;border-radius:4px');
}

// ─────────────────────────────────────────────────────────────
// CONFETI
// ─────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#FFD700','#7c3aed','#22c55e','#ec4899','#38bdf8','#f97316'];
  const shapes = ['50%','2px','4px'];

  if (!document.getElementById('confetti-kf')) {
    const s = document.createElement('style');
    s.id = 'confetti-kf';
    s.textContent = `
      @keyframes cfFall {
        0%  { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
        100%{ opacity:0; transform:translateY(80vh) rotate(800deg) scale(0.4); }
      }`;
    document.head.appendChild(s);
  }

  for (let i = 0; i < 80; i++) {
    const d = document.createElement('div');
    const size = 5 + Math.random() * 9;
    d.style.cssText = `
      position:fixed;
      top:${-5 + Math.random() * 25}vh;
      left:${Math.random() * 100}vw;
      width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};
      border-radius:${shapes[Math.floor(Math.random() * shapes.length)]};
      pointer-events:none;
      z-index:9999;
      animation:cfFall ${1.2 + Math.random() * 2.4}s ${Math.random() * .6}s ease-out forwards;
    `;
    document.body.appendChild(d);
    d.addEventListener('animationend', () => d.remove());
  }
}

// ═════════════════════════════════════════════════════════════
// SECCIÓN 1 — VARIABLES
// ═════════════════════════════════════════════════════════════
(function() {
  const btn    = document.getElementById('btn-variables');
  const inName = document.getElementById('var-nombre');
  const inType = document.getElementById('var-tipo');
  const res    = document.getElementById('resultado-variables');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nombre = inName.value.trim();
    const tipo   = inType.value;

    if (!nombre || !tipo) {
      res.className = 'result-box error';
      res.innerHTML = '⚠️ Completa <strong>ambos campos</strong> antes de continuar.';
      return;
    }

    const map = {
      String:  { val:`"${nombre}"`,                              desc:`Una cadena de ${nombre.length} caracteres.` },
      Number:  { val:`${nombre.length}`,                         desc:`La longitud del texto como entero.` },
      Boolean: { val:nombre.length > 3 ? 'true':'false',         desc:`true si el nombre tiene más de 3 letras.` },
      Array:   { val:`["${nombre}", "${[...nombre].reverse().join('')}"]`, desc:`El nombre y su reversa.` },
      Object:  { val:`{ nombre: "${nombre}", largo: ${nombre.length} }`, desc:`Objeto con dos propiedades.` },
    };
    const ex = map[tipo];

    res.className = 'result-box success';
    res.innerHTML = `
      <div style="color:#64748b;font-size:.78rem;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;">Variable creada</div>
      <pre style="background:rgba(0,0,0,.5);padding:12px;border-radius:8px;margin-bottom:10px;"><code><span class="kw">const</span> miVariable = <span class="str">${ex.val}</span>; <span class="cm">// ${tipo}</span></code></pre>
      <p style="color:#e2e8f0;font-size:.88rem;">📝 ${ex.desc}</p>`;

    if (!condicion1_cumplida) {
      condicion1_cumplida = true;
      actualizarBandera(1);
      verificarMision();
    }
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 2 — CONDICIONALES
// ═════════════════════════════════════════════════════════════
(function() {
  const btn = document.getElementById('btn-condicionales');
  const inp = document.getElementById('cond-edad');
  const res = document.getElementById('resultado-condicionales');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const edad = parseInt(inp.value, 10);
    if (isNaN(edad) || edad < 0 || edad > 120) {
      res.className = 'result-box error';
      res.innerHTML = '⚠️ Ingresa una edad válida entre <strong>0 y 120</strong>.';
      return;
    }

    const cats = [
      [3,   'Bebé',         '👶','#93c5fd'],
      [13,  'Niño/a',       '🧒','#86efac'],
      [18,  'Adolescente',  '🧑','#fde68a'],
      [30,  'Joven Adulto', '🙋','#c4b5fd'],
      [60,  'Adulto',       '🧑‍💼','#f9a8d4'],
      [80,  'Adulto Mayor', '🧓','#fdba74'],
      [Infinity,'Anciano',  '👴','#6ee7b7'],
    ];
    const [,cat,icon,color] = cats.find(([lim]) => edad < lim);

    res.className = 'result-box success';
    res.innerHTML = `
      <div style="font-size:3rem;text-align:center;margin-bottom:6px;">${icon}</div>
      <p style="text-align:center;font-size:1.3rem;font-weight:700;color:${color};">${cat}</p>
      <p style="text-align:center;color:#64748b;font-size:.83rem;margin-top:4px;">
        ${edad} año${edad===1?'':'s'} → <strong style="color:${color};">${cat}</strong>
      </p>`;
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 3 — BUCLES  ← CONDICIÓN 2
// ═════════════════════════════════════════════════════════════
(function() {
  const btn = document.getElementById('btn-bucles');
  const inp = document.getElementById('loop-numero');
  const res = document.getElementById('resultado-bucles');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const n = parseInt(inp.value, 10);
    if (isNaN(n) || n < 1 || n > 12) {
      res.className = 'result-box error';
      res.innerHTML = '⚠️ Ingresa un número entre <strong>1 y 12</strong>.';
      return;
    }

    let html = `<div style="color:#64748b;font-size:.78rem;margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em;">Tabla del ${n}</div>`;
    for (let i = 1; i <= 10; i++) {
      const prod = n * i;
      const pct  = Math.round((prod / (n * 10)) * 100);
      html += `
        <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);">
          <span style="width:130px;font-family:'Fira Code',monospace;font-size:.83rem;color:#e2e8f0;flex-shrink:0;">
            ${n} × ${String(i).padStart(2,' ')} = <strong style="color:#a78bfa;">${prod}</strong>
          </span>
          <div style="flex:1;background:rgba(255,255,255,.06);border-radius:4px;height:8px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#7c3aed,#38bdf8);border-radius:4px;transition:width .4s ease;"></div>
          </div>
        </div>`;
    }

    res.className = 'result-box success';
    res.innerHTML = html;

    if (!condicion2_cumplida) {
      condicion2_cumplida = true;
      actualizarBandera(2);
      verificarMision();
    }
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 4 — FUNCIONES
// ═════════════════════════════════════════════════════════════
(function() {
  const btn = document.getElementById('btn-funciones');
  const ib  = document.getElementById('fn-base');
  const ie  = document.getElementById('fn-exp');
  const res = document.getElementById('resultado-funciones');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const b = parseFloat(ib.value), e = parseFloat(ie.value);
    if (isNaN(b) || isNaN(e)) {
      res.className = 'result-box error';
      res.innerHTML = '⚠️ Ingresa <strong>base</strong> y <strong>exponente</strong> válidos.';
      return;
    }
    const r = Math.pow(b, e);
    res.className = 'result-box success';
    res.innerHTML = `
      <pre style="background:rgba(0,0,0,.5);padding:12px;border-radius:8px;margin-bottom:10px;"><code><span class="kw">const</span> potencia = (b, e) => Math.pow(b, e);
potencia(<span class="num">${b}</span>, <span class="num">${e}</span>); <span class="cm">// → ${r.toLocaleString()}</span></code></pre>
      <p style="text-align:center;font-size:1.5rem;font-weight:900;color:#a78bfa;">
        ${b}<sup style="font-size:.55em;">${e}</sup>
        <span style="color:#64748b;font-size:.7em;"> = </span>
        <span style="color:#FFD700;">${r.toLocaleString()}</span>
      </p>`;
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 5 — ARRAYS
// ═════════════════════════════════════════════════════════════
(function() {
  const btnA = document.getElementById('btn-arrays-add');
  const btnR = document.getElementById('btn-arrays-remove');
  const inp  = document.getElementById('arr-item');
  const res  = document.getElementById('resultado-arrays');
  if (!btnA) return;

  let lista = [];

  function render() {
    if (!lista.length) {
      res.className = 'result-box';
      res.innerHTML = '<span style="color:#475569;">[ ] — El arreglo está vacío</span>';
      return;
    }
    const chips = lista.map((it,i)=>
      `<span style="display:inline-flex;align-items:center;gap:4px;
        background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.35);
        border-radius:6px;padding:3px 10px;margin:3px;font-size:.83rem;">
        <span style="color:#475569;font-size:.7rem;">[${i}]</span> ${it}
      </span>`).join('');

    res.className = 'result-box success';
    res.innerHTML = `
      <div style="color:#64748b;font-size:.78rem;margin-bottom:8px;">
        Array — <strong style="color:#a78bfa;">${lista.length}</strong> elemento${lista.length!==1?'s':''}
      </div>
      <div style="margin-bottom:10px;">${chips}</div>
      <pre style="background:rgba(0,0,0,.5);padding:10px;border-radius:8px;font-size:.8rem;">
<span class="kw">const</span> lista = [<span class="str">${lista.map(i=>`"${i}"`).join(', ')}</span>];</pre>`;
  }

  btnA.addEventListener('click', () => {
    const v = inp.value.trim();
    if (!v) return;
    lista.push(v);
    inp.value = '';
    render();
  });

  btnR.addEventListener('click', () => { lista.pop(); render(); });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 6 — OBJETOS
// ═════════════════════════════════════════════════════════════
(function() {
  const btn = document.getElementById('btn-objetos');
  const iN  = document.getElementById('obj-nombre');
  const iE  = document.getElementById('obj-edad');
  const iP  = document.getElementById('obj-profesion');
  const res = document.getElementById('resultado-objetos');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nombre = iN.value.trim(), edad = parseInt(iE.value,10), prof = iP.value.trim();
    if (!nombre || isNaN(edad) || !prof) {
      res.className = 'result-box error';
      res.innerHTML = '⚠️ Completa los tres campos.';
      return;
    }
    res.className = 'result-box success';
    res.innerHTML = `
      <pre style="background:rgba(0,0,0,.5);padding:14px;border-radius:8px;">
<span class="kw">const</span> persona = {
  nombre:    <span class="str">"${nombre}"</span>,
  edad:      <span class="num">${edad}</span>,
  profesion: <span class="str">"${prof}"</span>,
  activo:    <span class="kw">true</span>
};</pre>
      <p style="margin-top:10px;font-size:.88rem;color:#e2e8f0;">
        Objeto con <strong>4 propiedades</strong> · 
        <code style="background:rgba(255,255,255,.06);padding:2px 7px;border-radius:4px;font-size:.78rem;">typeof persona → "object"</code>
      </p>`;
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 7 — DOM  ← CONDICIÓN 3
// ═════════════════════════════════════════════════════════════
(function() {
  const btn   = document.getElementById('btn-dom');
  const tIn   = document.getElementById('dom-text-input');
  const cIn   = document.getElementById('dom-color-input');
  const bgIn  = document.getElementById('dom-bg-input');
  const prev  = document.getElementById('dom-preview-text');
  const prevB = document.getElementById('dom-preview-box');
  const res   = document.getElementById('resultado-dom');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const txt = tIn.value.trim();
    const col = cIn.value, bg = bgIn.value;
    if (txt) prev.textContent = txt;
    prev.style.color = col;
    prevB.style.backgroundColor = bg;

    res.className = 'result-box success';
    res.innerHTML = `
      <div style="color:#64748b;font-size:.78rem;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;">Cambios aplicados</div>
      <pre style="background:rgba(0,0,0,.5);padding:10px;border-radius:8px;font-size:.8rem;">
<span class="kw">const</span> el = document.<span class="fn">getElementById</span>(<span class="str">"dom-preview-text"</span>);
el.textContent        = <span class="str">"${txt || prev.textContent}"</span>;
el.style.color        = <span class="str">"${col}"</span>;
el.parentElement.style.backgroundColor = <span class="str">"${bg}"</span>;</pre>`;

    if (!condicion3_cumplida) {
      condicion3_cumplida = true;
      actualizarBandera(3);
      verificarMision();
    }
  });
})();

// ═════════════════════════════════════════════════════════════
// SECCIÓN 8 — EVENTOS
// ═════════════════════════════════════════════════════════════
(function() {
  const btnC = document.getElementById('btn-eventos-click');
  const hov  = document.getElementById('hover-zone');
  const kIn  = document.getElementById('key-input');
  const log  = document.getElementById('event-log');
  const res  = document.getElementById('resultado-eventos');
  if (!btnC) return;

  res.classList.remove('hidden');

  let clicks = 0, hovers = 0, keys = 0;

  function addLog(icon, type, detail) {
    const e = document.createElement('div');
    e.className = 'log-entry';
    const t = new Date();
    const ts = [t.getHours(),t.getMinutes(),t.getSeconds()]
      .map(n=>String(n).padStart(2,'0')).join(':');
    e.innerHTML = `<span style="color:#334155;">${ts}</span> ${icon} <strong style="color:#e2e8f0;">${type}</strong>: ${detail}`;
    log.prepend(e);
    while (log.children.length > 20) log.removeChild(log.lastChild);
  }

  btnC.addEventListener('click', () => {
    clicks++;
    addLog('🖱️','click',`Botón presionado × ${clicks}`);
    btnC.style.transform = 'scale(.94)';
    setTimeout(()=> btnC.style.transform = '', 130);
  });

  hov.addEventListener('mouseover', () => {
    hovers++;
    addLog('✨','mouseover',`Hover detectado × ${hovers}`);
  });

  kIn.addEventListener('keydown', e => {
    keys++;
    addLog('⌨️','keydown',`Tecla: <code style="background:rgba(255,255,255,.08);padding:1px 5px;border-radius:3px;">${e.key}</code> × ${keys}`);
  });
})();

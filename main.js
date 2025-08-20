// main.js — versión compacta y corregida

// ===================== UTILIDADES GLOBALES DE MODAL (scroll-lock robusto) =====================
(() => {
  let lockCounter = 0;
  let savedScrollY = 0;
  let savedScrollX = 0;

  function lockScroll() {
    if (lockCounter === 0) {
      // Guarda posición actual
      savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      savedScrollX = window.scrollX || document.documentElement.scrollLeft || 0;

      // Compensa la barra de scroll
      const sbWidth = window.innerWidth - document.documentElement.clientWidth;
      if (sbWidth > 0) document.body.style.paddingRight = sbWidth + 'px';

      // Fija el body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }
    lockCounter++;
  }

  function unlockScroll() {
    lockCounter = Math.max(0, lockCounter - 1);
    if (lockCounter !== 0) return;

    // Quita el fijo del body
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';

    // 🔧 Desactiva el scroll-smooth sólo para restaurar al píxel exacto
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    // Restaura posición exacta
    window.scrollTo(savedScrollX, savedScrollY);

    // Vuelve a como estaba
    html.style.scrollBehavior = prevBehavior;

    // Pequeño nudge para forzar reflow (sin mover al usuario)
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  // Helpers globales
  window.openModal = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    lockScroll();
  };
  window.closeModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
    unlockScroll();
  };

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-container:not(.hidden)')
        .forEach(m => m.id && window.closeModal(m.id));
    }
  });

  // Cerrar por overlay si usas .modal-overlay
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
      const modal = e.target.closest('.modal-container');
      if (modal && modal.id) window.closeModal(modal.id);
    }
  });
})();


// ===================== APP =====================
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Librerías ----------
  if (window.AOS) AOS.init({ duration: 800, once: true, offset: 50 });

  // ---------- Countdown (CDMX) ----------
  (function iniciarCuentaRegresiva() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    // Ajusta el offset si ese día aplica DST de CDMX (-06:00 usualmente)
    const target = new Date('2025-10-25T18:00:00-06:00').getTime();
    const dias = document.getElementById('days');
    const horas = document.getElementById('hours');
    const minutos = document.getElementById('minutes');
    const segundos = document.getElementById('seconds');

    function actualizar() {
      const distance = target - Date.now();
      if (distance <= 0) {
        clearInterval(iv);
        countdownElement.innerHTML = '<div class="text-2xl font-semibold">¡El gran día ha llegado!</div>';
        return;
      }
      const s = Math.floor(distance / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      dias.textContent = String(d).padStart(2, '0');
      horas.textContent = String(h).padStart(2, '0');
      minutos.textContent = String(m).padStart(2, '0');
      segundos.textContent = String(ss).padStart(2, '0');
    }
    actualizar();
    const iv = setInterval(actualizar, 1000);
  })();

  // ---------- Parallax (rAF + passive) ----------
  (function () {
    const hero = document.querySelector('[data-parallax]') || document.querySelector('.hero-bg');
    if (!hero) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = (window.scrollY || 0) * 0.4;
        hero.style.backgroundPosition = `center ${Math.round(offset)}px`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // ---------- Animar mensaje (typewriter suave) ----------
  function animarMensajePersonalizado() {
    const mensaje = document.getElementById('familia-mensaje');
    if (!mensaje) return;
    const texto = mensaje.textContent.trim();
    mensaje.textContent = '';
    let i = 0;
    (function escribir() {
      if (i < texto.length) {
        mensaje.textContent += texto.charAt(i++);
        setTimeout(escribir, 40);
      }
    })();
  }

  // ---------- Modal Vestimenta ----------
  (function configurarModalVestimenta() {
    const btn = document.getElementById('dress-code-btn');
    btn?.addEventListener('click', () => openModal('dress-code-modal'));
  })();

  // ---------- Galería con auto-scroll + modal ----------
  (function configurarGaleria() {
    const container = document.getElementById('gallery-container');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');
    const closeBtn = document.getElementById('modal-close');
    if (!(container && modal && modalImage && prevBtn && nextBtn && closeBtn)) return;

    // Construir lista base (originales)
    const cardsOriginal = [...container.querySelectorAll('.gallery-thumb')];
    const imgsOriginal = cardsOriginal.map(c => c.querySelector('img')).filter(Boolean);
    const srcsOriginal = imgsOriginal.map(img => img.currentSrc || img.src);

    // Duplicar para "loop" visual
    cardsOriginal.forEach(card => container.appendChild(card.cloneNode(true)));

    let isScrolling = true;
    let currentIndex = 0;
    function loopScroll() {
      if (isScrolling) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
      }
      requestAnimationFrame(loopScroll);
    }
    container.addEventListener('mouseenter', () => { isScrolling = false; });
    container.addEventListener('mouseleave', () => { isScrolling = true; });

    // Delegación de clicks (toma índice respecto a originales)
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-thumb');
      if (!card) return;
      const img = card.querySelector('img');
      const src = img?.currentSrc || img?.src || '';
      const idx = srcsOriginal.indexOf(src);
      if (idx < 0) return; // hizo click en clon cuyo src no está en originales (raro)
      currentIndex = idx;
      modalImage.src = srcsOriginal[currentIndex];
      openModal('gallery-modal');
      isScrolling = false;
    });

    function mover(delta) {
      const len = srcsOriginal.length;
      currentIndex = (currentIndex + delta + len) % len;
      modalImage.src = srcsOriginal[currentIndex];
    }
    prevBtn.addEventListener('click', () => mover(-1));
    nextBtn.addEventListener('click', () => mover(+1));
    closeBtn.addEventListener('click', () => { closeModal('gallery-modal'); isScrolling = true; modalImage.src = ''; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { closeModal('gallery-modal'); isScrolling = true; modalImage.src = ''; } });

    loopScroll();
  })();

  // ---------- Música (arranque tras gesto + toggle) ----------
  (function configurarMusica() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const playI = document.getElementById('play-icon');
    const pauseI = document.getElementById('pause-icon');
    if (!(btn && audio && playI && pauseI)) return;

    const TARGET_VOL = 0.5;
    const FADE_TIME = 700;
    let started = false;

    async function start() {
      try {
        audio.muted = false;
        audio.volume = 0.01;
        await audio.play();
        // fade-in
        const steps = 14, stepDur = FADE_TIME / steps;
        let i = 0;
        (function step() {
          i++;
          audio.volume = Math.min(TARGET_VOL, 0.01 + (TARGET_VOL - 0.01) * (i / steps));
          if (i < steps) setTimeout(step, stepDur);
        })();
        playI.classList.add('hidden'); pauseI.classList.remove('hidden');
        started = true;
      } catch (e) { /* silencio */ }
    }

    const firstGesture = async () => { if (!started) await start(); };
    window.addEventListener('click', firstGesture, { capture: true, once: true });
    window.addEventListener('touchstart', firstGesture, { capture: true, once: true });
    window.addEventListener('keydown', firstGesture, { capture: true, once: true });

    btn.addEventListener('click', async () => {
      if (audio.paused) await start();
      else { audio.pause(); playI.classList.remove('hidden'); pauseI.classList.add('hidden'); }
    });
  })();

  // ---------- Calendar (GCal en UTC + ICS en hora local con TZID) ----------
  (function agregarEnlacesCalendario() {
    // Para Google Calendar: UTC con sufijo Z
    function toICSUTC(d) {
      const dt = new Date(d);
      const pad = n => String(n).padStart(2, '0');
      const yyyy = dt.getUTCFullYear();
      const mm = pad(dt.getUTCMonth() + 1);
      const dd = pad(dt.getUTCDate());
      const hh = pad(dt.getUTCHours());
      const mi = pad(dt.getUTCMinutes());
      const ss = pad(dt.getUTCSeconds());
      return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
    }

    // Para archivo .ics local: hora local (sin Z)
    function toICSLocal(d) {
      const dt = new Date(d);
      const pad = n => String(n).padStart(2, '0');
      const yyyy = dt.getFullYear();
      const mm = pad(dt.getMonth() + 1);
      const dd = pad(dt.getDate());
      const hh = pad(dt.getHours());
      const mi = pad(dt.getMinutes());
      const ss = pad(dt.getSeconds());
      return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
    }

    function generateCalendarLinks(id, title, desc, loc, startISO, endISO) {
      // --------- Enlace Google Calendar (UTC) ---------
      const startZ = toICSUTC(startISO);
      const endZ = toICSUTC(endISO);

      const g = new URL('https://www.google.com/calendar/render');
      g.searchParams.set('action', 'TEMPLATE');
      g.searchParams.set('text', title);
      g.searchParams.set('dates', `${startZ}/${endZ}`);
      g.searchParams.set('details', desc || '');
      g.searchParams.set('location', loc || '');

      const aG = document.getElementById(`gcal-${id}`);
      if (aG) aG.href = g.toString();

      // --------- Archivo .ics (hora local con TZID) ---------
      const tz = 'America/Mexico_City';
      const startLocal = toICSLocal(startISO);
      const endLocal = toICSLocal(endISO);

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//XV Ximena//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-TIMEZONE:${tz}`,
        'BEGIN:VEVENT',
        `${`DTSTAMP:${toICSUTC(new Date())}`}`, // DTSTAMP en UTC
        `DTSTART;TZID=${tz}:${startLocal}`,
        `DTEND;TZID=${tz}:${endLocal}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${(desc || '').replace(/\n/g, '\\n')}`,
        `LOCATION:${loc || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const aI = document.getElementById(`ical-${id}`);
      if (aI) {
        aI.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
        aI.download = `${id}.ics`;
      }
    }

    // ▼▼ Tus 2 eventos con horario de CDMX ▼▼
    generateCalendarLinks(
      'ceremonia',
      'XV Años de Ximena - Ceremonia',
      'Ceremonia religiosa por los XV Años de Ximena. ¡Acompáñanos!',
      'Parroquia de San Francisco de Asís, Miguel Hidalgo Manzana 031, Coacalco de Berriozabal, Méx.',
      '2025-10-25T18:00:00-06:00', // 25 oct 2025 6:00 PM CDMX
      '2025-10-25T19:00:00-06:00'  // 25 oct 2025 7:00 PM CDMX
    );

    generateCalendarLinks(
      'recepcion',
      'XV Años de Ximena - Recepción',
      '¡A celebrar en la fiesta de XV Años de Ximena!',
      'Salón "Fiesta Colonial", C. Cenzontles 66, Parque Residencial Coacalco, Mex.',
      '2025-10-25T19:30:00-06:00', // 25 oct 2025 7:30 PM CDMX
      '2025-10-26T03:00:00-06:00'  // 26 oct 2025 3:00 AM CDMX
    );
  })();


  // ---------- Gate por código (privacidad: título fijo + conteo) ----------
  (function configurarAccesoCodigo() {
    const modal = document.getElementById('codigo-modal');
    const input = document.getElementById('codigo-input');
    const btn = document.getElementById('codigo-btn');
    const error = document.getElementById('codigo-error');

    const wrap = document.getElementById('mensaje-personalizado');
    const titulo = document.getElementById('familia-nombre');
    const cant = document.getElementById('familia-cantidad');
    const msg = document.getElementById('familia-mensaje');

    if (!(modal && input && btn && wrap && titulo && cant && msg)) return;

    // Asegura UL para chips pero oculto (no mostrar nombres)
    let ul = document.getElementById('lista-invitados');
    if (!ul) {
      ul = document.createElement('ul');
      ul.id = 'lista-invitados';
      ul.classList.add('hidden');
      msg.parentElement.insertBefore(ul, msg);
    }

    const DB = window.CODIGOS || window.INVITADOS || {};
    // Código genérico
    DB['INVITADO'] = DB['INVITADO'] || {
      invitados: [],
      soloMensaje: true,
      mensaje: '¡Gracias por acompañarme! Tu presencia es lo más importante. Nos vemos el 25 de octubre.'
    };

    function aplicarFamiliaPorEntry(entry) {
      // === NOMBRE A MOSTRAR ===
      const displayName = (window.nombreParaMostrar)
        ? window.nombreParaMostrar(entry)
        : (entry?.display || entry?.nombre || entry?.familia || 'Seres Queridos');
      titulo.textContent = displayName;

      // === CANTIDAD / BADGE ===
      // Soporta invitados:number | invitados:array | cantidad:number | numInvitados:number
      const n = (typeof entry?.invitados === 'number') ? entry.invitados
        : Array.isArray(entry?.invitados) ? entry.invitados.length
          : (typeof entry?.cantidad === 'number') ? entry.cantidad
            : (typeof entry?.numInvitados === 'number') ? entry.numInvitados
              : 0;

      // Oculta el badge si es genérico o 0
      if (entry?.generico || entry?.soloMensaje || n === 0) {
        cant.classList.add('hidden');
      } else {
        cant.classList.remove('hidden');
        cant.textContent = (window.etiquetaInvitados)
          ? window.etiquetaInvitados(n)
          : `${n} invitado${n === 1 ? '' : 's'}`;
      }

      // === MENSAJE ===
      msg.textContent = entry?.mensaje || '';

      // (Opcional) chips con nombres si existen
      const lista = document.getElementById('lista-invitados');
      if (lista) {
        if (Array.isArray(entry?.nombres) && entry.nombres.length) {
          lista.innerHTML = entry.nombres.map(nm => `<li>${nm}</li>`).join('');
          // si no quieres mostrar los chips, mantén <ul> con class hidden
        } else {
          lista.innerHTML = '';
        }
      }

      wrap.classList.remove('hidden');
      closeModal('codigo-modal');
      animarMensajePersonalizado();
      error.classList.add('hidden');
    }



    function verificarCodigo(val) {
      const code = (val || '').trim().toUpperCase();
      const entry = DB[code];
      if (entry) aplicarFamiliaPorEntry(entry);
      else error.classList.remove('hidden');
    }

    // Mostrar modal al entrar
    openModal('codigo-modal');

    btn.addEventListener('click', () => verificarCodigo(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verificarCodigo(input.value); });

    // ?code=FAM-XXXX precargado
    const pre = (new URLSearchParams(location.search).get('code') || '').toUpperCase();
    if (pre && DB[pre]) { input.value = pre; verificarCodigo(pre); }

    // Exponer mínima API para el picker
    window.__aplicarFamiliaEntry = aplicarFamiliaPorEntry;
    window.__DB_FAMILIAS = DB;
  })();

  // ---------- Picker "Entrar sin código" + atajos (?guest / ?c=) ----------
  (function setupPickerAndGuest() {
    const DB = window.__DB_FAMILIAS || window.CODIGOS || {};
    const btnGuest = document.getElementById('btn-guest');
    const modal = document.getElementById('picker-modal');
    const buscar = document.getElementById('picker-buscar');
    const lista = document.getElementById('picker-lista');
    const btnOk = document.getElementById('picker-confirmar');
    const btnCancel = document.getElementById('picker-cancelar');

    if (!btnGuest || !modal) {
      // Pero sí soporta atajos por querystring
      const qp = new URLSearchParams(location.search);
      const isGuest = ['1', 'si', 'true'].includes((qp.get('guest') || '').toLowerCase());
      const code = (qp.get('c') || qp.get('code') || '').toUpperCase();
      setTimeout(() => {
        if (code && DB[code]) window.__aplicarFamiliaEntry(DB[code]);
        else if (isGuest && DB['INVITADO']) window.__aplicarFamiliaEntry(DB['INVITADO']);
      }, 350);
      return;
    }

    const FAMS = Object.entries(DB)
      .filter(([code, entry]) => !entry?.generico) // oculta el genérico en la lista
      .map(([code, entry]) => {
        const nombre = (window.nombreParaMostrar)
          ? window.nombreParaMostrar(entry)
          : (entry?.display || entry?.nombre || entry?.familia || 'Seres Queridos');

        const cantidad = (typeof entry?.invitados === 'number') ? entry.invitados
          : Array.isArray(entry?.invitados) ? entry.invitados.length
            : (typeof entry?.cantidad === 'number') ? entry.cantidad
              : (typeof entry?.numInvitados === 'number') ? entry.numInvitados
                : 0;

        return { code, nombre, cantidad, entry };
      });

    let selected = null;

    function render(filter) {
      const q = (filter || '').toLowerCase();
      const items = FAMS
        .filter(f => (f.nombre || '').toLowerCase().includes(q) || f.code.toLowerCase().includes(q))
        .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      lista.innerHTML = '';
      selected = null; btnOk.disabled = true;

      items.forEach(f => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'w-full text-left p-3 rounded border hover:bg-gray-50';
        el.innerHTML = `<div class="font-medium">${f.nombre || 'Seres Queridos'}</div>
                        <div class="text-xs text-gray-600">${f.code} • ${f.cantidad} invitado${f.cantidad === 1 ? '' : 's'}</div>`;
        el.addEventListener('click', () => {
          [...lista.querySelectorAll('button')].forEach(b => b.classList.remove('ring-2', 'ring-[#001742]'));
          el.classList.add('ring-2', 'ring-[#001742]');
          selected = f; btnOk.disabled = false;
        });
        lista.appendChild(el);
      });

      if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center text-gray-500 py-6';
        empty.textContent = 'No encontramos coincidencias.';
        lista.appendChild(empty);
      }
    }

    btnGuest.addEventListener('click', () => { openModal('picker-modal'); buscar.value = ''; render(''); });
    btnCancel?.addEventListener('click', () => closeModal('picker-modal'));
    buscar?.addEventListener('input', e => render(e.target.value));
    btnOk?.addEventListener('click', () => {
      if (!selected) return;
      // Aplica la familia elegida (sin mostrar nombres)
      window.__aplicarFamiliaEntry(selected.entry);
      closeModal('picker-modal');
    });

    // Soporte de ?guest / ?c= también aquí
    const qp = new URLSearchParams(location.search);
    const isGuest = ['1', 'si', 'true'].includes((qp.get('guest') || '').toLowerCase());
    const code = (qp.get('c') || qp.get('code') || '').toUpperCase();
    setTimeout(() => {
      if (code && DB[code]) window.__aplicarFamiliaEntry(DB[code]);
      else if (isGuest && DB['INVITADO']) window.__aplicarFamiliaEntry(DB['INVITADO']);
    }, 350);
  })();

  // ---------- Flecha “Desliza” (hint por inactividad) ----------
  (function setupScrollHint() {
    const hero = document.querySelector('header.hero-bg');
    const hint = document.getElementById('scroll-hint');
    const icon = document.getElementById('scroll-hint-icon');
    if (!hero || !hint) return;
    const hasTailwind = !!document.querySelector('script[src*="tailwind"]');

    function showHint() { hint.classList.remove('hidden'); hint.classList.add('is-visible'); if (hasTailwind) icon?.classList.add('animate-bounce'); else hint.classList.add('bounce-fallback'); }
    function hideHint() { hint.classList.remove('is-visible', 'bounce-fallback'); icon?.classList.remove('animate-bounce'); }

    let timer; function reset() { clearTimeout(timer); timer = setTimeout(showHint, 5000); }
    const onInteract = () => { hideHint(); reset(); };
    ['scroll', 'click', 'keydown', 'touchstart', 'mousemove'].forEach(ev => window.addEventListener(ev, onInteract, { passive: true }));
    window.addEventListener('scroll', () => {
      const bottom = hero.getBoundingClientRect().bottom;
      if (bottom < window.innerHeight * 0.6) hideHint();
    }, { passive: true });

    reset();
  })();

});

//DESCARGAR INVITACIÓN
// === DESCARGA DE INVITACIÓN COMO HTML AUTOCONTENIDO ===
// Toma recursos del mismo dominio (fotos/, assets/audio/, estilos.css) y los incrusta.
// Mantiene librerías por CDN (Tailwind/AOS/FontAwesome), por lo que requiere internet para verse idéntico.

(function () {
  async function urlToDataURL(url) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("No se pudo inyectar:", url, e);
      return null;
    }
  }

  async function inlineImagesAndMedia(root) {
    // <img> -> dataURL
    const imgs = root.querySelectorAll("img[src]");
    for (const img of imgs) {
      const src = img.getAttribute("src");
      if (!src) continue;
      if (/^data:/.test(src) || /^https?:\/\//.test(src)) continue; // deja externas
      const data = await urlToDataURL(src);
      if (data) img.setAttribute("src", data);
    }

    // <source> de <audio> -> dataURL
    const sources = root.querySelectorAll("audio source[src], video source[src]");
    for (const s of sources) {
      const src = s.getAttribute("src");
      if (!src) continue;
      if (/^data:/.test(src) || /^https?:\/\//.test(src)) continue;
      const data = await urlToDataURL(src);
      if (data) s.setAttribute("src", data);
    }

    // Fondos en línea conocidos (ej: .hero-bg) – ajusta si usas más
    const hero = root.querySelector(".hero-bg");
    if (hero) {
      // Si tu CSS usa url('fotos/xime.png'), lo volvemos inline
      const bgUrl = "fotos/xime.png";
      const data = await urlToDataURL(bgUrl);
      if (data) {
        hero.style.backgroundImage = `linear-gradient(rgba(0, 23, 66, .6), rgba(0, 23, 66, .6)), url('${data}')`;
        hero.style.backgroundAttachment = "scroll"; // evita glitch en móviles al abrir el HTML
        hero.style.backgroundPosition = "center center";
        hero.style.backgroundSize = "cover";
      }
    }
  }

  async function inlineLocalCSS(root) {
    // Reemplaza <link rel="stylesheet" href="estilos.css"> por <style> con su contenido
    const links = [...root.querySelectorAll('link[rel="stylesheet"]')];
    for (const link of links) {
      const href = link.getAttribute("href") || "";
      // Sólo inyectamos tu css local. Deja CDNs (googleapis, unpkg, cloudflare) como están.
      if (/^(https?:)?\/\//.test(href)) continue;
      try {
        const cssText = await (await fetch(href, { cache: "no-cache" })).text();
        const style = root.createElement("style");
        style.setAttribute("data-inlined-from", href);
        style.textContent = cssText;
        link.parentNode.replaceChild(style, link);
      } catch (e) {
        console.warn("No se pudo inyectar CSS:", href, e);
      }
    }
  }

  function stripGatesAndScripts(root) {
    // Quita el modal de código para que el HTML abra directo
    const gate = root.querySelector("#codigo-modal");
    if (gate) gate.remove();

    // Quita scripts locales para que el snapshot no pida código ni reproduzca música solo
    root.querySelectorAll('script[src="codigos.js"], script[src="main.js"]').forEach(s => s.remove());
    // Deja librerías externas (Tailwind/AOS/FontAwesome) para que la vista coincida con la original
  }

  function tweakRuntimeThings(root) {
    // Pausa música por defecto en el snapshot
    const audio = root.querySelector("#bg-music");
    if (audio) {
      audio.removeAttribute("autoplay");
    }
    // Asegura que el mensaje personalizado visible (si ya estaba mostrado en la sesión original)
    const mp = root.querySelector("#mensaje-personalizado");
    if (mp && mp.classList.contains("hidden")) {
      // No forzamos a mostrarlo, pues depende del código ingresado; deja como estaba
    }
  }

  async function construirSnapshotHTML() {
    // Clon profundo del documento actual
    const doc = document.documentElement.cloneNode(true);

    // Trabajamos en el clon
    stripGatesAndScripts(doc);
    await inlineLocalCSS(doc);
    await inlineImagesAndMedia(doc);
    tweakRuntimeThings(doc);

    // Sugerencia: agrega un aviso pequeño en el pie del snapshot
    const footer = doc.querySelector("footer");
    if (footer) {
      const note = doc.createElement("p");
      note.className = "text-xs text-gray-400 mt-2";
      note.textContent = "Copia local generada desde la invitación original.";
      footer.appendChild(note);
    }

    // Serializa
    const html = "<!DOCTYPE html>\n" + doc.outerHTML;
    return new Blob([html], { type: "text/html;charset=utf-8" });
  }

  async function descargarInvitacion() {
    const blob = await construirSnapshotHTML();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitacion_ximena.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  // Botones
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-descargar");
    if (btn) btn.addEventListener("click", descargarInvitacion);

    const btnPdf = document.getElementById("btn-pdf");
    if (btnPdf) btnPdf.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });
  });
})();


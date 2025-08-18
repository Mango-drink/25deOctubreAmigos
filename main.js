document.addEventListener('DOMContentLoaded', () => {
  // --- INICIALIZACIONES DE LIBRERÍAS ---
  AOS.init({ duration: 800, once: true, offset: 50 });

  // --- CUENTA REGRESIVA ---
  function iniciarCuentaRegresiva() {
    const countdownDate = new Date("Oct 25, 2025 18:00:00").getTime();
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    const dias = document.getElementById('days');
    const horas = document.getElementById('hours');
    const minutos = document.getElementById('minutes');
    const segundos = document.getElementById('seconds');

    function actualizar() {
      const now = Date.now();
      const distance = countdownDate - now;
      if (distance < 0) {
        clearInterval(interval);
        countdownElement.innerHTML = '<div class="text-2xl font-semibold">¡El gran día ha llegado!</div>';
        return;
      }
      dias.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
      horas.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      minutos.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      segundos.textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }
    actualizar();
    const interval = setInterval(actualizar, 1000);
  }

  // --- EFECTO PARALLAX HERO (suavizado con rAF + listener pasivo) ---
  (function () {
    const hero = document.querySelector('[data-parallax]') || document.querySelector('.hero-bg');
    if (!hero) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const offset = window.scrollY * 0.4;
          hero.style.backgroundPosition = `center ${offset}px`;
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // posición inicial
  })();

  // --- EFECTO MÁQUINA DE ESCRIBIR EN MENSAJE PERSONALIZADO ---
  function animarMensajePersonalizado() {
    const mensaje = document.getElementById('familia-mensaje');
    if (mensaje) {
      const texto = mensaje.textContent.trim();
      mensaje.textContent = '';
      let i = 0;
      const escribir = () => {
        if (i < texto.length) {
          mensaje.textContent += texto.charAt(i);
          i++;
          setTimeout(escribir, 40);
        }
      };
      escribir();
    }
  }

  // --- MODAL VESTIMENTA ---
  function configurarModalVestimenta() {
    const btn = document.getElementById('dress-code-btn');
    if (btn) btn.addEventListener('click', () => openModal('dress-code-modal'));
  }

  // --- GALERÍA DE RECUERDOS ---
  function configurarGaleria() {
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalButton = document.getElementById('modal-close');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');
    const thumbs = galleryContainer ? galleryContainer.querySelectorAll('img') : [];
    let currentIndex = 0;

    if (!(galleryContainer && modal && modalImage && closeModalButton)) return;

    // Duplicar para scroll infinito
    Array.from(galleryContainer.children).forEach(item => {
      galleryContainer.appendChild(item.cloneNode(true));
    });

    let isScrolling = true;
    function continuousScroll() {
      if (isScrolling) {
        galleryContainer.scrollLeft += 1;
        if (galleryContainer.scrollLeft >= galleryContainer.scrollWidth / 2) {
          galleryContainer.scrollLeft = 0;
        }
      }
      requestAnimationFrame(continuousScroll);
    }
    galleryContainer.addEventListener('mouseenter', () => { isScrolling = false; });
    galleryContainer.addEventListener('mouseleave', () => { isScrolling = true; });

    // Abrir modal
    galleryContainer.addEventListener('click', (event) => {
      const thumb = event.target.closest('.gallery-thumb');
      if (thumb) {
        currentIndex = Array.from(thumbs).indexOf(thumb.querySelector('img'));
        modalImage.src = thumb.querySelector('img').src;
        openModal('gallery-modal');
        isScrolling = false;
      }
    });

    // Navegación con flechas
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
        modalImage.src = thumbs[currentIndex].src;
      });
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % thumbs.length;
        modalImage.src = thumbs[currentIndex].src;
      });
    }

    // Cerrar modal
    closeModalButton.addEventListener('click', () => {
      closeModal('gallery-modal');
      modalImage.src = "";
      isScrolling = true;
    });
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal('gallery-modal');
        modalImage.src = "";
        isScrolling = true;
      }
    });

    isScrolling = true;
    continuousScroll();
  }

  // --- MÚSICA DE FONDO (simple, confiable, volumen medio + fade-in) ---
  function configurarMusica() {
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (!(musicToggle && bgMusic && playIcon && pauseIcon)) {
      console.warn('[Musica] Falta algún elemento (toggle, audio o iconos).');
      return;
    }

    // Comprobaciones de carga del archivo
    bgMusic.addEventListener('error', () => {
      console.error('[Musica] Error cargando el audio. Revisa la ruta del src en <audio>.');
    });
    bgMusic.addEventListener('canplay', () => {
      console.log('[Musica] Audio listo para reproducir.');
    });

    // Volumen medio por defecto
    const TARGET_VOL = 0.5;   // 50%
    const FADE_TIME = 700;    // ms

    let started = false;

    async function startSimple() {
      try {
        // Asegúrate de no estar muteado
        bgMusic.muted = false;
        // Comienza bajo para el fade-in
        bgMusic.volume = 0.01;

        // Reproduce (ya hay gesto del usuario)
        await bgMusic.play();

        // Fade-in hacia TARGET_VOL
        const steps = 14;
        const stepDur = FADE_TIME / steps;
        let i = 0;
        const step = () => {
          i++;
          bgMusic.volume = Math.min(TARGET_VOL, 0.01 + (TARGET_VOL - 0.01) * (i / steps));
          if (i < steps) setTimeout(step, stepDur);
        };
        step();

        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        started = true;
        console.log('[Musica] Reproduciendo a volumen medio.');
      } catch (err) {
        console.warn('[Musica] No se pudo iniciar aún:', err?.message || err);
      }
    }

    // Solo gestos “fuertes” cuentan: click / touchstart (no scroll)
    const firstGesture = async () => {
      if (!started) await startSimple();
      window.removeEventListener('click', firstGesture, true);
      window.removeEventListener('touchstart', firstGesture, true);
      window.removeEventListener('keydown', firstGesture, true); // Enter también sirve
    };
    window.addEventListener('click', firstGesture, true);
    window.addEventListener('touchstart', firstGesture, true);
    window.addEventListener('keydown', firstGesture, true);

    // Botón play/pausa
    musicToggle.addEventListener('click', async () => {
      if (bgMusic.paused) {
        await startSimple();
      } else {
        bgMusic.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        console.log('[Musica] Pausado por el usuario.');
      }
    });
  }

  // --- ENLACES DE CALENDARIO ---
  function agregarEnlacesCalendario() {
    function formatDateICS(dateStr) {
      const d = new Date(dateStr);
      return (
        d.getFullYear().toString() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0") +
        "T" +
        String(d.getHours()).padStart(2, "0") +
        String(d.getMinutes()).padStart(2, "0") +
        "00"
      );
    }
    function generateCalendarLinks(id, title, desc, loc, startISO, endISO) {
      const start = formatDateICS(startISO);
      const end = formatDateICS(endISO);
      const gcalUrl = new URL('https://www.google.com/calendar/render');
      gcalUrl.searchParams.append('action', 'TEMPLATE');
      gcalUrl.searchParams.append('text', title);
      gcalUrl.searchParams.append('dates', `${start}/${end}`);
      gcalUrl.searchParams.append('details', desc);
      gcalUrl.searchParams.append('location', loc);
      document.getElementById(`gcal-${id}`).href = gcalUrl.toString();
      const ical = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
        `URL:${document.location.href}`,
        `DTSTART:${start}`, `DTEND:${end}`,
        `SUMMARY:${title}`, `DESCRIPTION:${desc}`, `LOCATION:${loc}`,
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\n');
      document.getElementById(`ical-${id}`).href = `data:text/calendar;charset=utf8,${encodeURIComponent(ical)}`;
      document.getElementById(`ical-${id}`).download = `${id}.ics`;
    }
    generateCalendarLinks(
      'ceremonia',
      'XV Años de Ximena - Ceremonia',
      'Ceremonia religiosa por los XV Años de Ximena. ¡Acompáñanos!',
      'Parroquia de San Francisco de Asís, Miguel Hidalgo Manzana 031, Coacalco de Berriozabal, Méx.',
      '2025-10-25T18:00:00',
      '2025-10-25T19:00:00'
    );
    generateCalendarLinks(
      'recepcion',
      'XV Años de Ximena - Recepción',
      '¡A celebrar en la fiesta de XV Años de Ximena!',
      'Salón "Fiesta Colonial", C. Cenzontles 66, Parque Residencial Coacalco, Mex.',
      '2025-10-25T19:30:00',
      '2025-10-26T03:00:00'
    );
  }

  // --- MODALES GENERALES ---
  window.openModal = function (id) {
    document.getElementById(id).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function (id) {
    document.getElementById(id).classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  // --- MODAL DE CÓDIGO PERSONALIZADO (Seres queridos + invitados + mensaje) ---
  function configurarAccesoCodigo() {
    const modal = document.getElementById('codigo-modal');
    const input = document.getElementById('codigo-input');
    const btn = document.getElementById('codigo-btn');
    const errorMsg = document.getElementById('codigo-error');

    const mensajeContainer = document.getElementById('mensaje-personalizado');
    const tituloEl = document.getElementById('familia-nombre');
    const cantidadInvitados = document.getElementById('familia-cantidad');
    const mensajeFamilia = document.getElementById('familia-mensaje');

    if (!(modal && input && btn && mensajeContainer && tituloEl && cantidadInvitados && mensajeFamilia)) return;

    // Asegurar UL para chips (si no existe, lo creamos antes del mensaje)
    let listaInvitadosEl = document.getElementById('lista-invitados');
    if (!listaInvitadosEl) {
      listaInvitadosEl = document.createElement('ul');
      listaInvitadosEl.id = 'lista-invitados';
      listaInvitadosEl.style.display = 'flex';
      listaInvitadosEl.style.flexWrap = 'wrap';
      listaInvitadosEl.style.gap = '8px';
      listaInvitadosEl.style.justifyContent = 'center';
      mensajeFamilia.parentElement.insertBefore(listaInvitadosEl, mensajeFamilia);
    }

    // “Base de datos” local de ejemplo
    const codigosInvitacion = {
      "FAM-GASCA": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Salvador Rangel Gasca! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RANGEL01": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Hola Madrina! Llego el momento que tanto esperamos, gracias por acompañarme en mi camino, me encantará contar con su compañía siempre, pero en especial este 25 de Octubre. Tienen 2 lugares reservados. Un beso y un abrazo." },
      "FAM-SANDOVAL": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Sra. Juanita Sandoval! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RANGEL02": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Eladio Rangel! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-PEREZ": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Andres Pérez! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RIVAS01": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Padrinos! Me encantará contar con su compañía hoy y siempre pero más en este día tan especial para mi. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RIVAS02": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Ronaldo Rivas! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-MARTINEZ": { invitados: ["Adulto 1", "Adulto 2", "Niñ@", "Niñ@"], mensaje: "¡Arturo Martinez! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 2 adultos y 2 niños. Gracias por ser parte de mi historia." },
      "FAM-FRANCO01": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Carlos Franco! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-FRANCO02": { invitados: ["Adulto 1", "Adulto 2", "Niñ@"], mensaje: "¡Carla Franco! Me emocionará compartir este día con ustedes. Reservé 3 lugares: 2 adultos y 1 niño. Gracias por ser parte de mi historia." },
      "FAM-MUNOZ": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5", "Adulto 6"], mensaje: "¡Eduardo Muñoz! Me encantará contar con su compañía. Tienen 6 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ALBARRAN01": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5"], mensaje: "¡Padrinos! Por fin llego el momento de acompañarme, no solo hoy, siempre. Me encantará contar con su compañía. Tienen 5 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ALBARRAN02": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Gatito! Cómo pasa el tiempo pero sigues aquí conmigo como el primer día me encantará contar con su compañía. Tienen 2 lugares reservados. ¡Nos vemos el 25 de octubre!" },
      "FAM-RANGEL03": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Salvador Rangel! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-SANCHEZ": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Niñ@", "Niñ@"], mensaje: "¡Lucia Sanchez! Me emocionará compartir este día con ustedes. Reservé 5 lugares: 3 adultos y 2 niños. Gracias por ser parte de mi historia." },
      "FAM-GUZMAN01": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Felipe Guzman! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-GUZMAN02": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Alicia Guzman! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-GUZMAN03": { invitados: ["Adulto 1"], mensaje: "¡Monica Guzman! Me encantará contar con su compañía. Tienen 1 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RANGEL04": { invitados: ["Adulto 1", "Adulto 2", "Niñ@"], mensaje: "¡Neni! Absolutamente gracias por todo el apoyo que me has brindado, llego el día y me emocionará compartir este día con ustedes. Reservé 3 lugares: 2 adultos y 1 niño. Gracias por ser parte de mi historia." },
      "FAM-RANGEL05": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Tari y Lito! Gracias por no dejarme sola en este camino. Me encantará contar con su compañía. Tienen 2 lugares reservados. ¡Nos vemos el 25 de octubre! Los quiero mucho" },
      "FAM-FRANCO03": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Julio Franco! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-FRANCO04": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Yuliana Franco! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "SRA-LIDIA": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡sra. Lidia! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-RIVERA": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Enrique Rivera! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ALFARO": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Angelica Alfaro! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-GARCIA": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"], mensaje: "¡Cinthia García! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "RITZUKO": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Ritzuko! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ESLAVA": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Niñ@"], mensaje: "¡Juan Eslava! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 3 adultos y 1 niño. Gracias por ser parte de mi historia." },
      "FAM-RANGEL06": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3"], mensaje: "¡Marina Rangel! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ARENAS": { invitados: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5", "Adulto 6"], mensaje: "¡Teresa Arenas! Me encantará contar con su compañía. Tienen 6 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ARREDONDO01": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Angel Arredondo! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
      "FAM-ARREDONDO02": { invitados: ["Adulto 1", "Adulto 2", "Niñ@", "Niñ@"], mensaje: "¡Eduardo Arredondo! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 2 adultos y 2 niños. Gracias por ser parte de mi historia." },
      "FAM-RANGEL07": { invitados: ["Adulto 1", "Adulto 2"], mensaje: "¡Irma Rangel! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!" },
    };

    // Código genérico (solo muestra mensaje)
    codigosInvitacion["INVITADO"] = {
      invitados: [],
      soloMensaje: true,
      mensaje: "¡Gracias por acompañarme! Tu presencia es lo más importante y juntos disfrutaremos de este día tan especial. Nos vemos el 25 de octubre"
    };


    // Mostrar modal al inicio
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    function renderChips(nombres = []) {
      listaInvitadosEl.innerHTML = '';
      nombres.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.style.background = '#ffffffcc';
        li.style.color = '#0a2d6c';
        li.style.border = '1px solid #dbe1f1';
        li.style.padding = '6px 10px';
        li.style.borderRadius = '9999px';
        li.style.fontSize = '0.9rem';
        li.style.boxShadow = '0 1px 2px rgba(0,0,0,.05)';
        listaInvitadosEl.appendChild(li);
      });
    }

function mostrarDatosFamilia(datos) {
  // Título
  tituloEl.textContent = 'Seres Queridos';

  // Ocultar SIEMPRE la lista de nombres
  if (listaInvitadosEl) {
    listaInvitadosEl.innerHTML = '';
    listaInvitadosEl.classList.add('hidden');
  }

  const esSoloMensaje = !!datos.soloMensaje;
  const n = Array.isArray(datos.invitados) ? datos.invitados.length : 0;

  // Número de invitados (solo cuando NO es el genérico)
  if (esSoloMensaje) {
    cantidadInvitados.classList.add('hidden');
  } else {
    cantidadInvitados.classList.remove('hidden');
    cantidadInvitados.textContent = `${n} invitado${n !== 1 ? 's' : ''}`;
  }

  // Mensaje
  mensajeFamilia.textContent = datos.mensaje || '';

  // Mostrar / cerrar modal
  mensajeContainer.classList.remove('hidden');
  modal.classList.add('hidden');
  errorMsg.classList.add('hidden');
  document.body.style.overflow = 'auto';

  // Animación
  animarMensajePersonalizado();
}


    function verificarCodigo() {
      const codigo = input.value.trim().toUpperCase();
      const datos = codigosInvitacion[codigo];
      if (datos) {
        mostrarDatosFamilia(datos);
      } else {
        errorMsg.classList.remove('hidden');
      }
    }

    btn.addEventListener('click', verificarCodigo);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verificarCodigo(); });

    // Si llega con ?code=FAMXXXX
    const params = new URLSearchParams(location.search);
    const codeParam = (params.get('code') || '').toUpperCase();
    if (codeParam && codigosInvitacion[codeParam]) {
      input.value = codeParam;
      verificarCodigo();
    }
  }

  // --- LLAMADA A TODAS LAS FUNCIONES ---
  iniciarCuentaRegresiva();
  configurarModalVestimenta();
  configurarGaleria();
  configurarMusica();
  agregarEnlacesCalendario();
  configurarAccesoCodigo();
});

/* ===== MODALES (scroll-lock sin saltos + fix hueco móvil) ===== */
(() => {
  let lockCounter = 0;
  let savedScrollY = 0;

  function lockScroll() {
    if (lockCounter === 0) {
      savedScrollY = window.scrollY || document.documentElement.scrollTop;

      // Compensa la desaparición de la barra de scroll
      const sbWidth = window.innerWidth - document.documentElement.clientWidth;
      if (sbWidth > 0) document.body.style.paddingRight = sbWidth + 'px';

      // Bloqueo robusto (mejor que overflow:hidden en iOS/Android)
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
    if (lockCounter === 0) {
      // Quita el bloqueo y restaura la posición
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, savedScrollY);

      // Nudge + resize para forzar el reflow (evita el “hueco”)
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
        window.scrollTo(window.scrollX, window.scrollY + 1);
        window.scrollTo(window.scrollX, window.scrollY);
      });
    }
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

  // Opcional: cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-container:not(.hidden)')
        .forEach(m => m.id && window.closeModal(m.id));
    }
  });

  // Opcional: close por overlay si tu overlay tiene la clase .modal-overlay
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
      const modal = e.target.closest('.modal-container');
      if (modal && modal.id) window.closeModal(modal.id);
    }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1) Oculta/elimina el modal de código si existe
  const modal = document.getElementById('codigo-modal');
  if (modal) modal.remove(); // también podrías: modal.classList.add('hidden');

  // 2) Muestra el mensaje "invitado" sin cantidad
  //    (ajusta los textos a tu gusto)
  const bloque = document.getElementById('mensaje-personalizado');
  if (bloque) bloque.classList.remove('hidden');

  const titulo = document.getElementById('familia-nombre');
  if (titulo) titulo.textContent = 'Amigos';

  const badgeCantidad = document.getElementById('familia-cantidad');
  if (badgeCantidad) {
    // oculta SOLO el chip de cantidad (la versión pública no muestra número)
    const wrapper = badgeCantidad.parentElement;
    if (wrapper) wrapper.classList.add('hidden');
  }

  const mensaje = document.getElementById('familia-mensaje');
  if (mensaje) {
    mensaje.textContent = 'Querida familia, con mucha alegría quiero compartir con ustedes este momento tan importante en mi vida. Los invito a acompañarme el 25 de Octubre de 2025 para celebrar mis XV años. Su presencia hará de esta noche un recuerdo inolvidable.';
  }

  // 3) Si tu main.js marca algo de "gateo por código", neutralízalo aquí:
  //    - Evita que intente abrir el modal por cualquier condición previa
  //    - Evita que cambie el hash/scroll al cerrar modales
  //    (deja estos "safeties" por si existiera lógica previa)
  try {
    // elimina banderas globales comunes si existieran
    window.ACCESO_POR_CODIGO = false;
    document.body.classList.remove('bloquear-scroll');
  } catch (_) {}
});

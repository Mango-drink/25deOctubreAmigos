document.addEventListener('DOMContentLoaded', () => {
  // 1) Oculta/elimina el modal de código si existe
  const modal = document.getElementById('codigo-modal');
  if (modal) modal.remove(); // también podrías: modal.classList.add('hidden');

  // 2) Muestra el mensaje "invitado" sin cantidad
  //    (ajusta los textos a tu gusto)
  const bloque = document.getElementById('mensaje-personalizado');
  if (bloque) bloque.classList.remove('hidden');

  const titulo = document.getElementById('familia-nombre');
  if (titulo) titulo.textContent = 'La fiesta es con ustedes';

  const badgeCantidad = document.getElementById('familia-cantidad');
  if (badgeCantidad) {
    // oculta SOLO el chip de cantidad (la versión pública no muestra número)
    const wrapper = badgeCantidad.parentElement;
    if (wrapper) wrapper.classList.add('hidden');
  }

  const mensaje = document.getElementById('familia-mensaje');
  if (mensaje) {
    mensaje.textContent = '¡Hey! Se viene una noche que no te puedes perder… mis XV años. Prepárate para bailar, reír y disfrutar al máximo porque esta fiesta está hecha para que la pasemos increíble.';
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

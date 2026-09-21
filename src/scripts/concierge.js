// Enlaces de WhatsApp con la plantilla de solicitud de cotización

const PHONE = '528114749578';
const DEFAULT_ORIGIN = 'Allende / Santiago / Monterrey';
const DEFAULT_DEST = 'Aeropuerto Internacional MTY / Zona Metropolitana';

const buildMessage = (service, origin, destination) =>
  [
    'Hola, quisiera cotizar un traslado con Regium.',
    '',
    `Servicio: ${service}`,
    `Salida: ${origin}`,
    `Destino: ${destination}`,
    'Fecha: ',
    'Hora: ',
    'Pasajeros: ',
    'Equipaje: ',
    'Número de vuelo (si aplica): ',
  ].join('\n');

export const whatsappHref = (service = 'Traslado ejecutivo', origin = DEFAULT_ORIGIN, destination = DEFAULT_DEST) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(buildMessage(service, origin, destination))}`;

export function setupConcierge() {
  document.querySelectorAll('.whatsapp-concierge-btn').forEach((btn) => {
    btn.href = whatsappHref(btn.dataset.service || undefined, btn.dataset.origin || undefined, btn.dataset.dest || undefined);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });
}

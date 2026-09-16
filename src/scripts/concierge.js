// Regium Luxury Concierge — WhatsApp Booking Link Generator
// Cobertura Ejecutiva: Allende, Santiago, Monterrey y Aeropuerto MTY

export function setupConcierge() {
  const defaultPhone = "528114749578"; // Regium Teléfono Ejecutivo Oficial
  
  const generateMessage = (service = "Traslado Ejecutivo", origin = "Allende / Santiago / Monterrey", destination = "Aeropuerto Internacional MTY / Zona Metropolitana") => {
    const text = 
      `*SOLICITUD CONCIERGE — REGIUM TRANSPORTE EJECUTIVO*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✦ *Servicio:* ${service}\n` +
      `📍 *Punto de Salida:* ${origin}\n` +
      `🎯 *Destino:* ${destination}\n` +
      `📅 *Fecha requerida:* \n` +
      `🕒 *Horario:* \n` +
      `👥 *Pasajeros:* (1-3 cómodos)\n` +
      `🧳 *Equipaje:* \n` +
      `✈️ *No. de Vuelo (si aplica):* \n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Deseo confirmar disponibilidad de unidad ejecutiva y tarifa acordada sin sorpresas._`;
      
    return `https://wa.me/${defaultPhone}?text=${encodeURIComponent(text)}`;
  };

  // Wire up all concierge action buttons
  const buttons = document.querySelectorAll('.whatsapp-concierge-btn');
  buttons.forEach((btn) => {
    const serviceType = btn.getAttribute('data-service') || 'Traslado Ejecutivo';
    const origin = btn.getAttribute('data-origin') || 'Allende / Santiago / Monterrey';
    const dest = btn.getAttribute('data-dest') || 'Aeropuerto Internacional MTY / Zona Metropolitana';

    btn.href = generateMessage(serviceType, origin, dest);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });
}

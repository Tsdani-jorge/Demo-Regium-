// Regium Luxury Concierge — WhatsApp Booking Link Generator

export function setupConcierge() {
  const defaultPhone = "528114749578"; // Regium Executive Phone
  
  const generateMessage = (service = "Traslado Ejecutivo", origin = "Polanco / Paseo de la Reforma", destination = "Aeropuerto Internacional Benito Juárez (AICM)") => {
    const text = 
      `*SOLICITUD CONCIERGE — REGIUM CDMX*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✦ *Servicio:* ${service}\n` +
      `📍 *Punto de Salida:* ${origin}\n` +
      `🎯 *Destino:* ${destination}\n` +
      `📅 *Fecha requerida:* \n` +
      `🕒 *Horario:* \n` +
      `👥 *Pasajeros:* (1-3 ejecutivos)\n` +
      `🧳 *Equipaje:* \n` +
      `✈️ *No. de Vuelo (si aplica):* \n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Deseo confirmar disponibilidad de unidad ejecutiva y tarifa cerrada sin sorpresas._`;
      
    return `https://wa.me/${defaultPhone}?text=${encodeURIComponent(text)}`;
  };

  // Wire up all concierge action buttons
  const buttons = document.querySelectorAll('.whatsapp-concierge-btn');
  buttons.forEach((btn) => {
    const serviceType = btn.getAttribute('data-service') || 'Traslado Ejecutivo Premium';
    const origin = btn.getAttribute('data-origin') || 'Punto a convenir en CDMX';
    const dest = btn.getAttribute('data-dest') || 'Destino en CDMX / Aeropuerto';

    btn.href = generateMessage(serviceType, origin, dest);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });
}

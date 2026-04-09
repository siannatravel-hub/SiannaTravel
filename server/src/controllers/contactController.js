import {
  triggerContactForm,
  triggerQuoteRequest,
  triggerBookingRequest,
} from '../services/webhookService.js';

export async function submitContactForm(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    // Fire webhook to n8n (non-blocking)
    triggerContactForm({ name, email, phone, message });

    res.json({
      success: true,
      message: 'Mensaje recibido. Nos pondremos en contacto pronto.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process contact form' });
  }
}

export async function submitQuoteRequest(req, res) {
  try {
    const { name, email, phone, packageId, travelers, dates, notes } = req.body;

    triggerQuoteRequest({ name, email, phone, packageId, travelers, dates, notes });

    res.json({
      success: true,
      message: 'Solicitud de cotización recibida. Te enviaremos la información pronto.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process quote request' });
  }
}

export async function submitBookingRequest(req, res) {
  try {
    const { name, email, phone, packageId, travelers, specialRequests } = req.body;

    triggerBookingRequest({ name, email, phone, packageId, travelers, specialRequests });

    res.json({
      success: true,
      message: 'Reserva recibida. Un agente se comunicará contigo para confirmar los detalles.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process booking request' });
  }
}

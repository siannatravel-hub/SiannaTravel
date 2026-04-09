import config from '../config/index.js';

/**
 * n8n Webhook Service
 * Sends event data to n8n for automation workflows.
 * Each form submission or user action triggers a webhook.
 */

async function sendWebhook(path, data) {
  const baseUrl = config.n8n.webhookUrl;
  if (!baseUrl) {
    console.warn('[n8n] Webhook URL not configured. Skipping webhook.');
    return { success: false, reason: 'Webhook URL not configured' };
  }

  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'siannatravel-web',
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`[n8n] Webhook error (${path}):`, error.message);
    return { success: false, reason: error.message };
  }
}

export async function triggerContactForm(formData) {
  return sendWebhook('/contact', {
    event: 'contact_form_submitted',
    data: formData,
  });
}

export async function triggerQuoteRequest(quoteData) {
  return sendWebhook('/quote', {
    event: 'quote_requested',
    data: quoteData,
  });
}

export async function triggerBookingRequest(bookingData) {
  return sendWebhook('/booking', {
    event: 'booking_initiated',
    data: bookingData,
  });
}

export async function triggerLeadCapture(leadData) {
  return sendWebhook('/lead', {
    event: 'lead_captured',
    data: leadData,
  });
}

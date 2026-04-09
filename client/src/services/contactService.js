import { api } from './api';

export async function submitContact(data) {
  return api.post('/contact', data);
}

export async function submitQuote(data) {
  return api.post('/contact/quote', data);
}

export async function submitBooking(data) {
  return api.post('/contact/booking', data);
}

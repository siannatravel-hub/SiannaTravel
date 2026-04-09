import config from '../config/index.js';

/**
 * Airline API Service
 * Abstracted layer for consuming external airline pricing APIs.
 * Designed to support multiple providers via adapter pattern.
 */

const MOCK_AIRLINES = {
  aeromexico: { name: 'Aeroméxico', code: 'AM', baseMultiplier: 1.0 },
  'air-france': { name: 'Air France', code: 'AF', baseMultiplier: 1.15 },
  latam: { name: 'LATAM Airlines', code: 'LA', baseMultiplier: 0.95 },
  copa: { name: 'Copa Airlines', code: 'CM', baseMultiplier: 1.05 },
  ana: { name: 'ANA', code: 'NH', baseMultiplier: 1.2 },
  'aerolineas-argentinas': {
    name: 'Aerolíneas Argentinas',
    code: 'AR',
    baseMultiplier: 0.9,
  },
};

/**
 * Fetch dynamic price from airline provider.
 * In production, replace with actual API calls.
 */
export async function getFlightPrice(origin, destination, date, airline) {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 100));

  const basePrice = 400 + Math.random() * 600;
  const airlineData = MOCK_AIRLINES[airline] || { baseMultiplier: 1.0 };
  const seasonMultiplier = getSeasonMultiplier(date);

  const price = Math.round(basePrice * airlineData.baseMultiplier * seasonMultiplier);

  return {
    origin,
    destination,
    date,
    airline: airlineData.name || airline,
    price,
    currency: 'USD',
    class: 'economy',
    available: true,
  };
}

export async function searchFlights(params) {
  const { origin, destination, departDate, returnDate } = params;

  const results = await Promise.all(
    Object.keys(MOCK_AIRLINES).map(async (key) => {
      const outbound = await getFlightPrice(origin, destination, departDate, key);
      const inbound = returnDate
        ? await getFlightPrice(destination, origin, returnDate, key)
        : null;

      return {
        airline: MOCK_AIRLINES[key],
        outbound,
        inbound,
        totalPrice: outbound.price + (inbound?.price || 0),
      };
    })
  );

  return results.sort((a, b) => a.totalPrice - b.totalPrice);
}

export function getAvailableAirlines() {
  return Object.entries(MOCK_AIRLINES).map(([key, val]) => ({
    id: key,
    ...val,
  }));
}

function getSeasonMultiplier(dateStr) {
  if (!dateStr) return 1.0;
  const month = new Date(dateStr).getMonth() + 1;
  // High season: Jun-Aug, Dec
  if ([6, 7, 8, 12].includes(month)) return 1.3;
  // Mid season: Mar-May, Sep-Nov
  if ([3, 4, 5, 9, 10, 11].includes(month)) return 1.0;
  // Low season: Jan-Feb
  return 0.85;
}

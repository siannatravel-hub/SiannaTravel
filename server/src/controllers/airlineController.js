import { searchFlights, getAvailableAirlines } from '../services/airlineService.js';

export async function search(req, res) {
  try {
    const { origin, destination, departDate, returnDate } = req.query;
    if (!origin || !destination || !departDate) {
      return res.status(400).json({
        error: 'Missing required params: origin, destination, departDate',
      });
    }

    const flights = await searchFlights({ origin, destination, departDate, returnDate });
    res.json({ data: flights, count: flights.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search flights' });
  }
}

export function listAirlines(_req, res) {
  try {
    const airlines = getAvailableAirlines();
    res.json({ data: airlines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airlines' });
  }
}

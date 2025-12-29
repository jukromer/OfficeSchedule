const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.msg || 'Unbekannter Fehler');
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const loginUser = (credentials) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(parseResponse);

export const fetchBookings = (token) =>
  fetch(`${API_BASE}/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(parseResponse);

export const createBooking = (token, booking) =>
  fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(booking)
  }).then(parseResponse);

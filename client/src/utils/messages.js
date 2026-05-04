export const translateApiMessage = (message) => {
  if (!message) {
    return '';
  }

  const dictionary = {
    'Invalid credentials': 'Ungültige Zugangsdaten',
    'Username and password are required': 'Benutzername und Passwort werden benötigt',
    'Booking conflict': 'Der Zeitraum ist bereits reserviert',
    'Booking deleted': 'Buchung gelöscht',
    Forbidden: 'Nicht erlaubt'
  };

  return dictionary[message] || message;
};

import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, CircularProgress, Snackbar } from '@mui/material';
import HeaderBar from './components/HeaderBar';
import AuthCard from './components/AuthCard';
import CalendarCard from './components/CalendarCard';
import BookingDialog from './components/BookingDialog';
import { translateApiMessage } from './utils/messages';
import { formatForApi, getDefaultBookingWindow } from './utils/datetime';
import { loginUser, fetchBookings, createBooking } from './services/api';
import './App.css';

dayjs.locale('de');

const emptyBooking = { title: '', start: null, end: null };

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginValues, setLoginValues] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftBooking, setDraftBooking] = useState(emptyBooking);
  const [successMessage, setSuccessMessage] = useState('');

  const authenticated = Boolean(token);

  const loadBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setBookingError('');

    try {
      const payload = await fetchBookings(token);
      setBookings(payload);
    } catch (error) {
      setBookingError(translateApiMessage(error.payload?.msg) || error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleLoginChange = (field, value) => {
    setLoginValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      const payload = await loginUser(loginValues);

      setToken(payload.token);
      setUsername(payload.username);
      localStorage.setItem('token', payload.token);
      localStorage.setItem('username', payload.username);
      setLoginValues({ username: '', password: '' });
    } catch (error) {
      setLoginError(translateApiMessage(error.payload?.msg) || error.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setBookings([]);
    setBookingError('');
    setLoading(false);
  };

  const openDialogWithBooking = (booking) => {
    setDraftBooking(booking);
    setDialogOpen(true);
    setBookingError('');
  };

  const handleManualBooking = () => {
    const slot = getDefaultBookingWindow();
    openDialogWithBooking({ title: '', ...slot });
  };

  const handleDateSelect = (selectionInfo) => {
    selectionInfo.view.calendar.unselect();
    openDialogWithBooking({
      title: 'Besprechung',
      start: dayjs(selectionInfo.start),
      end: dayjs(selectionInfo.end)
    });
  };

  const handleDraftChange = (field, value) => {
    setDraftBooking((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDraftBooking(emptyBooking);
  };

  const handleBookingSubmit = async () => {
    if (!draftBooking.title || !draftBooking.start || !draftBooking.end) {
      setBookingError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      await createBooking(token, {
        title: draftBooking.title,
        start: formatForApi(draftBooking.start),
        end: formatForApi(draftBooking.end)
      });

      closeDialog();
      setSuccessMessage('Buchung gespeichert');
      await loadBookings();
    } catch (error) {
      setBookingError(translateApiMessage(error.payload?.msg) || error.message);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box className="app-shell">
        <HeaderBar username={token ? username : null} onLogout={handleLogout} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            minHeight: 0,
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {!authenticated ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                minHeight: 0
              }}
            >
              <AuthCard
                values={loginValues}
                error={loginError}
                onChange={handleLoginChange}
                onSubmit={handleLoginSubmit}
              />
            </Box>
          ) : loading ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                minHeight: 0
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <CalendarCard
              bookings={bookings}
              error={bookingError}
              onManualBooking={handleManualBooking}
              onSelectSlot={handleDateSelect}
            />
          )}
        </Box>

        <BookingDialog
          open={dialogOpen}
          booking={draftBooking}
          onClose={closeDialog}
          onSubmit={handleBookingSubmit}
          onChange={handleDraftChange}
        />

        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default App;

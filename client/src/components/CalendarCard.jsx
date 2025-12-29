import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import deLocale from '@fullcalendar/core/locales/de';
import { Paper, Box, Typography, Button, Alert } from '@mui/material';

const CalendarCard = ({ bookings, error, onManualBooking, onSelectSlot }) => {
  const events = bookings.map((booking) => ({
    id: String(booking.id),
    title: booking.title,
    start: booking.start,
    end: booking.end,
    extendedProps: { created_by: booking.created_by }
  }));

  return (
    <Paper elevation={3} className="calendar-wrapper">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h6">Planung Konferenzraum</Typography>
          <Typography variant="body2" color="text.secondary">
            Markieren Sie im Kalender einen Zeitraum, um eine Buchung anzulegen.
          </Typography>
        </Box>
        <Button variant="contained" onClick={onManualBooking}>
          Neue Buchung
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek'
          }}
          height="100%"
          locales={[deLocale]}
          locale="de"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          scrollTime="08:00:00"
          allDaySlot={false}
          weekends={false}
          expandRows
          selectable
          selectMirror
          select={onSelectSlot}
          eventClick={(info) => {
            const creator = info.event.extendedProps?.created_by
              ? `\nErstellt von: ${info.event.extendedProps.created_by}`
              : '';
            alert(`${info.event.title}${creator}`);
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </Box>
    </Paper>
  );
};

export default CalendarCard;

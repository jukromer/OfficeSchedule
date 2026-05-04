import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack
} from '@mui/material';
import dayjs from 'dayjs';

const formatRange = (start, end) => {
  if (!start || !end) {
    return '';
  }
  const s = dayjs(start);
  const e = dayjs(end);
  return `${s.format('DD.MM.YYYY HH:mm')} – ${e.format('HH:mm')}`;
};

const EventDetailsDialog = ({ open, event, currentUser, onClose, onDelete }) => {
  if (!event) {
    return null;
  }

  const canDelete = currentUser && event.createdBy === currentUser;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {formatRange(event.start, event.end)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Erstellt von: {event.createdBy || 'unbekannt'}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Schließen</Button>
        {canDelete && (
          <Button color="error" variant="contained" onClick={onDelete}>
            Löschen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsDialog;

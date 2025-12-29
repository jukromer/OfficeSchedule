import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const BookingDialog = ({ open, booking, onClose, onSubmit, onChange }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Konferenzraum buchen</DialogTitle>
    <DialogContent>
      <TextField
        label="Titel"
        fullWidth
        margin="normal"
        value={booking.title}
        onChange={(event) => onChange('title', event.target.value)}
      />
      <DateTimePicker
        label="Beginn"
        value={booking.start}
        onChange={(value) => onChange('start', value)}
        ampm={false}
        format="DD.MM.YYYY HH:mm"
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal'
          }
        }}
      />
      <DateTimePicker
        label="Ende"
        value={booking.end}
        onChange={(value) => onChange('end', value)}
        ampm={false}
        format="DD.MM.YYYY HH:mm"
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal'
          }
        }}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose}>Abbrechen</Button>
      <Button variant="contained" onClick={onSubmit}>
        Buchung speichern
      </Button>
    </DialogActions>
  </Dialog>
);

export default BookingDialog;

import { Paper, Typography, Alert, TextField, Button, Box } from '@mui/material';

const AuthCard = ({ values, error, onChange, onSubmit }) => (
  <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '100%', boxSizing: 'border-box' }}>
    <Typography variant="h6" gutterBottom>
      Melden Sie sich an, um den Raumplan zu verwalten.
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    <Box component="form" onSubmit={onSubmit} className="login-form">
      <TextField
        label="Benutzername"
        value={values.username}
        onChange={(event) => onChange('username', event.target.value)}
        required
        fullWidth
        margin="normal"
        autoComplete="username"
      />
      <TextField
        label="Passwort"
        type="password"
        value={values.password}
        onChange={(event) => onChange('password', event.target.value)}
        required
        fullWidth
        margin="normal"
        autoComplete="current-password"
      />
      <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
        Anmelden
      </Button>
    </Box>
  </Paper>
);

export default AuthCard;

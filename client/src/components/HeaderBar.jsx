import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';

const HeaderBar = ({ username, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Konferenzraumplan
      </Typography>
      {username && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Angemeldet als {username}</Typography>
          <Button color="inherit" onClick={onLogout}>
            Abmelden
          </Button>
        </Stack>
      )}
    </Toolbar>
  </AppBar>
);

export default HeaderBar;

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Box from '@mui/material/Box';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <SportsSoccerIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MatchFinder
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
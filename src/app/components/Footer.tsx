"use client";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' MatchFinder. All Rights Reserved. Developed by Zeks.'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Link href="https://github.com/Zeks92" color="inherit" sx={{ mx: 1 }}>
            <GitHubIcon />
          </Link>
          <Link href="https://www.linkedin.com/in/zeljko-lazovic/" color="inherit" sx={{ mx: 1 }}>
            <LinkedInIcon />
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
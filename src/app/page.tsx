import Box from '@mui/material/Box';
import Footer from './components/Footer';
import Header from './components/Header';

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Footer />
    </Box>
  );
}
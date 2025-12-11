import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MatchFinderStepper from "./components/MatchFinderStepper";

export default function HomePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, flexGrow: 1 }}
      >
        <MatchFinderStepper />
      </Container>
      <Footer />
    </Box>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import RedirectPage from "./pages/RedirectPage";
import StatisticsPage from "./pages/StatisticsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

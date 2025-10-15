import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FestivalCardMint from './pages/FestivalCardMint'; // adjust path if different

function App() {
  return (
    <Router>
      <Routes>
        {/* your existing routes */}
        <Route path="/festival" element={<FestivalCardMint />} />
      </Routes>
    </Router>
  );
}

export default App;
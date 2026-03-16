import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <div className="bg-slate-900 min-h-screen text-white">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
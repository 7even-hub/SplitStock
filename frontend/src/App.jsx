import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// Public pages
import Onboarding from './pages/Onboarding.jsx';
import SignUp from './pages/SignUp.jsx';
import LogIn from './pages/LogIn.jsx';

// App pages
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import RecordSale from './pages/RecordSale.jsx';
import Purchases from './pages/Purchases.jsx';
import ReportsProfits from './pages/Reports-Profits.jsx';
import Settings from './pages/Settings.jsx';

// Sends people to the login page if they are not logged in
function RequireAuth({ children }) {
  const loggedIn = localStorage.getItem('stocksplit_auth') === 'true';
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Public pages: no sidebar */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />

      {/* Private pages: all share the sidebar from Layout */}
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/record-sale" element={<RecordSale />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/reports-profits" element={<ReportsProfits />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Any unknown address goes back to the start */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
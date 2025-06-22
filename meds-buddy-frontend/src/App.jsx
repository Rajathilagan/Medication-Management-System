import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/signupPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import CaretakerDashboard from './pages/CaretakerDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/caretaker" element={<CaretakerDashboard />} />
      <Route path="*" element={<NotFound /> }/>
    </Routes>
  );
}

export default App;
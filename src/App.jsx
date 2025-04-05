import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { SignupClient } from "./pages/SignupClient";
import { SignupFreelancer } from "./pages/SignupFreelancer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import UserDetails from "./pages/UserDetails";
import PortfolioPage from "./pages/PortfolioPage";
import ClientDashboard from "./pages/ClientDashboard";
import ClientDetails from "./pages/ClientDetails";
import FreelancerProfile from "./pages/FreelancerProfile";
import ClientActivity from "./pages/ClientActivity";
import FreelancerActivity from "./pages/FreelancerActivity";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client-dashboard/:id" element={<ClientDashboard />} />
        <Route path="/client-dashboard/:id/activity" element={<ClientActivity />} />
        <Route path="/client-dashboard/:id/details" element={<ClientDetails />} />
        <Route path="/freelancer/:id/profile" element={<FreelancerProfile />} />
        <Route path="/freelancer-dashboard/:id" element={<FreelancerDashboard />} />
        <Route path="/freelancer-dashboard/:id/details" element={<UserDetails />} />
        <Route path='/freelancer-dashboard/:id/portfolio' element={<PortfolioPage />} />
        <Route path="/freelancer-dashboard/:id/activity" element={<FreelancerActivity />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup-client" element={<SignupClient />} />
        <Route path="/signup-freelancer" element={<SignupFreelancer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={< Home />} />
      </Routes>
    </Router>
  );
}

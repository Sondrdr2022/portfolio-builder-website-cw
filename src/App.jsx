import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthPage, {SignupClient, SignupFreelancer} from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        fetchUserRole(data.session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      }
    });
  }, []);

  // Fetch user role from the "users" table
  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error.message);
    } else {
      setUserRole(data.role);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup-client" element={<SignupClient />} />
        <Route path="/signup-freelancer" element={<SignupFreelancer />} />

        {/* Protected Route for Dashboard */}
        <Route
          path="/dashboard"
          element={session ? <Dashboard userRole={userRole} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

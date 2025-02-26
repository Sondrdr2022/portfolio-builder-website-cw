import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ userRole }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="container mt-5">
      <h2>Welcome to Your Dashboard</h2>

      {userRole === "client" && <p>You are logged in as a **Client**.</p>}
      {userRole === "freelancer" && <p>You are logged in as a **Freelancer**.</p>}

      <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
    </div>
  );
}

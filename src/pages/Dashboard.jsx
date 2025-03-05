import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); 
  };

  return (
    <div className="container mt-5">
      <h2>Welcome to Your Dashboard</h2>
      <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
    </div>
  );
}

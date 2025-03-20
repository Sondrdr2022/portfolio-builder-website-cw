import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Sidebar({ userData }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="bg-dark text-white p-3 d-flex flex-column align-items-start" style={{ width: "250px", minHeight: "100vh" }}>
      <div className="d-flex align-items-center mb-4 w-100">
        <img
          src={userData?.image || "https://via.placeholder.com/60"}
          alt="Profile"
          className="rounded-circle me-3"
          width="60"
          height="60"
        />
        <div>
          <h5 className="fw-bold mb-0">{userData?.first_name} {userData?.last_name}</h5>
          <small className="text-muted">{userData?.job}</small>
        </div>
      </div>
      <ul className="list-unstyled w-100">
        <li className="my-3"><a href="#" className="text-white text-decoration-none">Dashboard</a></li>
        <li className="my-3"><a href="#" className="text-white text-decoration-none">Edit</a></li>
        <li className="my-3"><a href="#" className="text-white text-decoration-none">Portfolio</a></li>
        <li className="my-3"><a href="#" className="text-white text-decoration-none">Activity</a></li>
      </ul>
      <button className="btn btn-outline-light mt-auto w-100" onClick={handleLogout}>Log Out</button>
    </div>
  );
}

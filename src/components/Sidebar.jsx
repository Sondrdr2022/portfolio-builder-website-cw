import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Sidebar({ userData }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="bg-light p-3 d-flex flex-column align-items-center" style={{ width: "250px", minHeight: "100vh" }}>
      <img
        src={userData.image}
        alt="Profile"
        className="rounded-circle mb-3"
        width="100"
        height="100"
      />
      <h4>{userData.first_name} {userData.last_name}</h4>
      <p>{userData.job}</p>
      <ul className="list-unstyled text-center w-100">
        <li className="my-2"><a href="#">Dashboard</a></li>
        <li className="my-2"><a href="#">Edit</a></li>
        <li className="my-2"><a href="#">Portfolio</a></li>
        <li className="my-2"><a href="#">Activity</a></li>
      </ul>
      <button className="btn btn-danger mt-auto w-100" onClick={handleLogout}>Log Out</button>
    </div>
  );
}

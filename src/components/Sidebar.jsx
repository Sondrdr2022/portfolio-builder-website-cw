import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Hamburger and close icons

export default function Sidebar({ userData }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const goToDashboard = () => {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}`);
    }
  };

  const goToEditPage = () => {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}/details`);
    }
  };

  const goToPortfolio = () => {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}/portfolio`);
    }
  };
  
  

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="d-md-none position-fixed top-3 start-3 btn btn-dark rounded-circle p-2"
        style={{ zIndex: 9999 }}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>


      {/* Sidebar for larger screens */}
      <div
        className="bg-dark text-white p-3 d-none d-md-flex flex-column align-items-start"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <SidebarContent
          userData={userData}
          goToDashboard={goToDashboard}
          goToEditPage={goToEditPage}
          goToPortfolio={goToPortfolio}
          handleLogout={handleLogout}
        />
      </div>

      {/* Animated sidebar for mobile */}
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="bg-dark text-white p-3 d-flex flex-column align-items-start position-fixed top-0 start-0"
          style={{ width: "250px", height: "100vh", zIndex: 9999 }}
        >
          <button
            className="btn btn-light mb-3 align-self-end"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
          <SidebarContent
            userData={userData}
            goToDashboard={() => {
              goToDashboard();
              setIsOpen(false);
            }}
            goToEditPage={() => {
              goToEditPage();
              setIsOpen(false);
            }}
            goToPortfolio={() => {
              goToPortfolio();
              setIsOpen(false); // For mobile sidebar close on click
            }}
            handleLogout={handleLogout}
          />
        </motion.div>
      )}
    </>
  );
}

function SidebarContent({ userData, goToDashboard, goToEditPage, goToPortfolio, handleLogout }) {
  return (
    <>
      <div className="d-flex align-items-center mb-4 w-100">
        <img
          src={userData?.image || "https://via.placeholder.com/60"}
          alt="Profile"
          className="rounded-circle me-3"
          width="60"
          height="60"
        />
        <div>
          <h5 className="fw-bold mb-0">
            {userData?.first_name} {userData?.last_name}
          </h5>
          <small className="text-muted">{userData?.job}</small>
        </div>
      </div>
      <ul className="list-unstyled w-100">
        <li className="my-3">
          <button
            onClick={goToDashboard}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Dashboard
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToEditPage}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Details
          </button>
        </li>
        <li className="my-3">
        <button
          onClick={goToPortfolio}
          className="btn btn-link text-white p-0 text-decoration-none"
        >
          Portfolio
        </button>
        </li>
        <li className="my-3">
          <a href="#" className="text-white text-decoration-none">
            Activity
          </a>
        </li>
      </ul>
      <button
        className="btn btn-outline-light mt-auto w-100"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </>
  );
}

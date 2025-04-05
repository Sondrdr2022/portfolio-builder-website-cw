import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function ClientSidebar({ userData }) {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = userData?.id || paramId;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const goToDashboard = () => {
    if (id) navigate(`/client-dashboard/${id}`);
  };

  const goToEditPage = () => {
    if (id) navigate(`/client-dashboard/${id}/details`);
  };

  const goToActivity = () => {
    if (id) navigate(`/client-dashboard/${id}/activity`);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="d-md-none position-fixed top-3 start-3 btn btn-dark rounded-circle p-2"
        style={{ zIndex: 9999 }}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar for desktop */}
      <div
        className="bg-dark text-white d-none d-md-flex flex-column p-3"
        style={{ width: "250px", height: "100vh", position: "sticky", top: 0 }}
      >
        <SidebarContent
          userData={userData}
          goToDashboard={goToDashboard}
          goToEditPage={goToEditPage}
          goToActivity={goToActivity}
          handleLogout={handleLogout}
        />
      </div>

      {/* Sidebar for mobile */}
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="bg-dark text-white p-3 d-flex flex-column position-fixed top-0 start-0"
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
            goToActivity={() => {
              goToActivity();
              setIsOpen(false);
            }}
            handleLogout={handleLogout}
          />
        </motion.div>
      )}
    </>
  );
}

function SidebarContent({ userData, goToDashboard, goToEditPage, goToActivity, handleLogout }) {
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(userData?.profile_image);

  useEffect(() => {
    setProfileImage(userData?.profile_image);
  }, [userData?.profile_image]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !userData?.id) return;

    const fileName = `${userData.id}-${Date.now()}.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;
    setProfileImage(publicUrl);

    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_image: publicUrl })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user image:", updateError);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mb-4 w-100">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <img
          src={profileImage || "https://via.placeholder.com/60"}
          alt="Profile"
          className="rounded-circle me-3"
          width="60"
          height="60"
          onClick={handleImageClick}
          style={{
            cursor: "pointer",
            border: "2px solid #fff",
            objectFit: "cover",
            transition: "0.3s ease",
          }}
        />
        <div>
          <h5 className="fw-bold mb-0">
            {userData?.first_name || "Client"} {userData?.last_name || ""}
          </h5>
          <small className="text-muted">{userData?.job || "Client"}</small>
        </div>
      </div>

      <ul className="list-unstyled w-100">
        <li className="my-3">
          <button
            onClick={goToDashboard}
            className="btn btn-link text-white text-decoration-none p-0"
          >
            Dashboard
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToEditPage}
            className="btn btn-link text-white text-decoration-none p-0"
          >
            Details
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToActivity}
            className="btn btn-link text-white text-decoration-none p-0"
          >
            Activity
          </button>
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

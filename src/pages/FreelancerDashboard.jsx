import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from 'react-router-dom';

export default function FreelancerDashboard() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, job, email, country, mobile, description, profile_image")
        .eq("id", id)
        .single();

      if (error) {
        console.error("User not found:", error);
        navigate("/");
      } else {
        setUserData(data);
      }
    };

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("freelancer_portfolios")
        .select("id, project_name, project_description, project_url, screenshot_url")
        .eq("freelancer_id", id);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
    };

    fetchUserData();
    fetchProjects();
  }, [id, navigate]);

  const loadMoreProjects = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("freelancer_portfolios")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Failed to delete project:", error);
      alert("An error occurred while deleting the project.");
    } else {
      setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
    }
  };

  return (
    <div className="d-flex">
      <Sidebar userData={userData} />
      <div className="p-4 flex-grow-1 bg-white" style={{ padding: '2rem' }}>
        {userData && (
          <>
            <h2 className="fw-bold mb-4">Dashboard</h2>
            <div className="d-flex align-items-start mb-4">
              <img
                src={userData.profile_image || "https://via.placeholder.com/120"}
                alt="Profile"
                className="rounded-circle me-4"
                width="120"
                height="120"
                style={{
                  objectFit: "cover",
                  border: "3px solid #dee2e6",
                  padding: "4px",
                  backgroundColor: "#fff",
                }}
              />
              <div>
                <h3 className="fw-bold">{userData.first_name} {userData.last_name}</h3>
                <p className="text-muted mb-1">{userData.job}</p>
                {userData.description && (
                  <p className="fst-italic text-secondary mb-2">{userData.description}</p>
                )}
              </div>
            </div>

            <h4 className="fw-bold mb-3 text-center">My Projects</h4>
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              {projects.slice(0, visibleCount).map((project) => (
                <div key={project.id} className="card position-relative" style={{ width: '18rem' }}>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="btn btn-sm btn-danger position-absolute"
                    style={{ top: '5px', right: '5px' }}
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                  <img
                    src={project.screenshot_url || "https://via.placeholder.com/300"}
                    className="card-img-top"
                    alt={project.project_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{project.project_name}</h5>
                    <p className="card-text">{project.project_description}</p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Go to Website
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < projects.length && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={loadMoreProjects}>See More</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerAndProjects = async () => {
      setLoading(true);

      // Fetch freelancer info
      const { data: freelancerData, error: freelancerError } = await supabase
        .from("users")
        .select("first_name, last_name, job, profile_image, description")
        .eq("id", id)
        .single();

      if (freelancerError) {
        console.error("Error fetching freelancer:", freelancerError);
      } else {
        setFreelancer(freelancerData);
      }

      console.log("🧠 ID from URL:", id);

      // Fetch freelancer projects
      const { data: projectData, error: projectError } = await supabase
        .from("freelancer_portfolios")
        .select("id, project_name, project_description, project_url, screenshot_url")
        .eq("freelancer_id", String(id))
        .order("created_at", { ascending: false });

      if (projectError) {
        console.error("Error fetching projects:", projectError);
      } else {
        setProjects(projectData);
      }

      
    console.log("✅ Raw result:", projectData);
    console.log("❌ Error:", projectError);

      setLoading(false);
    };

    if (id) fetchFreelancerAndProjects();
  }, [id]);

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Freelancer Info */}
          {freelancer && (
            <>
              <h2 className="fw-bold mb-4">Dashboard</h2>
              <div className="d-flex align-items-start mb-5">
                <img
                  src={freelancer.profile_image || "https://via.placeholder.com/120"}
                  alt="Profile"
                  className="rounded-circle me-4"
                  width="120"
                  height="120"
                  style={{
                    objectFit: "cover",
                    border: "3px solid #dee2e6",
                    padding: "4px",
                  }}
                />
                <div>
                  <h3 className="fw-bold">
                    {freelancer.first_name} {freelancer.last_name}
                  </h3>
                  <p className="text-muted mb-1">{freelancer.job}</p>
                  <p className="text-secondary">{freelancer.description}</p>
                  <button className="btn btn-success mt-2">Request</button>
                </div>
              </div>
            </>
          )}

          {/* Projects */}
          <h4 className="fw-bold mb-3 text-center">My Projects</h4>
          {projects.length === 0 ? (
            <p className="text-muted text-center">No projects available.</p>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {projects.map((project) => (
                <div key={project.id} className="card" style={{ width: "18rem" }}>
                  <img
                    src={
                      project.screenshot_url ||
                      "https://via.placeholder.com/300x180?text=No+Image"
                    }
                    className="card-img-top"
                    alt={project.project_name || "Project Screenshot"}
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
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchFreelancer = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, job, profile_image, description")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching freelancer:", error);
      else setFreelancer(data);
    };

    const fetchProjects = async () => {
        const { data, error } = await supabase
          .from("freelancer_portfolios")
          .select("*")
          .eq("freelancer_id", id)
          .order("created_at", { ascending: false }); // optional
      
        if (error) {
          console.error("Error fetching projects:", error);
        } else {
          console.log("Fetched projects:", data); // ✅ add this to check
          setProjects(data);
        }
      };
      

    fetchFreelancer();
    fetchProjects();
  }, [id]);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

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
              style={{ objectFit: "cover", border: "3px solid #dee2e6", padding: "4px" }}
            />
            <div>
              <h3 className="fw-bold">{freelancer.first_name} {freelancer.last_name}</h3>
              <p className="text-muted mb-1">{freelancer.job}</p>
              <p className="text-secondary">{freelancer.description}</p>
              <button className="btn btn-success mt-2">Request</button>
            </div>
          </div>

          <h4 className="fw-bold mb-3 text-center">My Projects</h4>
          {projects.length === 0 ? (
            <p className="text-muted text-center">No projects available.</p>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {projects.map((project) => (
                <div key={project.id} className="card" style={{ width: '18rem' }}>
                    <img
                    src={project.screenshot_url || "https://via.placeholder.com/300x180?text=No+Image"}
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

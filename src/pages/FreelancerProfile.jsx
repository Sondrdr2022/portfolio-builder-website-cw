import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    project_name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("freelancer_requests").insert([
      {
        freelancer_id: id,
        client_id: clientId,
        ...form,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      alert(`❌ Request failed: ${error.message}`);
      return;
    }

    alert("✅ Request submitted successfully!");
    setShowModal(false);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      project_name: "",
      description: "",
    });
  };

  useEffect(() => {
    const fetchFreelancerAndProjects = async () => {
      setLoading(true);

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

      setLoading(false);
    };

    const fetchClientId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;
      setClientId(user.id);
    };

    if (id) {
      fetchFreelancerAndProjects();
      fetchClientId();
    }
  }, [id]);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                  <h3 className="fw-bold">{freelancer.first_name} {freelancer.last_name}</h3>
                  <p className="text-muted mb-1">{freelancer.job}</p>
                  <p className="text-secondary">{freelancer.description}</p>
                  <button className="btn btn-success mt-2" onClick={() => setShowModal(true)}>
                    Request
                  </button>
                </div>
              </div>
            </>
          )}

          <h4 className="fw-bold mb-3 text-center">My Projects</h4>
          {projects.length === 0 ? (
            <p className="text-muted text-center">No projects available.</p>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {projects.map((project) => (
                <div key={project.id} className="card" style={{ width: "18rem" }}>
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

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Request Freelancer</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>First Name</label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Last Name</label>
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Project Name</label>
                    <input
                      name="project_name"
                      value={form.project_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={form.description}
                      onChange={handleChange}
                      className="form-control"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)} type="button">
                    Cancel
                  </button>
                  <button className="btn btn-success" type="submit">
                    Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

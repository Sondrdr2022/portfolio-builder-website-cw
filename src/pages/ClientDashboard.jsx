import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ClientSidebar from "../components/ClientSidebar.JSX";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [userData, setUserData] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching client profile:", error);
        navigate("/");
      } else {
        setUserData(data);
      }
    };

    const fetchFreelancers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, job, profile_image, role, rate")
        .eq("role", "freelancer");

      if (error) {
        console.error("Error fetching freelancers:", error);
      } else {
        setFreelancers(data);
      }
    };

    fetchUser();
    fetchFreelancers();
  }, [navigate]);

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const fullName = `${freelancer.first_name} ${freelancer.last_name}`.toLowerCase();
    const job = freelancer.job?.toLowerCase() || "";
    const query = search.toLowerCase();

    return fullName.includes(query) || job.includes(query);
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <ClientSidebar userData={userData} />

      <div className="flex-grow-1 bg-light p-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold">Dashboard</h2>
        </div>

        {/* Centered content */}
        <div className="d-flex justify-content-center mb-5">
          <div className="text-center" style={{ maxWidth: "600px", width: "100%" }}>
            <p className="text-muted mb-4">
              Use this dashboard to connect with freelancers, oversee your portfolio, and stay updated on every project milestone. It’s designed to help you focus on what matters most — bringing your ideas to life and watching your progress unfold with each new step.
            </p>

            <h4 className="fw-bold mb-3">Find Freelancer</h4>
            <div className="input-group mx-auto" style={{ maxWidth: "400px" }}>
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Freelancer Cards */}
        <div className="d-flex flex-wrap gap-4 justify-content-center">
          {filteredFreelancers.slice(0, visibleCount).map((freelancer) => (
            <div key={freelancer.id} className="card shadow-sm" style={{ width: "250px" }}>
              <div className="card-body text-center">
                <img
                  src={freelancer.profile_image || "https://via.placeholder.com/80"}
                  className="rounded-circle mb-2"
                  width="80"
                  height="80"
                  alt="Freelancer"
                />
                <h6 className="fw-bold mb-0">
                  {freelancer.first_name} {freelancer.last_name}
                </h6>
                <small className="text-muted">{freelancer.job}</small>
                <div className="mt-2 mb-2">
                  <strong>${freelancer.rate || 50}/hr</strong>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/freelancer/${freelancer.id}/profile`)}
                    >
                    See more
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {visibleCount < filteredFreelancers.length && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

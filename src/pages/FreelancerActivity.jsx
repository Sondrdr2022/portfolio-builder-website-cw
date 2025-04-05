import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";

export default function FreelancerActivity() {
  const [requests, setRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        navigate("/");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, first_name, last_name, job, profile_image")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile:", profileError);
        return;
      }

      setUserData(profile);

      const { data, error: requestError } = await supabase
        .from("freelancer_requests")
        .select("*, client:client_id(first_name, last_name, email)")
        .eq("freelancer_id", user.id)
        .order("created_at", { ascending: false });

      if (requestError) {
        console.error("Failed to fetch requests:", requestError);
      } else {
        setRequests(data);
      }
    };

    fetchRequests();
  }, [navigate]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("freelancer_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("❌ Failed to update request status.");
      console.error("Update error:", error);
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="container-fluid d-flex flex-column flex-md-row p-0" style={{ minHeight: "100vh" }}>
      <div style={{ minWidth: "250px" }}>
        <Sidebar userData={userData} />
      </div>

      <main className="flex-grow-1 bg-light p-3 p-md-4 overflow-auto">
        <h2 className="fw-bold mb-4 text-center text-md-start">Activity</h2>

        {requests.length === 0 ? (
          <p className="text-muted">No incoming requests.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.project_name}</td>
                    <td>{req.description}</td>
                    <td>{req.client?.first_name} {req.client?.last_name}</td>
                    <td>{req.client?.email}</td>
                    <td>{new Date(req.created_at).toLocaleString()}</td>
                    <td className="text-center">
                      <span
                        className={`badge px-3 py-2 text-white rounded-pill ${
                          req.status === "accepted"
                            ? "bg-success"
                            : req.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      {req.status === "pending" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => updateStatus(req.id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => updateStatus(req.id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

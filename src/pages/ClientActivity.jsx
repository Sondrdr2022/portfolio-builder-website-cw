import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ClientSidebar from "../components/ClientSidebar";

export default function ClientActivity() {
  const [requests, setRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientRequests = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        navigate("/");
        return;
      }

      const { data: fullUser, error: profileError } = await supabase
        .from("users")
        .select("id, first_name, last_name, job, profile_image")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch client profile:", profileError);
      } else {
        setUserData(fullUser);
      }

      const { data, error: requestError } = await supabase
        .from("freelancer_requests")
        .select("*, users:freelancer_id(first_name, last_name)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (requestError) {
        console.error("Failed to fetch requests:", requestError);
      } else {
        setRequests(data);
      }
    };

    fetchClientRequests();
  }, [navigate]);

  const handleCancel = async (id) => {
    const { error } = await supabase.from("freelancer_requests").delete().eq("id", id);

    if (error) {
      alert("❌ Failed to cancel request.");
      console.error("Cancel error:", error);
    } else {
      setRequests((prev) => prev.filter((req) => req.id !== id));
      alert("✅ Request cancelled.");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh" }}>
      {userData ? (
        <ClientSidebar userData={userData} />
      ) : (
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          Loading...
        </div>
      )}

      <div className="flex-grow-1 p-3 p-md-4 bg-light">
        <h2 className="fw-bold mb-4 text-center text-md-start">Activities</h2>

        {requests.length === 0 ? (
          <p className="text-muted">You haven’t sent any requests yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark text-center">
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Freelancer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="align-middle">
                    <td>{req.project_name}</td>
                    <td>{req.description}</td>
                    <td>
                      {req.users?.first_name} {req.users?.last_name}
                    </td>
                    <td>{new Date(req.created_at).toLocaleString()}</td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm text-white ${
                          req.status === "accepted"
                            ? "btn-success"
                            : req.status === "rejected"
                            ? "btn-danger"
                            : "btn-warning"
                        }`}
                        disabled
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </button>
                    </td>
                    <td className="text-center">
                      {req.status === "pending" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(req.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

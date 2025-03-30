import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff } from "lucide-react"; // Add this to the top of the file
import ClientSidebar from "../components/ClientSidebar.jsx";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    password: "",
    country: "",
    description: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch user:", error);
        navigate("/");
      } else {
        setUserData(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          role: data.role || "",
          email: data.email || "",
          password: data.password, // Leave empty for security
          country: data.country || "",
          description: data.description || ""
        });
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = { ...form };
    if (!updates.password) delete updates.password; // Don't update password if left blank

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error);
      alert("Update failed");
    } else {
      alert("Profile updated!");
    }
  };

  return (
    <div className="d-flex">
      <ClientSidebar userData={userData} />

      <div className="flex-grow-1 p-5 bg-light">
        <h2 className="fw-bold mb-4">Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Firstname</label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={form.first_name}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Lastname</label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={form.last_name}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Role</label>
              <input
                type="text"
                name="role"
                className="form-control"
                value={form.role}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col-md-4">
            <label className="form-label">Password</label>
            <div className="input-group">
                <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                disabled
                />
                <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={form.country}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="5"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

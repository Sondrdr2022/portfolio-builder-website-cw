import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupFreelancerForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    mobile: "",
    job: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
          mobile: formData.mobile,
          role: "client", // or "freelancer"
          job: formData.job || null,
        }
      }
    });
    

    if (error) {
      setError(error.message);
    } else {
      alert("✅ Account created! Please verify your email before logging in.");
      navigate("/login");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Sign Up as a Freelancer</h2>
        <form onSubmit={handleSignup}>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8+ characters)"
              className="form-control"
              onChange={handleChange}
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="job"
              placeholder="Job Role (e.g., Designer, Developer)"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Contact"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <select
              name="country"
              className="form-select"
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Create Account
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-primary">Log In</a>
        </p>
      </div>
    </div>
  );
}

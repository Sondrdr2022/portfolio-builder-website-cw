import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function SignupClientForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    mobile: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    await supabase.from("users").insert([
      {
        id: data.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        country: formData.country,
        password: formData.password,
        role: "client",
        mobile: formData.mobile,
      },
    ]);

    alert("Account created successfully! Please check your email to verify.");
    navigate("/dashboard");
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Sign Up as a Client</h2>
        <form onSubmit={handleSignup}>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row mb-3">
            <div className="col">
              <input type="text" name="firstName" placeholder="First Name" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col">
              <input type="text" name="lastName" placeholder="Last Name" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8 or more characters)"
              className="form-control"
              onChange={handleChange}
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
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
            <select name="country" className="form-select" required onChange={handleChange}>
              <option value="">Select your country</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <button className="btn btn-success w-100">Create Account</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-primary">Log In</a>
        </p>
      </div>
    </div>
  );
}

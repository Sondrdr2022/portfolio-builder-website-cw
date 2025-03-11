import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Login successful!");
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-danger text-center">{error}</p>}
      
      <div className="mb-3">
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3 position-relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button className="btn btn-success w-100">Login</button>

    </form>
  );
}

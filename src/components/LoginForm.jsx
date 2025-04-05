import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;

    // Check if user exists in users table
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError || !existingUser) {
      // If not found, insert new user using metadata
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          country: user.user_metadata?.country || "",
          mobile: user.user_metadata?.mobile || "",
          job: user.user_metadata?.job || null,
          role: user.user_metadata?.role || "",
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        setError("❌ Could not complete profile setup. Please contact support.");
        setLoading(false);
        return;
      }
    }

    // Fetch user again for role-based redirect
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role, id")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (roleError || !userData) {
      setError("❌ User role not found");
      return;
    }

    // Redirect based on role
    if (userData.role === "freelancer") {
      navigate(`/freelancer-dashboard/${userData.id}`);
    } else if (userData.role === "client") {
      navigate(`/client-dashboard/${userData.id}`);
    } else {
      setError("❌ Unknown user role");
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
          className="position-absolute top-50 end-0 translate-middle-y me-3"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button className="btn btn-success w-100" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

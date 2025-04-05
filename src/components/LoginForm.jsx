import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const user = authData.user;
    console.log("Signed in user ID:", user.id);

    // Check if user exists in 'users' table
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError || !existingUser) {
      console.log("No user record found, creating one...");

      // Insert into users table using metadata
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          country: user.user_metadata?.country,
          mobile: user.user_metadata?.mobile,
          job: user.user_metadata?.job || null,
          role: user.user_metadata?.role,
        },
      ]);

      if (insertError) {
        console.error("Failed to insert user into users table:", insertError);
        setError("Could not complete profile setup. Please contact support.");
        return;
      }
    }

    // Get user again to fetch role
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role, id")
      .eq("id", user.id)
      .single();

    if (roleError || !userData) {
      setError("User role not found");
      return;
    }

    // Redirect based on role
    if (userData.role === "freelancer") {
      navigate(`/freelancer-dashboard/${userData.id}`);
    } else if (userData.role === "client") {
      navigate(`/client-dashboard/${userData.id}`);
    } else {
      setError("User role not found");
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

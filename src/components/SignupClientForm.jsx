import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SignupClientForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        role: "client",
      },
    ]);

    alert("Account created successfully! Please check your email to verify.");
    navigate("/");
  };

  return (
    <form onSubmit={handleSignup}>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="mb-3">
        <input type="text" name="firstName" placeholder="First Name" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input type="text" name="lastName" placeholder="Last Name" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input type="email" name="email" placeholder="Email" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input type="password" name="password" placeholder="Password" className="form-control" onChange={handleChange} required />
      </div>
      <button className="btn btn-success w-100">Create Account</button>
    </form>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import Supabase client
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">
          {isLogin ? "Log in to Your Account" : "Join as a Client or Freelancer"}
        </h2>

        {isLogin ? (
          <LoginForm setIsLogin={setIsLogin} />
        ) : (
          <SignupForm setIsLogin={setIsLogin} />
        )}

        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="btn btn-link p-0" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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
      navigate("/dashboard"); // Redirect to a dashboard after login
    }
  };

  return (
    <form onSubmit={handleLogin} className="mb-3">
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="mb-3">
        <input type="email" placeholder="Email" className="form-control" required onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <input type="password" placeholder="Password" className="form-control" required onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-success w-100">Login</button>
    </form>
  );
}

function SignupForm({ setIsLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleSignup = () => {
    if (selectedRole === 'freelancer') {
      navigate('/signup-freelancer');
    } else if (selectedRole === 'client') {
      navigate('/signup-client');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <button 
          className={`btn w-50 me-2 ${selectedRole === 'client' ? 'btn-primary' : 'btn-outline-secondary'}`} 
          onClick={() => setSelectedRole('client')}
        >
          I'm a Client
        </button>
        <button 
          className={`btn w-50 ${selectedRole === 'freelancer' ? 'btn-primary' : 'btn-outline-secondary'}`} 
          onClick={() => setSelectedRole('freelancer')}
        >
          I'm a Freelancer
        </button>
      </div>
      <button className="btn btn-success w-100" disabled={!selectedRole} onClick={handleSignup}>
        Create Account
      </button>
      <p className="text-center mt-3">Already have an account? <Link to="/" className="text-primary">Log In</Link></p>
    </div>
  );
}

export function SignupFreelancer() {
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

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Store user details in the "users" table
    const { error: dbError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          country: formData.country,
          password: formData.password,
          role: "freelancer", // Role is freelancer
        },
      ]);

    if (dbError) {
      setError(dbError.message);
    } else {
      alert("Account created successfully! Please check your email to verify.");
      navigate("/");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Sign up to find work you love</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="row mb-3">
            <div className="col">
              <input type="text" name="firstName" placeholder="First name" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col">
              <input type="text" name="lastName" placeholder="Last name" className="form-control" required onChange={handleChange} />
            </div>
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Work email address" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input type="password" name="password" placeholder="Password (8 or more characters)" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <select name="country" className="form-select" required onChange={handleChange}>
              <option value="">Select your country</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">Create my account</button>
        </form>
        <p className="text-center mt-3">Already have an account? <Link to="/">Log In</Link></p>
      </div>
    </div>
  );
}

export function SignupClient() {
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

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Store user details in the "users" table
    const { error: dbError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          country: formData.country,
          password: formData.password,
          role: "client", // Role is client
        },
      ]);

    if (dbError) {
      setError(dbError.message);
    } else {
      alert("Account created successfully! Please check your email to verify.");
      navigate("/");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Sign up to hire talent</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="row mb-3">
            <div className="col">
              <input type="text" name="firstName" placeholder="First name" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col">
              <input type="text" name="lastName" placeholder="Last name" className="form-control" required onChange={handleChange} />
            </div>
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Work email address" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input type="password" name="password" placeholder="Password (8 or more characters)" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <select name="country" className="form-select" required onChange={handleChange}>
              <option value="">Select your country</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">Create my account</button>
        </form>
        <p className="text-center mt-3">Already have an account? <Link to="/">Log In</Link></p>
      </div>
    </div>
  );
}

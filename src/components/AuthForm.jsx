import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg bg-white rounded" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">
          {isLogin ? "Log in to Your Account" : "Join as a Client or Freelancer"}
        </h2>

        {isLogin ? <LoginForm /> : (
          <div>
            <div className="d-flex justify-content-between mb-3">
              <Link to="/signup-client" className="btn btn-outline-primary w-50 me-2">I'm a Client</Link>
              <Link to="/signup-freelancer" className="btn btn-outline-primary w-50">I'm a Freelancer</Link>
            </div>
          </div>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        console.log("Raw users:", data);
        // Filter for freelancers only
        const filtered = data.filter(user => user.role === "freelancer");
        setFreelancers(filtered);
      }
    };

    fetchFreelancers();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white p-3 shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">jobstealers</span>
          <div>
            <Link to="/login" className="btn btn-outline-dark me-2">Log In</Link>
            <Link to="/login" className="btn btn-dark">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="position-relative text-center text-white"
        style={{
          backgroundImage: "url('/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>

        <div className="container position-relative">
          <h1 className="fw-bold">
            Bridging the gap between client and freelancer
          </h1>
          <p className="text-light">
            Empower freelancers to create stunning, professional portfolios effortlessly.
            Customize your profile, showcase projects, and upload documents—all in one user-friendly platform.
          </p>
          <Link to="/login" className="btn btn-warning btn-lg fw-bold px-4">
            START
          </Link>
        </div>
      </header>

      {/* Freelancers Section */}
      <section className="container text-center my-5">
        <h2 className="fw-bold">Meet Top Freelancers</h2>
        <p className="text-muted mb-4">
          Browse through skilled freelancers offering their services at competitive rates.
        </p>

        <div className="row justify-content-center">
          {freelancers.length === 0 ? (
            <p className="text-muted">No freelancers found.</p>
          ) : (
            freelancers.map((freelancer) => (
              <div key={freelancer.id} className="col-md-6 col-lg-3 mb-4">
                <div className="card shadow-sm text-center p-3 h-100">
                  <img
                    src={freelancer.profile_image || "https://via.placeholder.com/100"}
                    className="rounded-circle mx-auto"
                    alt="Freelancer"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "3px solid #ddd",
                    }}
                  />
                  <h5 className="mt-3">
                    {freelancer.first_name} {freelancer.last_name}
                  </h5>
                  <p className="text-muted">{freelancer.job || "Freelancer"}</p>
                  <p className="fw-bold mt-2">
                    ${freelancer.rate || 0}/hr
                  </p>
                  <Link to="/login" className="btn btn-success">
                    See more
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

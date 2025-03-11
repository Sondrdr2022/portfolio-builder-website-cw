import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white p-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold">jobstealers</a>
          <div>
            <Link to="/login" className="btn btn-outline-dark me-2">Log In</Link>
            <Link to="/login" className="btn btn-dark">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dark Overlay */}
      <header
        className="position-relative text-center text-white"
        style={{
          backgroundImage: "url('src/assets/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Dark overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>

        {/* Content */}
        <div className="container position-relative">
          <h1 className="fw-bold">Bridging the gap between client and freelancer</h1>
          <p className="text-light">
            Empower freelancers to create stunning, professional portfolios effortlessly.
            Customize your profile, showcase projects, and upload documents—all in one user-friendly platform.
          </p>
          <Link to="/login" className="btn btn-warning btn-lg fw-bold px-4">START</Link>
        </div>
      </header>

      {/* Freelancer Section Title */}
      <section className="container text-center mt-5">
        <h2 className="fw-bold">Meet Top Freelancers</h2>
        <p className="text-muted">
          Browse through skilled freelancers offering their services at competitive rates.
        </p>
      </section>

      {/* Freelancer Profiles Section */}
      <section className="container mt-3">
            <div className="row">
            {freelancers.map((freelancer, index) => (
                <div key={index} className="col-md-3">
                    <div className="card p-3 shadow-sm text-center">
                    {/* Freelancer Image */}
                    <div className="d-flex justify-content-center">
                        <img
                        src={freelancer.image}
                        className="rounded-circle"
                        alt="Freelancer"
                        style={{
                            width: "100px",  // Set fixed width
                            height: "100px", // Set fixed height
                            objectFit: "cover", // Ensure image covers the circular area
                            border: "3px solid #ddd" // Optional: Adds a border for better visibility
                        }}
                        />
                    </div>

                    {/* Freelancer Info */}
                    <h5 className="mt-3">{freelancer.name}</h5>
                    <p className="text-muted">{freelancer.title}</p>
                    <span className="badge bg-success">{freelancer.rating} ⭐ ({freelancer.jobs} jobs)</span>
                    <p className="fw-bold mt-2">{freelancer.price}/hr</p>
                    <Link to="/login" className="btn btn-success">See more</Link>
                    </div>
                </div>
                ))}
            </div>
        </section>
    </div>
  );
}

// Sample freelancer data
const freelancers = [
  { name: "Allie P.", title: "Copyeditor • Proofreader", price: "$30", rating: "5.0/5", jobs: 7, image: "https://static01.nyt.com/newsgraphics/2020/11/12/fake-people/4b806cf591a8a76adfc88d19e90c8c634345bf3d/fallbacks/mobile-05.jpg" },
  { name: "Edlira B.", title: "Outsourcing Agent • VA", price: "$20", rating: "5.0/5", jobs: 6, image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Susan H.", title: "Certified Coach • Copywriter", price: "$50", rating: "5.0/5", jobs: 28, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Kim F.", title: "Writer • Editor", price: "$60", rating: "4.9/5", jobs: 303, image: "https://www.mobiles.co.uk/blog/content/images/size/w2000/2017/10/face-1.jpg" }
];

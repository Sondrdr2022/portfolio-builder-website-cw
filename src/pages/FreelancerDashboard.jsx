import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from 'react-router-dom';

export default function FreelancerDashboard() {
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, job, email, country, mobile, description") 
        .eq("id", id)
        .single();

      if (error) {
        console.error("User not found:", error);
        navigate("/");
      } else {
        setUserData(data);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  console.log("User data:", userData);

  return (
    <div className="d-flex">
      <Sidebar userData={userData} />
      <div className="p-4 flex-grow-1 bg-white" style={{ padding: '2rem' }}>
        {userData && (
          <>
            <h2 className="fw-bold mb-4">Dashboard</h2>
            <div className="d-flex align-items-start mb-4">
              <img
                // src={userData.image}
                src="https://www.gravatar.com/avatar/"
                alt="Profile"
                className="rounded-circle me-4"
                width="120"
                height="120"
              />
              <div>
                <h3 className="fw-bold">{userData.first_name} {userData.last_name}</h3>
                <p className="text-muted mb-1">{userData.job}</p>
                {userData.description && (
                  <p className="fst-italic text-secondary mb-2">{userData.description}</p>
                )}
              </div>
            </div>
            <h4 className="fw-bold mb-3 text-center">My Projects</h4>
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              {[1, 2, 3].map((project) => (
                <div key={project} className="card" style={{ width: '18rem' }}>
                  <img src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg" className="card-img-top" alt="Project" />
                  <div className="card-body">
                    <h5 className="card-title">Project {project}</h5>
                    <p className="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="#" className="btn btn-primary">Go to Website</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary">See More</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

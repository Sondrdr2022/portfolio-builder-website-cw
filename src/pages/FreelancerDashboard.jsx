import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import { useParams } from 'react-router-dom';


export default function FreelancerDashboard() {
  const [userData, setUserData] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, job, email, country, mobile")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error(error);
        } else {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar userData={userData} />
      <div className="p-4 flex-grow-1">
        <h2>Welcome to Your Freelancer Dashboard</h2>
        {userData && (
          <div>
            <h4>
              {userData.first_name} {userData.last_name}
            </h4>
            <p>Job Role: {userData.job}</p>
            <p>Email: {userData.email}</p>
            <p>Country: {userData.country}</p>
            <p>Mobile: {userData.mobile}</p>
          </div>
        )}
      </div>
    </div>
  );
}

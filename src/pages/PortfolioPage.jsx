import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";

const PortfolioPage = () => {
  const { id: freelancerId } = useParams();

  const [userData, setUserData] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", freelancerId)
        .single();

      if (error) console.error("Error fetching user data:", error);
      else setUserData(data);
    };

    if (freelancerId) fetchUserData();
  }, [freelancerId]);

  const uploadScreenshotToStorage = async (projectUrl, freelancerId) => {
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const response = await fetch(
        `https://api.apiflash.com/v1/urltoimage?access_key=626a2c99b2c6412e8ea9e35f03dc07f6&url=${encodeURIComponent(projectUrl)}`
      );
      if (!response.ok) return null;

      const blob = await response.blob();
      const fileName = `${freelancerId}-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-screenshots")
        .upload(fileName, blob, { contentType: "image/png" });

      if (uploadError) return null;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-screenshots")
        .getPublicUrl(fileName);

      return publicUrlData?.publicUrl || null;
    } catch (error) {
      console.error("Screenshot upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const screenshotUrl = await uploadScreenshotToStorage(projectUrl, freelancerId);

    const { error } = await supabase.from("freelancer_portfolios").insert([
      {
        freelancer_id: freelancerId,
        project_name: projectName,
        project_url: projectUrl,
        project_description: projectDescription,
        screenshot_url: screenshotUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("❌ Error adding project.");
    } else {
      setMessage("✅ Project added successfully!");
      setProjectName("");
      setProjectUrl("");
      setProjectDescription("");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar userData={userData} />

      <main className="flex-grow-1 p-3 p-md-4 bg-light" style={{ width: "100%" }}>
        <div className="container">
          <h2 className="fw-bold mb-4 text-center text-md-start">Portfolio</h2>

          <div className="card mx-auto p-4 shadow-sm" style={{ maxWidth: "700px", width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="projectName"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="projectURL" className="form-label">Project URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="projectURL"
                  placeholder="Enter project URL"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="projectDescription" className="form-label">Project Description</label>
                <textarea
                  className="form-control"
                  id="projectDescription"
                  rows="4"
                  placeholder="Enter description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Adding..." : "Add Project"}
              </button>

              {message && <p className="mt-3 text-center">{message}</p>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;

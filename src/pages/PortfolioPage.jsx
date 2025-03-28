import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";

const PortfolioPage = () => {
  const { id: freelancerId } = useParams();
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [message, setMessage] = useState("");



  const uploadScreenshotToStorage = async (projectUrl, freelancerId) => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user:", user);
    console.log("Starting screenshot fetch...");

    try {
      console.log("Fetching from:", `https://api.apiflash.com/v1/urltoimage?access_key=626a2c99b2c6412e8ea9e35f03dc07f6&url=${encodeURIComponent(projectUrl)}`);
      const response = await fetch(
        `https://api.apiflash.com/v1/urltoimage?access_key=626a2c99b2c6412e8ea9e35f03dc07f6&url=${encodeURIComponent(projectUrl)}`
      );
      if (!response.ok) {
        console.error("Screenshot API failed:", response.statusText);
        return null;
      }
      const blob = await response.blob();
  
      const fileName = `${freelancerId}-${Date.now()}.png`;
  
      const { error: uploadError } = await supabase.storage
        .from("portfolio-screenshots")
        .upload(fileName, blob, { contentType: "image/png" });
  
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }
  
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("portfolio-screenshots")
        .getPublicUrl(fileName);
  
      if (publicUrlError) {
        console.error("Error getting public URL:", publicUrlError);
        return null;
      }
  
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Screenshot capture/upload failed:", error);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (error) {
      console.error(error);
      setMessage("Error adding project.");
    } else {
      setMessage("Project added successfully!");
      setProjectName("");
      setProjectUrl("");
      setProjectDescription("");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar freelancerId={freelancerId} />
      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">Portfolio</h1>
        <form onSubmit={handleSubmit}>
          <div className="card p-4">
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
                rows="5"
                placeholder="Enter description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Add Project</button>
          </div>
        </form>
        {message && <p className="mt-3">{message}</p>}
      </main>
    </div>
  );
};

export default PortfolioPage;

import React from "react";
import Sidebar from "../components/Sidebar";

const PortfolioPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">Portfolio</h1>
        <div className="card p-4">
          <div className="mb-3">
            <label htmlFor="projectName" className="form-label">Project Name</label>
            <input type="text" className="form-control" id="projectName" placeholder="Enter project name" />
          </div>
          <div className="mb-3">
            <label htmlFor="projectURL" className="form-label">Project URL</label>
            <input type="url" className="form-control" id="projectURL" placeholder="Enter project URL" />
          </div>
          <div className="mb-3">
            <label htmlFor="projectDescription" className="form-label">Project Description</label>
            <textarea className="form-control" id="projectDescription" rows="5" placeholder="Enter description"></textarea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;

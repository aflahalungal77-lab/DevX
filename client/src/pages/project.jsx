import { useEffect, useState } from "react";
import "../index.css";
import CreateProject from "./CreateProject";
import { jwtDecode } from "jwt-decode";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;


  // GET PROJECTS
  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/projects"
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(data);
          return;
        }

        setProjects(data);

      } catch (error) {

        console.error(
          "Error fetching projects:",
          error
        );

      }
    };

    fetchProjects();

  }, []);


  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("DELETE PROJECT:", data);

      if (!response.ok) {
        console.log(data);
        return;
      }

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) =>
            project._id !== projectId
        )
      );

    } catch (error) {

      console.error(
        "Error deleting project:",
        error
      );

    }
  };


  // UPDATE PROJECT
  const handleUpdateProject = async () => {

    const token = localStorage.getItem("token");

    if (!token || !editingProject) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/projects/${editingProject._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            title: editingProject.title,
            description: editingProject.description,
            technologies:
              editingProject.technologies,
            githubLink:
              editingProject.githubLink,
            liveUrl:
              editingProject.liveUrl
          })
        }
      );

      const data = await response.json();

      console.log("UPDATE PROJECT:", data);

      if (!response.ok) {
        console.log(data);
        return;
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === data._id
            ? data
            : project
        )
      );

      setEditingProject(null);

    } catch (error) {

      console.error(
        "Error updating project:",
        error
      );

    }
  };


  return (

    <div className="projects-page">

      <div className="projects-container">


        {/* CREATE PROJECT */}

        <div className="projects-heading">

          <CreateProject
            onProjectCreated={(newProject) => {

              setProjects((prevProjects) => [
                newProject,
                ...prevProjects
              ]);

            }}
          />

          <h1>Projects</h1>

          <p>
            Discover projects built by developers.
          </p>

        </div>


        {/* PROJECTS */}

        <div className="projects-grid">

          {projects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >


              {/* HEADER */}

              <div className="project-header">

                <div className="project-avatar">

                  {project.user?.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h3>
                    {project.user?.name}
                  </h3>

                  <span>
                    Developer
                  </span>

                </div>

              </div>


              {/* CONTENT */}

              <div className="project-content">

                <h2>
                  {project.title}
                </h2>

                <p>
                  {project.description}
                </p>


                <div className="technologies">

                  {project.technologies?.map(
                    (tech, index) => (

                      <span key={index}>
                        {tech}
                      </span>

                    )
                  )}

                </div>

              </div>


              {/* ACTIONS */}

              <div className="project-actions">


                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-btn"
                >
                  GitHub
                </a>


                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-btn"
                >
                  Live Demo
                </a>


                {/* OWNER ACTIONS */}

                {project.user?._id ===
                  user?.user?.id && (

                  <>

                    <button
                      className="edit-project-btn"
                      onClick={() =>
                        setEditingProject({
                          ...project,
                          technologies: [
                            ...project.technologies
                          ]
                        })
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-project-btn"
                      onClick={() =>
                        handleDeleteProject(
                          project._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </>

                )}

              </div>

            </div>

          ))}

        </div>


        {/* EDIT MODAL */}

        {editingProject && (

          <div className="edit-project-overlay">

            <div className="edit-project-modal">

              <h2>
                Edit Project
              </h2>


              <input
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    title: e.target.value
                  })
                }
                placeholder="Project title"
              />


              <textarea
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    description:
                      e.target.value
                  })
                }
                placeholder="Description"
              />


              <input
                value={
                  editingProject
                    .technologies
                    .join(", ")
                }
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,

                    technologies:
                      e.target.value
                        .split(",")
                        .map(
                          (tech) =>
                            tech.trim()
                        )
                        .filter(Boolean)
                  })
                }
                placeholder="React, Node.js, MongoDB"
              />


              <input
                value={
                  editingProject.githubLink
                }
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    githubLink:
                      e.target.value
                  })
                }
                placeholder="GitHub URL"
              />


              <input
                value={
                  editingProject.liveUrl
                }
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    liveUrl:
                      e.target.value
                  })
                }
                placeholder="Live URL"
              />


              <div className="edit-project-actions">

                <button
                  onClick={() =>
                    setEditingProject(null)
                  }
                >
                  Cancel
                </button>


                <button
                  onClick={
                    handleUpdateProject
                  }
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}


        {/* EMPTY STATE */}

        {projects.length === 0 && (

          <div className="no-projects">

            <h3>
              No projects yet
            </h3>

            <p>
              Be the first developer
              to showcase a project.
            </p>

          </div>

        )}

      </div>

    </div>

  );
}

export default Projects;
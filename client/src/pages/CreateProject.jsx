import { useState } from "react";

function CreateProject({ onProjectCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProject = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (
      !form.title ||
      !form.description ||
      !form.technologies ||
      !form.githubLink ||
      !form.liveUrl
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            technologies: form.technologies
              .split(",")
              .map((tech) => tech.trim())
              .filter(Boolean),
            githubLink: form.githubLink,
            liveUrl: form.liveUrl,
          }),
        }
      );

      const data = await response.json();

      console.log("CREATE PROJECT RESPONSE:", data);

      if (!response.ok) {
        console.log(data);
        return;
      }

      onProjectCreated(data);

      setForm({
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveUrl: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-card">
      <h2>Add Your Project</h2>

      <input
        name="title"
        placeholder="Project title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Project description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="technologies"
        placeholder="Technologies (React, Node.js, MongoDB)"
        value={form.technologies}
        onChange={handleChange}
      />

      <input
        name="githubLink"
        placeholder="GitHub URL"
        value={form.githubLink}
        onChange={handleChange}
      />

      <input
        name="liveUrl"
        placeholder="Live project URL"
        value={form.liveUrl}
        onChange={handleChange}
      />

      <button
        onClick={handleCreateProject}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Project"}
      </button>
    </div>
  );
}

export default CreateProject;
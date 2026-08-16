const Project = require("../models/Project");

// CREATE PROJECT
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            technologies,
            githubLink,
            liveUrl
        } = req.body;

        const userId = req.user.id;

        if (
            !title ||
            !description ||
            !technologies ||
            !githubLink ||
            !liveUrl
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newProject = new Project({
            user: userId,
            title,
            description,
            technologies,
            githubLink,
            liveUrl
        });

        await newProject.save();

        const populatedProject = await newProject.populate(
            "user",
            "name email bio skills profilePicture"
        );

        res.status(201).json(populatedProject);

    } catch (error) {
        console.error("CREATE PROJECT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET PROJECTS
const getProjects = async (req, res) => {
    try {
        const projects = await Project
            .find()
            .populate(
                "user",
                "name email bio skills profilePicture"
            )
            .sort({ createdAt: -1 });

        res.status(200).json(projects);

    } catch (error) {
        console.error("GET PROJECTS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE PROJECT
const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            title,
            description,
            technologies,
            githubLink,
            liveUrl
        } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Check ownership
        if (project.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        project.title = title;
        project.description = description;
        project.technologies = technologies;
        project.githubLink = githubLink;
        project.liveUrl = liveUrl;

        await project.save();

        const updatedProject = await project.populate(
            "user",
            "name email bio skills profilePicture"
        );

        res.status(200).json(updatedProject);

    } catch (error) {
        console.error("UPDATE PROJECT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Check ownership
        if (project.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this project"
            });
        }

        await Project.findByIdAndDelete(projectId);

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("DELETE PROJECT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
};
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    createProject,
    getProjects,
    deleteProject,
    updateProject
} = require("../controllers/projectController");
const { get } = require("mongoose");
router.post("/", protect, createProject);
router.get("/",getProjects)
router.put("/:projectId",protect,updateProject)
router.delete("/:projectId", protect, deleteProject);
module.exports = router;
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require('./routes/postRoutes');
const projectRoutes = require("./routes/projectRoutes");
const healthRoutes = require("./routes/healthRoutes");

dotenv.config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use("/api/projects", projectRoutes);
// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/health", healthRoutes);
// Sample route

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});

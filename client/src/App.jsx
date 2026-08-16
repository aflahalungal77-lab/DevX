import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Feed from "./pages/feed";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/project";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={<Projects />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

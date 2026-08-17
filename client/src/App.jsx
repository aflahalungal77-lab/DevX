import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Feed from "./pages/feed";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/project";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
<Routes>

  <Route path="/" element={<Navigate to="/feed" replace />} />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route
    path="/feed"
    element={
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    }
  />

  <Route
    path="/projects"
    element={
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

</Routes>
    </BrowserRouter>
  );
}

export default App;

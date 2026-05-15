import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pengguna from "./pages/Users";
import LearningContent from "./pages/LearningContent";
import MediaLibrary from "./pages/MediaLibrary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"element={<Dashboard />} />
        <Route path="/users" element={<Pengguna />} />
        <Route path="/learning-content" element={<LearningContent />} />
        <Route path="/media" element={<MediaLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
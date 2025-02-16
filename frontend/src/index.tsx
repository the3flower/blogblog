import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./color.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import BlogEditor from "./pages/BlogEditor.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import AuthorSelect from "./components/AuthorSelect.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import BlogDetails from "./pages/BlogDetails.tsx";
import Footer from "./components/Footer.tsx";
import ProfilePage from "./pages/UserProfile.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<BlogEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs/:blogAuthor/:blogId" element={<BlogDetails />} />
        <Route path="/edit/:blogId" element={<BlogEditor />} />
        <Route path="/authorselect" element={<AuthorSelect />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/admin/:userId" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </AuthProvider>
  </BrowserRouter>
);

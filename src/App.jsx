import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./components/main/Dashboard"; // ✅ your main app screen
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Box } from "@mui/material";

function App() {

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route (requires login) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <NavBar />
              <Box sx={{ mt: 8 }}>   {/* 👈 Adds margin-top = 8 * theme.spacing(1) (≈64px) */}
                <Dashboard />
              </Box>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

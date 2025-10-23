import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Curalogo from "./assets/10d51647-7fe0-410a-a7b3-21caa144a4a8.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Bitte alle Felder ausfüllen  😭");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name); // store user name
        navigate("/", { replace: true }); // ✅ SPA navigate to main page
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Etwas ist schiefgelaufen 😭");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #C8E6C9, #A5D6A7)",
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1, // 👈 adds small spacing between logo and text
            mb: 3,
          }}
        >
          <img
            src={Curalogo}
            alt="CuraLink Logo"
            style={{
              width: 45,
              height: 45,
              backgroundColor: "white",
            }}
          />
          <Typography variant="h5" sx={{ color: "#1B5E20", fontWeight: 600 }}>
            Anmelden
          </Typography>
        </Box>

        <TextField
          label="E-Mail"
          fullWidth
          sx={{ mb: 2 }}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Passwort"
          fullWidth
          sx={{ mb: 2 }}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#1B5E20",
            "&:hover": { backgroundColor: "#2E7D32" },
            color: "#fff",
            py: 1.2,
            fontSize: "1rem",
            textTransform: "none",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Anmelden"
          )}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Noch kein Konto?{" "}
          <Link
            to="/register"
            style={{ color: "#1B5E20", textDecoration: "none" }}
          >
            Registrieren
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const roles = ["Arzt", "Pflegekraft", "Administrator", "Andere"];

const Register = () => {
  // Default role to first option to avoid null
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: roles[0],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // ✅ Frontend validation
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Bitte alle Felder ausfüllen 😭");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Erfolgreich registriert!");
        navigate("/login", { replace: true });
      } else {
        // Show backend error message
        alert("❌ " + (data.error || "Server error 😭"));
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
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, color: "#1B5E20", fontWeight: 600 }}
        >
          🩺 Konto erstellen
        </Typography>

        <TextField
          label="Vollständiger Name"
          fullWidth
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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

        <Autocomplete
          options={roles}
          getOptionLabel={(option) => option}
          value={form.role}
          onChange={(e, value) => setForm({ ...form, role: value || roles[0] })}
          renderInput={(params) => (
            <TextField {...params} label="Rolle auswählen" sx={{ mb: 2 }} />
          )}
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
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Registrieren"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Bereits ein Konto?{" "}
          <Link to="/login" style={{ color: "#1B5E20", textDecoration: "none" }}>
            Anmelden
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const MobilityCategory = ({ resident, setResidents }) => {
  // ✅ Initialisiere Einträge aus resident.mobility
  const [entries, setEntries] = useState(() => {
    if (!resident?.mobility) return [];
    return resident.mobility.map((m) => {
      if (typeof m === "string") {
        const time = m.match(/Time:\s*([0-9:apmAPM\s]+)/i)?.[1]?.trim() || "";
        const activity = m.match(/Activity:\s*([^,]+)/i)?.[1]?.trim() || "";
        const details = m.match(/Details:\s*([^,]+)/i)?.[1]?.trim() || "";
        const support = m.match(/Support:\s*([^,]+)/i)?.[1]?.trim() || "";
        return { time, activity, details, support };
      }
      return m;
    });
  });

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activity: "",
    details: "",
    support: "",
  });

  // ✅ Eingabe-Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Hilfsfunktion: Zeit mit „Uhr“ formatieren
  const formatTimeWithUhr = (t) => {
    if (!t) return "—";
    return t.toLowerCase().includes("uhr") ? t : `${t} Uhr`;
  };

  // ✅ Eintrag speichern
  const handleSave = async () => {
    if (!formData.activity.trim()) {
      alert("⚠️ Bitte geben Sie eine Aktivität ein.");
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const entry = {
      time: timeStr,
      activity: formData.activity.trim() || "—",
      details: formData.details.trim() || "—",
      support: formData.support.trim() || "—",
    };

    try {
      setLoading(true);

      const res = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/mobility`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern des Eintrags");

      setEntries((prev) => [...prev, entry]);
      if (setResidents) {
        setResidents((prev) =>
          prev.map((r) => (r._id === data.staff._id ? data.staff : r))
        );
      }

      setOpenForm(false);
      setFormData({ activity: "", details: "", support: "" });
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert("Fehler beim Speichern des Eintrags");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
      {/* 💪 Überschrift */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "green" }} />}
          onClick={() => setOpenForm(true)}
          sx={{
            textTransform: "none",
            borderColor: "lightgray",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Neuer Eintrag
        </Button>
      </Box>

      {/* 🕒 Zeitachse */}
      <Box sx={{ position: "relative", pl: "10px" }}>
        {entries.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              left: "112px",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#2E7D32",
              opacity: 0.3,
            }}
          />
        )}

        {entries.length > 0 ? (
          entries.map((e, i) => (
            <Box
              key={i}
              sx={{
                display: "grid",
                gridTemplateColumns: "90px 20px 1fr 200px",
                alignItems: "center",
                mb: 2,
                position: "relative",
              }}
            >
              <Typography
                sx={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "0.95rem",
                  pr: 1,
                }}
              >
                {formatTimeWithUhr(e.time)}
              </Typography>

              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#2E7D32",
                  position: "relative",
                  left: "7px",
                  zIndex: 2,
                }}
              />

              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {e.activity}
                </Typography>
                {e.details && (
                  <Typography
                    sx={{
                      marginLeft: "10px",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    {e.details}
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.9rem",
                  color: "#555",
                  marginRight: "40px",
                }}
              >
                {e.support || "—"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">
            Noch keine Mobilitätseinträge vorhanden.
          </Typography>
        )}
      </Box>

      {/* 📝 Dialog zum Hinzufügen */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        PaperProps={{
          sx: { borderRadius: "16px", width: "420px" },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={1}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
            Mobilitätseintrag hinzufügen
          </DialogTitle>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Aktivität (z. B. Transfer Bett → Stuhl)"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Details (optional)"
                name="details"
                value={formData.details}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Unterstützung / Bemerkungen"
                name="support"
                value={formData.support}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Wird gespeichert..." : "💾 Eintrag speichern"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MobilityCategory;

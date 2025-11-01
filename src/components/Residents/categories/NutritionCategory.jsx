import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocalCafeIcon from "@mui/icons-material/LocalCafe"; // ☕ Frühstück
import LunchDiningIcon from "@mui/icons-material/LunchDining"; // 🍽 Mittagessen
import AppleIcon from "@mui/icons-material/Apple"; // 🍎 Zwischenmahlzeit
import WineBarIcon from "@mui/icons-material/WineBar"; // 🍷 Abendessen

const NutritionCategory = ({ resident, setResidents }) => {
  const [entries, setEntries] = useState(() => {
    if (!resident?.nutrition) return [];
    return resident.nutrition.map((n) => {
      try {
        return JSON.parse(n);
      } catch {
        return { mealType: n, amount: "—", time: "—", notes: "—" };
      }
    });
  });

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mealType: "",
    amount: "",
    notes: "",
  });

  // 🎨 Stilregeln pro Mahlzeitentyp
  const getMealStyle = (type = "") => {
    const lower = type?.toLowerCase?.() || "";

    if (lower.includes("früh") || lower.includes("break"))
      return {
        icon: <LocalCafeIcon />,
        bg: "#E8F5E9",
        border: "#A5D6A7",
        color: "darkgreen",
        dark: false,
      };

    if (lower.includes("zwischen") || lower.includes("snack"))
      return {
        icon: <AppleIcon />,
        bg: "#C8E6C9",
        border: "#81C784",
        color: "#1B5E20",
        dark: false,
      };

    if (lower.includes("mittag") || lower.includes("lunch"))
      return {
        icon: <LunchDiningIcon />,
        bg: "#A5D6A7",
        border: "#66BB6A",
        color: "black",
        dark: false,
      };

    if (lower.includes("abend") || lower.includes("dinner"))
      return {
        icon: <WineBarIcon />,
        bg: "#388E3C",
        border: "#1B5E20",
        color: "white",
        dark: true,
      };

    return {
      icon: <LunchDiningIcon />,
      bg: "#E8F5E9",
      border: "#A5D6A7",
      color: "#2E7D32",
      dark: false,
    };
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!formData.mealType.trim())
      return alert("Bitte geben Sie eine Mahlzeit ein!");

    const entry = {
      mealType: formData.mealType.trim(),
      amount: formData.amount.trim() || "—",
      time: getCurrentTime(),
      notes: formData.notes.trim() || "—",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/nutrition`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: JSON.stringify(entry) }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      setEntries((prev) => [...prev, entry]);
      setResidents?.((prev) =>
        prev.map((r) => (r._id === data.staff._id ? data.staff : r))
      );

      setOpenForm(false);
      setFormData({ mealType: "", amount: "", notes: "" });
    } catch (err) {
      console.error("❌ Fehler beim Speichern des Ernährungseintrags:", err);
      alert("Fehler beim Speichern des Eintrags");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2 }}>
      {/* Kopfbereich */}
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
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

      {/* Kartenanzeige */}
      <Grid container spacing={2}>
        {entries.length > 0 ? (
          entries.map((e, i) => {
            const style = getMealStyle(e?.mealType);
            return (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    width: 320,
                    border: `2px solid ${style.border}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: 150,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* 🥣 Oberer Bereich */}
                  <Box
                    sx={{
                      backgroundColor: style.bg,
                      color: style.color,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {style.icon}
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: style.color,
                        }}
                      >
                        {e.mealType}
                      </Typography>
                      <Typography
                        sx={{
                          ml: "auto",
                          fontWeight: "bold",
                          color: style.color,
                        }}
                      >
                        {e.time} Uhr
                      </Typography>
                    </Box>

                    {/* Menge unter Mahlzeit */}
                    <Typography
                      sx={{
                        mt: 0.5,
                        ml: 4.5,
                        fontSize: "0.9rem",
                        color: style.dark ? "white" : "black",
                      }}
                    >
                      {e.amount}
                    </Typography>
                  </Box>

                  {/* Notizenbereich */}
                  <Box sx={{ backgroundColor: "#fff", p: 2 }}>
                    <Typography sx={{ color: "black" }}>
                      {e.notes || "—"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography color="text.secondary" sx={{ ml: 2 }}>
            Keine Ernährungsdaten vorhanden.
          </Typography>
        )}
      </Grid>

      {/* ➕ Formular zum Hinzufügen */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        PaperProps={{ sx: { borderRadius: "16px", width: "420px" } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={1}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
            Neuer Ernährungseintrag
          </DialogTitle>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>
          <TextField
            label="Mahlzeit (z. B. Frühstück, Mittagessen)"
            name="mealType"
            value={formData.mealType}
            onChange={(e) =>
              setFormData({ ...formData, mealType: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Menge (z. B. Ganz, Halb, Keine)"
            name="amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notizen (optional)"
            name="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSave}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {loading ? "Wird gespeichert..." : "💾 Speichern"}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NutritionCategory;

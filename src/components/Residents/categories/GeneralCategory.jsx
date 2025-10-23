import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const GeneralCategory = ({ resident = {}, setResidents }) => {
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentData, setResidentData] = useState(resident);
  const [formData, setFormData] = useState({
    careLevel: "",
    allergy: "",
    contact: "",
    dailyPlan: "",
    activities: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => setResidentData(resident), [resident]);

  const latestGeneral =
    Array.isArray(residentData.general) && residentData.general.length > 0
      ? residentData.general[residentData.general.length - 1]
      : null;

  const generalData = latestGeneral?.description || {
    careLevel: residentData.careLevel || "—",
    allergy: residentData.allergy || "—",
    contact: residentData.contact || "—",
    dailyPlan: residentData.dailyPlan || [],
    activities: residentData.activities || [],
  };

  useEffect(() => {
    setFormData({
      careLevel: generalData.careLevel || "",
      allergy: generalData.allergy || "",
      contact: generalData.contact || "",
      dailyPlan: Array.isArray(generalData.dailyPlan)
        ? generalData.dailyPlan.join("\n")
        : generalData.dailyPlan || "",
      activities: Array.isArray(generalData.activities)
        ? generalData.activities.join("\n")
        : generalData.activities || "",
    });
  }, [residentData]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const entry = {
        title: "General Info Update",
        description: {
          careLevel: formData.careLevel.trim(),
          allergy: formData.allergy.trim(),
          contact: formData.contact.trim(),
          dailyPlan: formData.dailyPlan
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
          activities: formData.activities
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
        },
        type: "info",
      };

      const res = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${residentData._id}/category/general`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setResidents?.((prev) =>
        prev.map((r) => (r._id === data.staff._id ? data.staff : r))
      );
      setResidentData(data.staff);
      setOpenForm(false);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Determine task status
  const getTaskStatus = (text) => {
    const lower = text.toLowerCase();
    if (
      lower.includes("completed") ||
      lower.includes("done") ||
      lower.includes("erledigt") ||
      lower.includes("fertig")
    )
      return "completed";
    if (
      lower.includes("tomorrow") ||
      lower.includes("next week") ||
      lower.includes("morgen")
    )
      return "upcoming";
    if (lower.match(/\b\d{1,2}[:.]\d{2}\s?(am|pm)?\b/)) return "pending";
    return "upcoming";
  };

  const renderTaskIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#2E7D32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
          </Box>
        );
      case "pending":
        return (
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#2E7D32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 14, color: "#fff" }} />
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#FFB300",
            }}
          />
        );
    }
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fff" }}>
      {/* Header */}
      <Box display="flex" justifyContent="flex-start" mb={2} px={3} pt={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "green" }} />}
          onClick={() => setOpenForm(true)}
          sx={{
            textTransform: "none",
            borderColor: "lightgray",
            color: "black",
            fontWeight: "bold",
            borderRadius: 2,
          }}
        >
          Neuer Eintrag
        </Button>
      </Box>

      {/* Main layout */}
      <Grid
        container
        spacing={0}
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "stretch",
          borderTop: "1px solid #E0E0E0",
          borderBottom: "1px solid #E0E0E0",
          overflowX: "auto",
        }}
      >
        {/* Allgemeine Infos */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            flex: 1,
            borderRight: "1px solid #E0E0E0",
            p: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Allgemeine Infos
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {generalData.careLevel || "—"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {generalData.allergy || "—"}
          </Typography>
          <Typography variant="body2">{generalData.contact || "—"}</Typography>
        </Grid>

        {/* Tagesplan */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            flex: 1,
            borderRight: "1px solid #E0E0E0",
            p: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Tagesplan
          </Typography>

          {Array.isArray(generalData.dailyPlan) &&
          generalData.dailyPlan.length ? (
            generalData.dailyPlan.map((text, i) => {
              const status = getTaskStatus(text);
              return (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  gap={1.2}
                  mb={1}
                >
                  {renderTaskIcon(status)}
                  <Typography variant="body2">{text}</Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Kein Tagesplan vorhanden.
            </Typography>
          )}
        </Grid>

        {/* Letzte Aktivitäten */}
        <Grid item xs={12} md={4} sx={{ flex: 1, p: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Letzte Aktivitäten
          </Typography>

          {Array.isArray(generalData.activities) &&
          generalData.activities.length ? (
            generalData.activities.map((act, i) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                {act}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Keine Aktivitäten vorhanden.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* 🧾 Dialog Form */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        scroll="body"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: isMobile ? "95vw" : "460px",
            maxWidth: "95vw",
            margin: 0,
            m: isMobile ? 1 : "auto",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={1}
        >
          <DialogTitle
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2E7D32",
              p: 0,
            }}
          >
            Allgemeine Informationen bearbeiten
          </DialogTitle>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            overflow: "visible",
            px: 2,
            pb: 3,
          }}
        >
          <TextField
            label="Pflegegrad"
            name="careLevel"
            value={formData.careLevel}
            onChange={(e) =>
              setFormData({ ...formData, careLevel: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Allergien / Zustand"
            name="allergy"
            value={formData.allergy}
            onChange={(e) =>
              setFormData({ ...formData, allergy: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Kontakt"
            name="contact"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tagesplan (eine Zeile pro Eintrag)"
            name="dailyPlan"
            multiline
            minRows={3}
            value={formData.dailyPlan}
            onChange={(e) =>
              setFormData({ ...formData, dailyPlan: e.target.value })
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Letzte Aktivitäten (eine Zeile pro Eintrag)"
            name="activities"
            multiline
            minRows={3}
            value={formData.activities}
            onChange={(e) =>
              setFormData({ ...formData, activities: e.target.value })
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
            {loading ? "Speichern..." : "💾 Speichern"}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GeneralCategory;

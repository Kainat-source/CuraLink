import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { askAI } from "../services/AiResult";

import AddResidentDialog from "./AddResidentDialog";
import ResidentProfileDialog from "./ResidentProfileDialog";
import ResidentsFooter from "./ResidentsFooter";

const ResidentsProfiles = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [textNote, setTextNote] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // 🔄 Bewohner laden
  useEffect(() => {
    fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setResidents(data);
        else if (Array.isArray(data.staff)) setResidents(data.staff);
        else setResidents([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🎤 Sprachnotiz
  const handleVoiceNote = () => {
    setActiveButton("voice");
    alert("🎤 Jetzt sprechen!");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Spracherkennung wird von Ihrem Browser nicht unterstützt.");

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      await handleSendToAI(transcript);
    };
    recognition.onerror = (event) => alert("Sprachfehler: " + event.error);
  };

  // 🧠 KI-Kategorisierung
  const handleSendToAI = async (noteInput) => {
    const note = noteInput || textNote;
    if (!note.trim()) return;

    setAiLoading(true);
    setAiResponse("");

    const prompt = `
    Bewohnerliste:
    ${residents
      .map(
        (r) =>
          `${r.name} hat Kategorien: Schmerz, Ernährung, Mobilität, Ausscheidung, Medikamente, Wasserlassen, Allgemein`
      )
      .join("\n")}
    
    Benutzernotiz: "${note}"
    Bestimme:
    Name: [Name des Bewohners]
    Kategorie: [Kategorie]
    `;

    try {
      const res = await askAI(prompt);
      setAiResponse(res);

      const nameMatch = res.match(/Name:\s*(.+)/i);
      const categoryMatch = res.match(/Kategorie:\s*(.+)/i);
      if (!nameMatch || !categoryMatch) return;

      const residentName = nameMatch[1].trim();
      const categoryName = categoryMatch[1].trim().toLowerCase();
      const resident = residents.find(
        (r) => r.name.toLowerCase() === residentName.toLowerCase()
      );
      if (!resident) return;

      const cleanedNote = note.replace(new RegExp(residentName, "ig"), "").trim();

      const updateRes = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/${categoryName}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: cleanedNote }),
        }
      );

      if (!updateRes.ok) throw new Error("Fehler beim Backend-Update");
      const updated = await updateRes.json();

      setResidents((prev) =>
        prev.map((r) => (r._id === resident._id ? updated.staff || updated : r))
      );

      setTextNote("");
      setVoiceText("");
    } catch (err) {
      console.error("❌ KI-Fehler:", err);
      setAiResponse("⚠️ Fehler aufgetreten. Siehe Konsole.");
    } finally {
      setAiLoading(false);
    }
  };

  const capitalizeFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const btnStyle = (active) => ({
    bgcolor: active ? "success.main" : "white",
    color: active ? "white" : "black",
    width: 180,
    height: 100,
    borderRadius: "14px",
    boxShadow: 2,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": { bgcolor: active ? "success.main" : "#f5f5f5" },
  });

  return (
    <Box sx={{ padding: "20px", maxWidth: "1000px", mx: "auto" }}>
      {/* 🎤📝➕ Top Controls */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={3}>
        <Box display="flex" justifyContent="center" gap={3}>
          <Button onClick={handleVoiceNote} sx={btnStyle(activeButton === "voice")}>
            <MicIcon sx={{ fontSize: 45 }} /> Sprachnotiz
          </Button>
          <Button onClick={() => setActiveButton("text")} sx={btnStyle(activeButton === "text")}>
            <ArticleIcon sx={{ fontSize: 45 }} /> Textnotiz
          </Button>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
          onClick={() => setShowAddForm(true)}
          sx={{
            mt: 1,
            px: 2.2,
            py: 0.6,
            borderColor: "#ccc",
            color: "#000",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { borderColor: "#999", backgroundColor: "#f9f9f9" },
          }}
        >
          Bewohner hinzufügen
        </Button>
      </Box>

      {/* 📝 Textnotiz */}
      {activeButton === "text" && (
        <Box
          mt={3}
          p={2}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fafafa",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => {
              setActiveButton(null);
              setTextNote("");
              setAiResponse("");
            }}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: "#777",
              "&:hover": { color: "#d32f2f" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography gutterBottom fontWeight="bold" color="#2E7D32">
            ✍️ Textnotiz eingeben
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            placeholder="Notiz eingeben..."
          />

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => handleSendToAI()}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Senden"
            )}
          </Button>

          {aiResponse && (
            <Box
              mt={2}
              p={2}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f5fff5",
                position: "relative",
              }}
            >
              <Typography variant="subtitle2" color="#2E7D32" fontWeight="bold">
                🤖 KI-Antwort
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
                {aiResponse}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ➕ Bewohner hinzufügen Dialog */}
      <AddResidentDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        setResidents={setResidents}
      />

      {/* 👥 Bewohnerliste */}
      {loading ? (
        <Box display="flex" justifyContent="center" height="40vh">
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {residents.map((r) => (
            <Card
              key={r._id}
              onClick={() => {
                setSelectedResident(r);
                setOpenProfile(true);
              }}
              sx={{
                width: "100%",
                maxWidth: 450,
                cursor: "pointer",
                borderRadius: "10px",
                boxShadow: 2,
                p: 2,
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent>
                <Typography variant="h6">{capitalizeFirst(r.name)}</Typography>
                <Typography variant="body2">
                  Zimmer: {r.room || "Nicht verfügbar"}
                </Typography>
                <Typography variant="body2">
                  Bett: {r.bedNumber || "Nicht verfügbar"} • Pflegestufe:{" "}
                  {r.careLevel || "Keine Angabe"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* 👤 Bewohnerprofil */}
      <ResidentProfileDialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        resident={selectedResident}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />

      {/* 🦶 Fußzeile */}
      <ResidentsFooter />
    </Box>
  );
};

export default ResidentsProfiles;

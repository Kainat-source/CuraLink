// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import MicIcon from "@mui/icons-material/Mic";
// import ArticleIcon from "@mui/icons-material/Article";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import { askAI } from "../services/AiResult";

// import AddResidentDialog from "./AddResidentDialog";
// import ResidentProfileDialog from "./ResidentProfileDialog";
// import ResidentsFooter from "./ResidentsFooter";

// const ResidentsProfiles = () => {
//   const [residents, setResidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [openProfile, setOpenProfile] = useState(false);
//   const [selectedResident, setSelectedResident] = useState(null);
//   const [textNote, setTextNote] = useState("");
//   const [voiceText, setVoiceText] = useState("");
//   const [aiResponse, setAiResponse] = useState("");
//   const [aiLoading, setAiLoading] = useState(false);
//   const [activeButton, setActiveButton] = useState(null);
//   const [tabIndex, setTabIndex] = useState(0);

//   // 🔄 Bewohner laden
//   useEffect(() => {
//     fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setResidents(data);
//         else if (Array.isArray(data.staff)) setResidents(data.staff);
//         else setResidents([]);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // 🎤 Sprachnotiz
//   const handleVoiceNote = () => {
//     setActiveButton("voice");
//     alert("🎤 Jetzt sprechen!");

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition)
//       return alert("Spracherkennung wird von Ihrem Browser nicht unterstützt.");

//     const recognition = new SpeechRecognition();
//     recognition.lang = "de-DE";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.start();
//     recognition.onresult = async (event) => {
//       const transcript = event.results[0][0].transcript;
//       setVoiceText(transcript);
//       await handleSendToAI(transcript);
//     };
//     recognition.onerror = (event) => alert("Sprachfehler: " + event.error);
//   };

//   // 🧠 KI-Kategorisierung
//   const handleSendToAI = async (noteInput) => {
//     const note = noteInput || textNote;
//     if (!note.trim()) return;

//     setAiLoading(true);
//     setAiResponse("");

//     const prompt = `
//     Bewohnerliste:
//     ${residents
//       .map(
//         (r) =>
//           `${r.name} hat Kategorien: Schmerz, Ernährung, Mobilität, Ausscheidung, Medikamente, Wasserlassen, Allgemein`
//       )
//       .join("\n")}

//     Benutzernotiz: "${note}"
//     Bestimme:
//     Name: [Name des Bewohners]
//     Kategorie: [Kategorie]
//     `;

//     try {
//       const res = await askAI(prompt);
//       setAiResponse(res);

//       const nameMatch = res.match(/Name:\s*(.+)/i);
//       const categoryMatch = res.match(/Kategorie:\s*(.+)/i);
//       if (!nameMatch || !categoryMatch) return;

//       const residentName = nameMatch[1].trim();
//       const categoryName = categoryMatch[1].trim().toLowerCase();
//       const resident = residents.find(
//         (r) => r.name.toLowerCase() === residentName.toLowerCase()
//       );
//       if (!resident) return;

//       const cleanedNote = note.replace(new RegExp(residentName, "ig"), "").trim();

//       const updateRes = await fetch(
//         `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/${categoryName}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ notes: cleanedNote }),
//         }
//       );

//       if (!updateRes.ok) throw new Error("Fehler beim Backend-Update");
//       const updated = await updateRes.json();

//       setResidents((prev) =>
//         prev.map((r) => (r._id === resident._id ? updated.staff || updated : r))
//       );

//       setTextNote("");
//       setVoiceText("");
//     } catch (err) {
//       console.error("❌ KI-Fehler:", err);
//       setAiResponse("⚠️ Fehler aufgetreten. Siehe Konsole.");
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const capitalizeFirst = (str = "") =>
//     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//   const btnStyle = (active) => ({
//     bgcolor: active ? "success.main" : "white",
//     color: active ? "white" : "black",
//     width: 180,
//     height: 100,
//     borderRadius: "14px",
//     boxShadow: 2,
//     fontWeight: "bold",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     "&:hover": { bgcolor: active ? "success.main" : "#f5f5f5" },
//   });

//   return (
//     <Box sx={{ padding: "20px", maxWidth: "1000px", mx: "auto" }}>
//       {/* 🎤📝➕ Top Controls */}
//       <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={3}>
//         <Box display="flex" justifyContent="center" gap={3}>
//           <Button onClick={handleVoiceNote} sx={btnStyle(activeButton === "voice")}>
//             <MicIcon sx={{ fontSize: 45 }} /> Sprachnotiz
//           </Button>
//           <Button onClick={() => setActiveButton("text")} sx={btnStyle(activeButton === "text")}>
//             <ArticleIcon sx={{ fontSize: 45 }} /> Textnotiz
//           </Button>
//         </Box>

//         <Button
//           variant="outlined"
//           startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
//           onClick={() => setShowAddForm(true)}
//           sx={{
//             mt: 1,
//             px: 2.2,
//             py: 0.6,
//             borderColor: "#ccc",
//             color: "#000",
//             borderRadius: "8px",
//             fontSize: "0.95rem",
//             fontWeight: "bold",
//             textTransform: "none",
//             "&:hover": { borderColor: "#999", backgroundColor: "#f9f9f9" },
//           }}
//         >
//           Bewohner hinzufügen
//         </Button>
//       </Box>

//       {/* 📝 Textnotiz */}
//       {activeButton === "text" && (
//         <Box
//           mt={3}
//           p={2}
//           sx={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             background: "#fafafa",
//             position: "relative",
//           }}
//         >
//           <IconButton
//             onClick={() => {
//               setActiveButton(null);
//               setTextNote("");
//               setAiResponse("");
//             }}
//             sx={{
//               position: "absolute",
//               top: 4,
//               right: 4,
//               color: "#777",
//               "&:hover": { color: "#d32f2f" },
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>

//           <Typography gutterBottom fontWeight="bold" color="#2E7D32">
//             ✍️ Textnotiz eingeben
//           </Typography>

//           <TextField
//             fullWidth
//             multiline
//             rows={3}
//             value={textNote}
//             onChange={(e) => setTextNote(e.target.value)}
//             placeholder="Notiz eingeben..."
//           />

//           <Button
//             variant="contained"
//             color="success"
//             sx={{ mt: 2 }}
//             onClick={() => handleSendToAI()}
//             disabled={aiLoading}
//           >
//             {aiLoading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "Senden"
//             )}
//           </Button>

//           {aiResponse && (
//             <Box
//               mt={2}
//               p={2}
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 background: "#f5fff5",
//                 position: "relative",
//               }}
//             >
//               <Typography variant="subtitle2" color="#2E7D32" fontWeight="bold">
//                 🤖 KI-Antwort
//               </Typography>
//               <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
//                 {aiResponse}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       )}

//       {/* ➕ Bewohner hinzufügen Dialog */}
//       <AddResidentDialog
//         open={showAddForm}
//         onClose={() => setShowAddForm(false)}
//         setResidents={setResidents}
//       />

//       {/* 👥 Bewohnerliste */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" height="40vh">
//           <CircularProgress color="success" />
//         </Box>
//       ) : (
//         <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//           {residents.map((r) => (
//             <Card
//               key={r._id}
//               onClick={() => {
//                 setSelectedResident(r);
//                 setOpenProfile(true);
//               }}
//               sx={{
//                 width: "100%",
//                 maxWidth: 450,
//                 cursor: "pointer",
//                 borderRadius: "10px",
//                 boxShadow: 2,
//                 p: 2,
//                 "&:hover": { boxShadow: 3 },
//               }}
//             >
//               <CardContent>
//                 <Typography variant="h6">{capitalizeFirst(r.name)}</Typography>
//                 <Typography variant="body2">
//                   Zimmer: {r.room || "Nicht verfügbar"}
//                 </Typography>
//                 <Typography variant="body2">
//                   Bett: {r.bedNumber || "Nicht verfügbar"} • Pflegestufe:{" "}
//                   {r.careLevel || "Keine Angabe"}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       )}

//       {/* 👤 Bewohnerprofil */}
//       <ResidentProfileDialog
//         open={openProfile}
//         onClose={() => setOpenProfile(false)}
//         resident={selectedResident}
//         tabIndex={tabIndex}
//         setTabIndex={setTabIndex}
//       />

//       {/* 🦶 Fußzeile */}
//       <ResidentsFooter />
//     </Box>
//   );
// };

// export default ResidentsProfiles;

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
  const [aiResponsePain, setAiResponsePain] = useState(null);

  // 🔄 Bewohner laden
  useEffect(() => {
    fetch(
      "https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff"
    )
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

  // ✅ Category Normalizer (German → Backend field)
  const normalizeCategory = (str = "") => {
    const raw = str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const map = {
      schmerz: "pain",
      schmerzen: "pain",
      ernahrung: "nutrition",
      ernaehrung: "nutrition",
      mobilitat: "mobility",
      mobilitaet: "mobility",
      ausscheidung: "elimination",
      medikamente: "medication",
      wasserlassen: "urination",
      allgemein: "general",
    };
    const foundKey = Object.keys(map).find((key) => raw.includes(key));
    return foundKey ? map[foundKey] : raw;
  };
  // 🧠 KI-Kategorisierung
  const handleSendToAI = async (noteInput) => {
    const note = noteInput || textNote;
    if (!note.trim()) return;

    setAiLoading(true);
    setAiResponse("");

    // 🔹 Prompt for AI
    const prompt = `
Du bist ein Assistent für eine Pflege-App.
Verstehe Deutsch und Englisch, aber ANTWORTE IMMER AUF DEUTSCH.

------------------------------------------------------------
✅ SCHRITT 1 — KATEGORIE ERKENNEN
------------------------------------------------------------
Wenn der Text über Essen, Trinken, Mahlzeiten oder Getränke spricht:
Kategorie: Ernährung

Wenn der Text über Stuhlgang, Urin, Toilette, Durchfall, Konsistenz oder Mengen/Abstände spricht:
Kategorie: Ausscheidung

Wenn der Text über Mobilität, Transfer, Bewegung, Sturz oder Aktivität spricht:
Kategorie: Mobilität

Wenn der Text über Schmerzen, Schmerzstufe, Körperstelle oder Medikation spricht:
Kategorie: Schmerz / Pain

Wenn der Text über allgemeine Informationen zum Bewohner spricht, z. B. Pflegegrad, Allergien, Kontaktinformationen oder Tagesplan:
Kategorie: Allgemein

------------------------------------------------------------
✅ SCHRITT 2 — EXTRAHIERE DIE DATEN
------------------------------------------------------------
📌 WICHTIG: Gib IMMER den vollständigen Namen aus:
- Name: vollständiger Bewohnername (Pflichtfeld)

------------------------------------------------------------
✅ WENN KATEGORIE = ERNÄHRUNG
------------------------------------------------------------
- mealType: Frühstück / Mittagessen / Abendessen / Zwischenmahlzeit
- amount: viel / gut → Ganz, wenig → Gering, halb → Halb, sonst → "-"
- notes: sehr kurze Zusammenfassung OHNE Name

FORMAT:
Kategorie: Ernährung
- Name: <name>
- mealType: <mealType>
- amount: <amount>
- notes: <summary ohne Name>

------------------------------------------------------------
✅ WENN KATEGORIE = AUSSCHEIDUNG
------------------------------------------------------------
- interval: z. B. "3 Stunden", "2 Tage", "am gleichen Tag", oder "-"
- amount: gering / normal / viel / groß / "-"
- consistency: fest / weich / flüssig / "-"
- shortNote: kurze deutsche Zusammenfassung OHNE Name

FORMAT:
Kategorie: Ausscheidung
- Name: <name>
- interval: <interval>
- amount: <amount>
- consistency: <consistency>
- shortNote: <summary ohne Name>

------------------------------------------------------------
✅ WENN KATEGORIE = MOBILITÄT
------------------------------------------------------------
- activity: z. B. Transfer Bett → Stuhl
- details: kurz, optional
- support: z. B. minimale Hilfe, keine Stürze, "-"

FORMAT:
Kategorie: Mobilität
- Name: <name>
- activity: <activity>
- details: <details>
- support: <support>

------------------------------------------------------------
✅ WENN KATEGORIE = SCHMERZ / PAIN
------------------------------------------------------------
- painLevel: 0–10
- bodyPart: Körperstelle
- observation: Beobachtung, optional
- medicationGiven: verabreichte Medikation, optional

FORMAT:
Kategorie: Schmerz
- Name: <name>
- painLevel: <painLevel>
- bodyPart: <bodyPart>
- observation: <observation>
- medicationGiven: <medicationGiven>

------------------------------------------------------------
✅ WENN KATEGORIE = ALLGEMEIN
------------------------------------------------------------
- careLevel: Pflegegrad oder sonstige Info
- allergy: Allergien / Zustand
- contact: Kontaktinformationen
- dailyPlan: Tagesplan, mehrere Einträge durch Komma getrennt
- activities: letzte Aktivitäten, mehrere Einträge durch Komma getrennt

FORMAT:
Kategorie: Allgemein
- Name: <name>
- careLevel: <careLevel>
- allergy: <allergy>
- contact: <contact>
- dailyPlan: <dailyPlan>
- activities: <activities>

------------------------------------------------------------
✅ REGELN
------------------------------------------------------------
- Keine Informationen erfinden.
- Name darf NICHT in notes, shortNote, support, dailyPlan oder activities vorkommen.
- IMMER auf Deutsch antworten.

Benutzernotiz: "${note}"
`;

    try {
      const res = await askAI(prompt);
      console.log("🧠 AI Response:", res);
      setAiResponse(res);

      // ✅ Detect category
      const isNutrition = /Ernährung/i.test(res);
      const isElimination = /Ausscheidung/i.test(res);
      const isMobility = /Mobilität/i.test(res);
      const isPain = /Schmerz/i.test(res);
      const isGeneral = /Allgemein/i.test(res);

      let resident = null;

      // -------------------- NUTRITION --------------------
      if (isNutrition) {
        const nameMatch = res.match(/Name:\s*(.+)/i);
        if (!nameMatch) throw new Error("AI did not return name for nutrition");

        const residentName = nameMatch[1].trim();
        resident = residents.find(
          (r) => r.name.toLowerCase() === residentName.toLowerCase()
        );
        if (!resident) throw new Error(`Resident not found: ${residentName}`);

        const meal = res.match(/mealType:\s*(.+)/i)?.[1]?.trim() || "-";
        const amount = res.match(/amount:\s*(.+)/i)?.[1]?.trim() || "-";
        const notesText = res.match(/notes:\s*(.+)/i)?.[1]?.trim() || "-";

        const entry = {
          mealType: meal,
          amount,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          notes: notesText,
        };

        const url = `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/nutrition`;
        const updateRes = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: JSON.stringify(entry) }),
        });

        const updated = await updateRes.json();
        setResidents((prev) =>
          prev.map((r) => (r._id === resident._id ? updated.staff : r))
        );
      }

      // -------------------- ELIMINATION --------------------
      if (isElimination) {
        resident = selectedResident;
        if (!resident) throw new Error("No resident selected for elimination");

        const interval = res.match(/interval:\s*(.+)/i)?.[1]?.trim() || "-";
        const amount = res.match(/amount:\s*(.+)/i)?.[1]?.trim() || "-";
        const consistency =
          res.match(/consistency:\s*(.+)/i)?.[1]?.trim() || "-";
        const shortNote = res.match(/shortNote:\s*(.+)/i)?.[1]?.trim() || "-";

        const now = new Date();
        const time12 = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const time24 = now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const entry = {
          date: `${time12} ${time24}`,
          interval,
          amount,
          consistency,
          notes: shortNote,
        };

        const url = `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/elimination`;
        const updateRes = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry }),
        });

        const updated = await updateRes.json();
        setResidents((prev) =>
          prev.map((r) => (r._id === resident._id ? updated.staff : r))
        );
      }

      // -------------------- MOBILITY --------------------
      if (isMobility) {
        const nameMatch = res.match(/Name:\s*(.+)/i);
        if (!nameMatch) throw new Error("AI did not return name for mobility");

        const residentName = nameMatch[1].trim();
        resident = residents.find(
          (r) => r.name.toLowerCase() === residentName.toLowerCase()
        );
        if (!resident) throw new Error(`Resident not found: ${residentName}`);

        const activity = res.match(/activity:\s*(.+)/i)?.[1]?.trim() || "—";
        const details = res.match(/details:\s*(.+)/i)?.[1]?.trim() || "—";
        const support = res.match(/support:\s*(.+)/i)?.[1]?.trim() || "—";

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const entry = { time: timeStr, activity, details, support };

        const url = `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/mobility`;
        const updateRes = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry }),
        });

        const updated = await updateRes.json();
        setResidents((prev) =>
          prev.map((r) => (r._id === resident._id ? updated.staff : r))
        );
      }

      // -------------------- PAIN --------------------
      if (isPain) {
        const nameMatch = res.match(/Name:\s*(.+)/i);
        if (!nameMatch) throw new Error("AI did not return name for pain");

        const residentName = nameMatch[1].trim();
        const resident = residents.find(
          (r) => r.name.toLowerCase() === residentName.toLowerCase()
        );
        if (!resident) throw new Error(`Resident not found: ${residentName}`);

        const painLevel = Number(res.match(/painLevel:\s*(\d+)/i)?.[1] || 0);
        const bodyPart = res.match(/bodyPart:\s*(.+)/i)?.[1]?.trim() || "—";
        const observation =
          res.match(/observation:\s*(.+)/i)?.[1]?.trim() || "—";
        const medicationGiven =
          res.match(/medicationGiven:\s*(.+)/i)?.[1]?.trim() || "—";

        const now = new Date();
        const entry = {
          painLevel,
          bodyPart,
          observation,
          medicationGiven,
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: now.toISOString().slice(0, 10),
        };

        // 💡 Hier lokal setzen, um PainChart zu aktualisieren
        setAiResponsePain(entry);

        // Backend aktualisieren
        const url = `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/pain`;
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: JSON.stringify(entry) }),
        });

        setResidents((prev) =>
          prev.map((r) =>
            r._id === resident._id
              ? { ...resident, pain: [...(resident.pain || []), entry] }
              : r
          )
        );
      }
      // -------------------- GENERAL --------------------
      // -------------------- GENERAL --------------------
      if (isGeneral) {
        try {
          const nameMatch = res.match(/Name:\s*(.+)/i);
          if (!nameMatch)
            throw new Error("AI did not return name for general info");

          const residentName = nameMatch[1].trim();
          const resident = residents.find(
            (r) => r.name.toLowerCase() === residentName.toLowerCase()
          );
          if (!resident) throw new Error(`Resident not found: ${residentName}`);

          // Extract fields
          const careLevel = res.match(/careLevel:\s*(.+)/i)?.[1]?.trim() || "-";
          const allergy = res.match(/allergy:\s*(.+)/i)?.[1]?.trim() || "-";
          const contact = res.match(/contact:\s*(.+)/i)?.[1]?.trim() || "-";

          const dailyPlanRaw =
            res.match(/dailyPlan:\s*(.+)/i)?.[1]?.trim() || "";
          const activitiesRaw =
            res.match(/activities:\s*(.+)/i)?.[1]?.trim() || "";

          // Convert comma-separated strings to array
          const dailyPlan = dailyPlanRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          const activities = activitiesRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          // Backend expects: { entry: { title, description, type } }
          const entryToSend = {
            title: "General Info Update",
            description: { careLevel, allergy, contact, dailyPlan, activities },
            type: "info",
          };

          const url = `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/general`;

          const updateRes = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entry: entryToSend }),
          });

          const updated = await updateRes.json();
          if (!updateRes.ok)
            throw new Error(updated.error || "Failed to update");

          // Update local state
          setResidents((prev) =>
            prev.map((r) => (r._id === resident._id ? updated.staff : r))
          );

          console.log("✅ General info updated successfully!");
        } catch (err) {
          console.error("❌ Error updating general info:", err);
          alert("Error updating general info: " + err.message);
        }
      }

      // Clear input
      setTextNote("");
      setVoiceText("");
    } catch (err) {
      console.error("❌ KI-Fehler:", err);
      setAiResponse("⚠️ Fehler aufgetreten.");
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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        mb={3}
      >
        <Box display="flex" justifyContent="center" gap={3}>
          <Button
            onClick={handleVoiceNote}
            sx={btnStyle(activeButton === "voice")}
          >
            <MicIcon sx={{ fontSize: 45 }} /> Sprachnotiz
          </Button>
          <Button
            onClick={() => setActiveButton("text")}
            sx={btnStyle(activeButton === "text")}
          >
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
            placeholder="Write your note here (English or German)..."
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
              "Send to AI"
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
                🤖 AI Response
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, whiteSpace: "pre-line" }}
              >
                {aiResponse}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <AddResidentDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        setResidents={setResidents}
      />

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

      <ResidentProfileDialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        resident={selectedResident}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />

      <ResidentsFooter />
    </Box>
  );
};

export default ResidentsProfiles;

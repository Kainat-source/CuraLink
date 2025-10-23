

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   Box,
//   Divider,
//   TextField,
//   CircularProgress,
//   Modal,
// } from "@mui/material";
// import MicIcon from "@mui/icons-material/Mic";
// import ArticleIcon from "@mui/icons-material/Article";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import EditIcon from "@mui/icons-material/Edit";
// import { askAI } from "../services/AiResult";

// const Center = () => {
//   const [staffList, setStaffList] = useState([]);
//   const [activeButton, setActiveButton] = useState(null);
//   const [voiceText, setVoiceText] = useState("");
//   const [textNote, setTextNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [aiResponse, setAiResponse] = useState("");

//   const [newStaff, setNewStaff] = useState({
//     name: "",
//     nutrition: "",
//     medication: "",
//     urination: "",
//     room: "",
//     careLevel: "",
//   });

//   const [adding, setAdding] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   const capitalizeFirst = (str = "") =>
//     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//   const buttonStyle = (isActive) => ({
//     bgcolor: isActive ? "success.main" : "white",
//     color: isActive ? "white" : "black",
//     fontSize: "1.2rem",
//     width: "200px",
//     height: "140px",
//     borderRadius: "16px",
//     boxShadow: 3,
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     textTransform: "capitalize",
//     "&:hover": { bgcolor: isActive ? "success.main" : "white" },
//   });

//   // 📦 Mitarbeiter abrufen
//   useEffect(() => {
//     fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff")
//       .then((res) => res.json())
//       .then((data) => setStaffList(data.staff || data))
//       .catch((err) =>
//         console.error("Fehler beim Abrufen der Mitarbeiter:", err)
//       );
//   }, []);

//   // 🎙️ Sprachnotiz
//   const handleVoiceNote = () => {
//     setActiveButton("voice");

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Spracherkennung wird von diesem Browser nicht unterstützt!");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "de-DE";
//     recognition.interimResults = false;
//     recognition.start();

//     recognition.onresult = async (event) => {
//       const transcript = event.results[0][0].transcript;
//       setVoiceText(transcript);
//       await handleSendToAI(transcript);
//     };

//     recognition.onerror = (event) => {
//       alert("Spracherkennungsfehler: " + event.error);
//     };
//   };

//   // 🧠 Notiz an KI senden
//   const handleSendToAI = async (noteInput) => {
//     const note = noteInput || textNote;
//     if (!note.trim()) return;

//     setLoading(true);
//     setAiResponse("");

//     const prompt = `
// Mitarbeiterliste:
// ${staffList
//   .map((s) => `${s.name} hat die Felder: nutrition, medication, urination`)
//   .join("\n")}

// Benutzer hat diese Notiz eingegeben: "${note}"
// Bitte identifiziere:
// 1. Den Namen des Mitarbeiters
// 2. Die richtige Kategorie (nutrition, medication oder urination)
// Gib nur folgendes Format zurück:
// Name: [Mitarbeitername]
// Kategorie: [Kategoriename]
// `;

//     try {
//       const res = await askAI(prompt);
//       setAiResponse(res);

//       const nameMatch = res.match(/Name:\s*(.+)/i);
//       const categoryMatch = res.match(/Category|Kategorie:\s*(.+)/i);

//       if (!nameMatch || !categoryMatch)
//         return alert("Die KI konnte keinen passenden Mitarbeiter finden.");

//       const staffName = nameMatch[1].trim();
//       const category = categoryMatch[1].trim().toLowerCase();

//       const staff = staffList.find(
//         (s) => s.name.toLowerCase() === staffName.toLowerCase()
//       );
//       if (!staff)
//         return alert(`Kein Mitarbeiter gefunden mit dem Namen ${staffName}`);

//       const updateRes = await fetch(
//         `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${staff._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ [category]: note }),
//         }
//       );

//       if (!updateRes.ok) throw new Error("Aktualisierung fehlgeschlagen");

//       const updated = await updateRes.json();
//       setStaffList((prev) =>
//         prev.map((s) => (s._id === staff._id ? updated.staff || updated : s))
//       );
//       setTextNote("");
//       setVoiceText("");
//     } catch (err) {
//       console.error("KI-Aktualisierungsfehler:", err);
//       alert("KI-Aktualisierung fehlgeschlagen. Siehe Konsole.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ➕ Mitarbeiter hinzufügen
//   const handleAddStaff = () => {
//     setActiveButton("add");
//     setOpenModal(true);
//   };

//   const handleSaveStaff = async () => {
//     const { name } = newStaff;
//     if (!name.trim()) return alert("Bitte einen Mitarbeiternamen eingeben!");

//     setAdding(true);
//     try {
//       const res = await fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newStaff),
//       });

//       if (!res.ok) throw new Error("Fehler beim Hinzufügen des Mitarbeiters");
//       const data = await res.json();

//       setStaffList((prev) => [...prev, data.staff || data]);
//       setOpenModal(false);
//       setNewStaff({
//         name: "",
//         nutrition: "",
//         medication: "",
//         urination: "",
//         room: "",
//         careLevel: "",
//       });
//     } catch (err) {
//       console.error("Hinzufügen fehlgeschlagen:", err);
//       alert("Fehler beim Hinzufügen des Mitarbeiters.");
//     } finally {
//       setAdding(false);
//     }
//   };

//   // ✏️ Mitarbeiter bearbeiten
//   const handleEditStaff = (staff) => {
//     setSelectedStaff(staff);
//     setNewStaff(staff);
//     setEditModal(true);
//   };

//   const handleUpdateStaff = async () => {
//     setUpdating(true);
//     try {
//       const res = await fetch(
//         `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${selectedStaff._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newStaff),
//         }
//       );

//       const data = await res.json();
//       setStaffList((prev) =>
//         prev.map((s) => (s._id === selectedStaff._id ? data.staff || data : s))
//       );
//       setEditModal(false);
//       setSelectedStaff(null);
//     } catch (err) {
//       console.error("Fehler beim Aktualisieren:", err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // 🖼️ UI
//   return (
//     <div style={{ background: "#fefefe", minHeight: "100vh" }}>
//       {/* Hauptbuttons */}
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         gap={{ xs: 1, sm: 2, md: 3 }}
//         mb={3}
//         flexWrap="wrap"
//         flexDirection={{ xs: "column", sm: "row" }}
//       >
//         <Button
//           onClick={handleVoiceNote}
//           sx={buttonStyle(activeButton === "voice")}
//         >
//           <MicIcon sx={{ fontSize: 60 }} />
//           Sprachnotiz
//         </Button>
//         <Button
//           onClick={() => setActiveButton("text")}
//           sx={buttonStyle(activeButton === "text")}
//         >
//           <ArticleIcon sx={{ fontSize: 60 }} />
//           Textnotiz
//         </Button>
//         <Button
//           onClick={handleAddStaff}
//           sx={buttonStyle(activeButton === "add")}
//         >
//           <PersonAddIcon sx={{ fontSize: 60 }} />
//           Mitarbeiter hinzufügen
//         </Button>
//       </Box>

//       <Divider />

//       {/* ✍️ Textnotiz */}
//       {activeButton === "text" && (
//         <Box
//           mt={3}
//           p={3}
//           sx={{
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             background: "#fafafa",
//           }}
//         >
//           <Typography>Geben Sie eine Notiz für den Mitarbeiter ein:</Typography>
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
//             disabled={loading}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "Senden"
//             )}
//           </Button>
//         </Box>
//       )}

//       {/* ➕ Modal zum Hinzufügen / Bearbeiten */}
//       <Modal
//         open={openModal || editModal}
//         onClose={() => {
//           setOpenModal(false);
//           setEditModal(false);
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 340,
//             bgcolor: "white",
//             boxShadow: 24,
//             p: 3,
//             borderRadius: 3,
//           }}
//         >
//           <Typography
//             variant="h6"
//             textAlign="center"
//             mb={2}
//             color="success.main"
//           >
//             {openModal
//               ? "Neuen Mitarbeiter hinzufügen"
//               : "Mitarbeiter bearbeiten"}
//           </Typography>

//           {[
//             { key: "name", label: "Name" },
//             { key: "nutrition", label: "Ernährung" },
//             { key: "medication", label: "Medikation" },
//             { key: "urination", label: "Urinieren" },
//             { key: "room", label: "Zimmer" },
//             { key: "careLevel", label: "Pflegegrad" },
//           ].map(({ key, label }) => (
//             <TextField
//               key={key}
//               label={label}
//               fullWidth
//               size="small"
//               sx={{ mb: 1 }}
//               value={newStaff[key]}
//               onChange={(e) =>
//                 setNewStaff({ ...newStaff, [key]: e.target.value })
//               }
//             />
//           ))}

//           <Button
//             variant="contained"
//             color="success"
//             fullWidth
//             onClick={openModal ? handleSaveStaff : handleUpdateStaff}
//             disabled={adding || updating}
//           >
//             {adding || updating ? (
//               <CircularProgress size={22} color="inherit" />
//             ) : openModal ? (
//               "Speichern"
//             ) : (
//               "Aktualisieren"
//             )}
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default Center;








import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,  
  Box,
  Divider,
  TextField,
  CircularProgress,
  Modal,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArticleIcon from "@mui/icons-material/Article";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import { askAI } from "../services/AiResult";

const Center = () => {
  const [staffList, setStaffList] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [textNote, setTextNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [aiResponse, setAiResponse] = useState("");

  const [newStaff, setNewStaff] = useState({
    name: "",
    nutrition: "",
    medication: "",
    urination: "",
    room: "",
    careLevel: "",
  });

  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const capitalizeFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const buttonStyle = (isActive) => ({
    bgcolor: isActive ? "success.main" : "white",
    color: isActive ? "white" : "black",
    fontSize: "1.2rem",
    width: "200px",
    height: "140px",
    borderRadius: "16px",
    boxShadow: 3,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textTransform: "capitalize",
    "&:hover": { bgcolor: isActive ? "success.main" : "white" },
  });

  // 📦 Fetch all staff
  useEffect(() => {
    fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff")
      .then((res) => res.json())
      .then((data) => setStaffList(data.staff || data))
      .catch((err) => console.error("Fetch staff error:", err));
  }, []);

  // 🎙️ Voice Note Handler
  const handleVoiceNote = () => {
    setActiveButton("voice");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      await handleSendToAI(transcript);
    };

    recognition.onerror = (event) => {
      alert("Speech error: " + event.error);
    };
  };

  // 🧠 Send Note (Text/Voice) to AI
  const handleSendToAI = async (noteInput) => {
    const note = noteInput || textNote;
    if (!note.trim()) return;

    setLoading(true);
    setAiResponse("");

    const prompt = `
Staff list:
${staffList
  .map(
    (s) => `${s.name} has fields: nutrition, medication, urination`
  )
  .join("\n")}

User entered this note: "${note}"
You must identify:
1. Name of the staff
2. Correct category (nutrition, medication, or urination)
Return this format only:
Name: [staff name]
Category: [category name]
`;

    try {
      const res = await askAI(prompt);
      setAiResponse(res);

      const nameMatch = res.match(/Name:\s*(.+)/i);
      const categoryMatch = res.match(/Category:\s*(.+)/i);

      if (!nameMatch || !categoryMatch) return alert("AI could not detect target staff.");

      const staffName = nameMatch[1].trim();
      const category = categoryMatch[1].trim().toLowerCase();

      const staff = staffList.find(
        (s) => s.name.toLowerCase() === staffName.toLowerCase()
      );
      if (!staff) return alert(`No staff found with name ${staffName}`);

      // Update backend field
      const updateRes = await fetch(`https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${staff._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [category]: note }),
      });

      if (!updateRes.ok) throw new Error("Failed to update staff");

      const updated = await updateRes.json();
      setStaffList((prev) =>
        prev.map((s) => (s._id === staff._id ? updated.staff || updated : s))
      );
      setTextNote("");
      setVoiceText("");
    } catch (err) {
      console.error("AI update error:", err);
      alert("AI update failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add Staff
  const handleAddStaff = () => {
    setActiveButton("add");
    setOpenModal(true);
  };

  const handleSaveStaff = async () => {
    const { name } = newStaff;
    if (!name.trim()) return alert("Enter staff name!");

    setAdding(true);
    try {
      const res = await fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      if (!res.ok) throw new Error("Failed to add staff");
      const data = await res.json();

      setStaffList((prev) => [...prev, data.staff || data]);
      setOpenModal(false);
      setNewStaff({
        name: "",
        nutrition: "",
        medication: "",
        urination: "",
        room: "",
        careLevel: "",
      });
    } catch (err) {
      console.error("Add error:", err);
      alert("Error adding staff.");
    } finally {
      setAdding(false);
    }
  };

  // ✏️ Edit staff
  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setNewStaff(staff);
    setEditModal(true);
  };

  const handleUpdateStaff = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${selectedStaff._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      const data = await res.json();
      setStaffList((prev) =>
        prev.map((s) => (s._id === selectedStaff._id ? data.staff || data : s))
      );
      setEditModal(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fefefe", minHeight: "100vh" }}>
      {/* Main Buttons */}
      <Box display="flex" justifyContent="center" gap={4} mb={3}>
        <Button onClick={handleVoiceNote} sx={buttonStyle(activeButton === "voice")}>
          <MicIcon sx={{ fontSize: 60 }} />
          Voice Note
        </Button>
        <Button onClick={() => setActiveButton("text")} sx={buttonStyle(activeButton === "text")}>
          <ArticleIcon sx={{ fontSize: 60 }} />
          Text Note
        </Button>
        <Button onClick={handleAddStaff} sx={buttonStyle(activeButton === "add")}>
          <PersonAddIcon sx={{ fontSize: 60 }} />
          Add Staff
        </Button>
      </Box>

      <Divider />

      {/* ✍️ Text Note Input */}
      {activeButton === "text" && (
        <Box mt={3} p={3} sx={{ border: "1px solid #ddd", borderRadius: "10px", background: "#fafafa" }}>
          <Typography>Enter a note for staff:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            placeholder="Type your note..."
          />
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => handleSendToAI()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </Button>
        </Box>
      )}

      {/* Staff Cards */}
      <Grid container spacing={2} mt={3}>
        {staffList.length > 0 ? (
          staffList.map((staff) => (
            <Grid item xs={12} sm={6} md={4} key={staff._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {capitalizeFirst(staff.name)}
                  </Typography>
                  <List dense>
                    <ListItem><ListItemText primary="Nutrition" secondary={staff.nutrition || "empty"} /></ListItem>
                    <ListItem><ListItemText primary="Medication" secondary={staff.medication || "empty"} /></ListItem>
                    <ListItem><ListItemText primary="Urination" secondary={staff.urination || "empty"} /></ListItem>
                    <ListItem><ListItemText primary="Room" secondary={staff.room || "N/A"} /></ListItem>
                    <ListItem><ListItemText primary="Care Level" secondary={staff.careLevel || "N/A"} /></ListItem>
                  </List>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditStaff(staff)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ mt: 4, mx: "auto" }}>No staff found.</Typography>
        )}
      </Grid>

      {/* Add/Edit Modal */}
      <Modal open={openModal || editModal} onClose={() => { setOpenModal(false); setEditModal(false); }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 340,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" textAlign="center" mb={2} color="success.main">
            {openModal ? "Add New Staff" : "Edit Staff"}
          </Typography>
          {["name", "nutrition", "medication", "urination", "room", "careLevel"].map((field) => (
            <TextField
              key={field}
              label={capitalizeFirst(field)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              value={newStaff[field]}
              onChange={(e) => setNewStaff({ ...newStaff, [field]: e.target.value })}
            />
          ))}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={openModal ? handleSaveStaff : handleUpdateStaff}
            disabled={adding || updating}
          >
            {(adding || updating)
              ? <CircularProgress size={22} color="inherit" />
              : openModal ? "Save" : "Update"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Center; 
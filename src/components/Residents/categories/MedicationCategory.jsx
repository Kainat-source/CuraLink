import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MedicationCategory = ({ resident, onAddResident }) => (
  <Box>
    <Button
      variant="outlined"
      startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
      onClick={onAddResident}
      sx={{
        textTransform: "none",
        borderColor: "#ccc",
        color: "#000",
        fontWeight: "bold",
        fontSize: "0.9rem",
        mb: 2,
      }}
    >
      Neuer Bewohner
    </Button>

    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{ color: "#2E7D32", mb: 1 }}
    >
      Medikamentennotizen
    </Typography>

    {resident.medication?.length ? (
      resident.medication.map((note, i) => (
        <Typography key={i} sx={{ mb: 1 }}>
          • {note}
        </Typography>
      ))
    ) : (
      <Typography>Keine Medikamentennotizen vorhanden.</Typography>
    )}
  </Box>
);

export default MedicationCategory;




// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";

// const MedicationCategory = ({ resident, setResidents }) => {
//   const [openForm, setOpenForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [note, setNote] = useState("");
//   const [entries, setEntries] = useState(resident?.medication || []);

//   const handleSave = async () => {
//     if (!note.trim()) return alert("Please enter a medication note.");

//     try {
//       setLoading(true);
//       const res = await fetch(
//         `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/medication`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ notes: note }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save note");

//       setEntries((prev) => [...prev, note]);
//       setResidents?.((prev) =>
//         prev.map((r) => (r._id === data.staff._id ? data.staff : r))
//       );

//       setNote("");
//       setOpenForm(false);
//     } catch (err) {
//       console.error("❌ Error saving medication note:", err);
//       alert("Error while saving medication note.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2 }}>
//       {/* ➕ New Entry Button */}
//       <Button
//         variant="outlined"
//         startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
//         onClick={() => setOpenForm(true)}
//         sx={{
//           textTransform: "none",
//           borderColor: "#ccc",
//           color: "#000",
//           fontWeight: "bold",
//           fontSize: "0.9rem",
//           mb: 2,
//         }}
//       >
//         New Entry
//       </Button>

//       <Typography
//         variant="h6"
//         fontWeight="bold"
//         sx={{ color: "#2E7D32", mb: 1 }}
//       >
//         Medication Notes
//       </Typography>

//       {/* Notes List */}
//       {entries?.length ? (
//         entries.map((note, i) => (
//           <Typography key={i} sx={{ mb: 1 }}>
//             • {note}
//           </Typography>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No medication notes yet.
//         </Typography>
//       )}

//       {/* 📝 Add Medication Note Dialog */}
//       <Dialog
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         PaperProps={{ sx: { borderRadius: "16px", width: "420px" } }}
//       >
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           px={2}
//           pt={1}
//         >
//           <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
//             Add Medication Note
//           </DialogTitle>
//           <IconButton onClick={() => setOpenForm(false)} size="small">
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <DialogContent dividers>
//           <TextField
//             label="Medication Note"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             multiline
//             rows={3}
//             fullWidth
//             size="small"
//             sx={{ mb: 2 }}
//           />
//           <Button
//             variant="contained"
//             color="success"
//             fullWidth
//             onClick={handleSave}
//             disabled={loading}
//             sx={{ textTransform: "none", fontWeight: "bold" }}
//           >
//             {loading ? "Saving..." : "💾 Save Note"}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default MedicationCategory;

// import React, { useState } from "react";
// import {
//   Dialog,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
//   Button,
//   Avatar,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const AddResidentDialog = ({ open, onClose, setResidents }) => {
//   const [newResident, setNewResident] = useState({
//     name: "",
//     pain: "",
//     nutrition: "",
//     mobility: "",
//     elimination: "",
//     medication: "",
//     urination: "",
//     general: "",
//     room: "",
//     bedNumber: "",
//     careLevel: "",
//     photo: null,
//   });

//   const [selectedFile, setSelectedFile] = useState(null);

//   // 📸 Foto-Upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewResident((prev) => ({ ...prev, photo: imageUrl }));
//       setSelectedFile(file);
//     }
//   };

//   // 💾 Bewohner speichern
//   const handleSave = async () => {
//     const { name } = newResident;
//     if (!name.trim()) return alert("Bitte den Namen des Bewohners eingeben!");

//     const formData = new FormData();
//     for (const key in newResident) {
//       if (newResident[key]) formData.append(key, newResident[key]);
//     }
//     if (selectedFile) formData.append("photo", selectedFile);

//     try {
// const res = await fetch("http://localhost:5000/api/staff", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setResidents((prev) => [...prev, data.staff || data]);
//         onClose();
//         setNewResident({
//           name: "",
//           pain: "",
//           nutrition: "",
//           mobility: "",
//           elimination: "",
//           medication: "",
//           urination: "",
//           room: "",
//           bedNumber: "",
//           careLevel: "",
//           photo: null,
//         });
//         setSelectedFile(null);
//       } else {
//         alert(data.error || "Fehler beim Hinzufügen des Bewohners");
//       }
//     } catch (err) {
//       console.error("❌ Fehler beim Speichern des Bewohners:", err);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           borderRadius: "16px",
//           maxWidth: 420,
//           width: "90%",
//           p: 3,
//         },
//       }}
//     >
//       <Box sx={{ position: "relative", backgroundColor: "#ffffff" }}>
//         {/* ❌ Schließen-Button */}
//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             top: 6,
//             right: 6,
//             color: "#888",
//             "&:hover": { color: "#d32f2f" },
//           }}
//         >
//           <CloseIcon fontSize="small" />
//         </IconButton>

//         {/* 🏷️ Titel */}
//         <Typography
//           variant="h6"
//           sx={{
//             mb: 2,
//             mt: 1,
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "#2E7D32",
//           }}
//         >
//           ➕ Neuen Bewohner hinzufügen
//         </Typography>

//         {/* Vollständiger Name */}
//         <TextField
//           fullWidth
//           size="small"
//           label="Vollständiger Name"
//           value={newResident.name}
//           onChange={(e) =>
//             setNewResident({ ...newResident, name: e.target.value })
//           }
//           sx={{ mb: 2 }}
//         />

//         {/* Zimmer & Bett */}
//         <Box display="flex" gap={1.5} sx={{ mb: 2 }}>
//           <TextField
//             fullWidth
//             size="small"
//             label="Zimmer"
//             value={newResident.room}
//             onChange={(e) =>
//               setNewResident({ ...newResident, room: e.target.value })
//             }
//           />
//           <TextField
//             fullWidth
//             size="small"
//             label="Bett"
//             value={newResident.bedNumber}
//             onChange={(e) =>
//               setNewResident({ ...newResident, bedNumber: e.target.value })
//             }
//           />
//         </Box>

//         {/* Pflegestufe */}
//         <TextField
//           fullWidth
//           size="small"
//           label="Pflegestufe"
//           value={newResident.careLevel}
//           onChange={(e) =>
//             setNewResident({ ...newResident, careLevel: e.target.value })
//           }
//           sx={{ mb: 2 }}
//         />

//         {/* Notizenabschnitt */}
//         <TextField
//           fullWidth
//           size="small"
//           label="Schmerz-Notizen"
//           value={newResident.pain}
//           onChange={(e) =>
//             setNewResident({ ...newResident, pain: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         <TextField
//           fullWidth
//           size="small"
//           label="Ernährungs-Notizen"
//           value={newResident.nutrition}
//           onChange={(e) =>
//             setNewResident({ ...newResident, nutrition: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         <TextField
//           fullWidth
//           size="small"
//           label="Mobilitäts-Notizen"
//           value={newResident.mobility}
//           onChange={(e) =>
//             setNewResident({ ...newResident, mobility: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         <TextField
//           fullWidth
//           size="small"
//           label="Ausscheidungs-Notizen"
//           value={newResident.elimination}
//           onChange={(e) =>
//             setNewResident({ ...newResident, elimination: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         <TextField
//           fullWidth
//           size="small"
//           label="Medikations-Notizen"
//           value={newResident.medication}
//           onChange={(e) =>
//             setNewResident({ ...newResident, medication: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         <TextField
//           fullWidth
//           size="small"
//           label="Harn-Notizen"
//           value={newResident.urination}
//           onChange={(e) =>
//             setNewResident({ ...newResident, urination: e.target.value })
//           }
//           sx={{ mb: 1.5 }}
//         />

//         {/* Foto-Upload */}
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{ mb: 2 }}
//         >
//           <Button
//             variant="outlined"
//             component="label"
//             sx={{
//               textTransform: "none",
//               color: "#2E7D32",
//               borderColor: "#2E7D32",
//               fontSize: "0.85rem",
//               py: 0.4,
//               px: 1.5,
//               "&:hover": {
//                 backgroundColor: "#E8F5E9",
//                 borderColor: "#1B5E20",
//               },
//             }}
//           >
//             Foto hochladen
//             <input type="file" hidden onChange={handleFileUpload} />
//           </Button>

//           {newResident.photo && (
//             <Avatar
//               src={newResident.photo}
//               alt="Vorschau"
//               sx={{ width: 50, height: 50, border: "2px solid #2E7D32" }}
//             />
//           )}
//         </Box>

//         {/* Speichern-Button */}
//         <Button
//           fullWidth
//           variant="contained"
//           color="success"
//           onClick={handleSave}
//           sx={{
//             py: 0.9,
//             fontWeight: "bold",
//             fontSize: "0.95rem",
//             textTransform: "none",
//           }}
//         >
//           💾 Bewohner speichern
//         </Button>
//       </Box>
//     </Dialog>
//   );
// };

// export default AddResidentDialog;





import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddResidentDialog = ({ open, onClose, setResidents }) => {
  const [newResident, setNewResident] = useState({
    name: "",
    pain: "",
    nutrition: "",
    mobility: "",      // ❌ This will NOT be saved here
    elimination: "",   // ❌ This will NOT be saved here
    medication: "",
    urination: "",
    general: "",       // ❌ This will NOT be saved here
    room: "",
    bedNumber: "",
    careLevel: "",
    photo: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ Photo upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewResident((prev) => ({ ...prev, photo: imageUrl }));
      setSelectedFile(file);
    }
  };

  // ✅ SAVE resident
  const handleSave = async () => {
    const { name } = newResident;
    if (!name.trim()) return alert("Bitte den Namen eingeben!");

    // ✅ FormData ONLY for simple fields
    const formData = new FormData();

    formData.append("name", newResident.name);
    formData.append("room", newResident.room);
    formData.append("bedNumber", newResident.bedNumber);
    formData.append("careLevel", newResident.careLevel);
    formData.append("pain", newResident.pain);
    formData.append("nutrition", newResident.nutrition);
    formData.append("medication", newResident.medication);
    formData.append("urination", newResident.urination);

    // ✅ IMPORTANT: DO NOT SEND mobility / elimination / general here
    // They must remain empty arrays on creation

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      const res = await fetch("https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Fehler beim Hinzufügen");
        return;
      }

      // ✅ Update frontend list
      setResidents((prev) => [...prev, data.staff]);

      // ✅ Reset form
      onClose();
      setNewResident({
        name: "",
        pain: "",
        nutrition: "",
        mobility: "",
        elimination: "",
        medication: "",
        urination: "",
        general: "",
        room: "",
        bedNumber: "",
        careLevel: "",
        photo: null,
      });
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "16px", maxWidth: 420, width: "90%", p: 3 },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            color: "#888",
            "&:hover": { color: "#d32f2f" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            mt: 1,
            fontWeight: "bold",
            textAlign: "center",
            color: "#2E7D32",
          }}
        >
          ➕ Neuen Bewohner hinzufügen
        </Typography>

        {/* Name */}
        <TextField
          fullWidth
          size="small"
          label="Vollständiger Name"
          value={newResident.name}
          onChange={(e) =>
            setNewResident({ ...newResident, name: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        {/* Room + Bed */}
        <Box display="flex" gap={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Zimmer"
            value={newResident.room}
            onChange={(e) =>
              setNewResident({ ...newResident, room: e.target.value })
            }
          />
          <TextField
            fullWidth
            size="small"
            label="Bett"
            value={newResident.bedNumber}
            onChange={(e) =>
              setNewResident({ ...newResident, bedNumber: e.target.value })
            }
          />
        </Box>

        {/* Care Level */}
        <TextField
          fullWidth
          size="small"
          label="Pflegestufe"
          value={newResident.careLevel}
          onChange={(e) =>
            setNewResident({ ...newResident, careLevel: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        {/* Notes */}
        <TextField
          fullWidth
          size="small"
          label="Schmerz-Notizen"
          value={newResident.pain}
          onChange={(e) =>
            setNewResident({ ...newResident, pain: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Ernährungs-Notizen"
          value={newResident.nutrition}
          onChange={(e) =>
            setNewResident({ ...newResident, nutrition: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Medikations-Notizen"
          value={newResident.medication}
          onChange={(e) =>
            setNewResident({ ...newResident, medication: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Harn-Notizen"
          value={newResident.urination}
          onChange={(e) =>
            setNewResident({ ...newResident, urination: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        {/* Photo Upload */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Button variant="outlined" component="label" sx={{ color: "#2E7D32" }}>
            Foto hochladen
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>

          {newResident.photo && (
            <Avatar
              src={newResident.photo}
              sx={{ width: 50, height: 50, border: "2px solid #2E7D32" }}
            />
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleSave}
          sx={{
            py: 0.9,
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "none",
          }}
        >
          💾 Bewohner speichern
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddResidentDialog;

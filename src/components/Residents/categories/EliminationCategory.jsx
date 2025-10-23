import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const EliminationCategory = ({ resident, setResidents }) => {
  const [entries, setEntries] = useState(resident?.elimination || []);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interval: "",
    amount: "",
    consistency: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const now = new Date();
    const entryTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const eventTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const formattedDate = `${entryTime} ${eventTime}`;

    const newEntry = {
      date: formattedDate,
      interval: formData.interval.trim() || "—",
      amount: formData.amount.trim() || "—",
      consistency: formData.consistency.trim() || "—",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/elimination`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry: newEntry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save entry");

      setEntries(data.staff.elimination);
      if (setResidents)
        setResidents((prev) =>
          prev.map((r) => (r._id === data.staff._id ? data.staff : r))
        );

      setOpenForm(false);
      setFormData({ interval: "", amount: "", consistency: "" });
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("Error while saving entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="nowrap"
        gap={1}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "green" }} />}
          onClick={() => setOpenForm(true)}
          sx={{
            textTransform: "none",
            borderColor: "lightgray",
            color: "black",
            fontWeight: "bold",
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            px: { xs: 1.5, sm: 2 },
            whiteSpace: "nowrap",
          }}
        >
          Neuer Eintrag
        </Button>

        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            textAlign: "right",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}
        >
          Letzte 7 Tage
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          borderRadius: 2,
          width: "100%",
          overflowX: "auto", 
          maxHeight: { xs: "50vh", sm: "none" },
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            width: "100%",
            tableLayout: "fixed",
            "& th, & td": {
              fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
              padding: { xs: "4px", sm: "6px", md: "8px" },
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
            "& th": {
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Datum/Uhrzeit</TableCell>
              <TableCell>Abstand</TableCell>
              <TableCell>Menge</TableCell>
              <TableCell>Konsistenz</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.date || "—"}</TableCell>
                  <TableCell>{e.interval || "—"}</TableCell>
                  <TableCell>{e.amount || "—"}</TableCell>
                  <TableCell>{e.consistency || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Keine Einträge vorhanden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Entry Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: { xs: "90vw", sm: "420px" },
            maxWidth: "95vw",
            p: { xs: 1, sm: 2 },
            maxHeight: { xs: "80vh", sm: "auto" }, 
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
              fontWeight: "bold",
              color: "#2E7D32",
              p: 0,
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            Neuer Eintrag
          </DialogTitle>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            maxHeight: { xs: "65vh", sm: "auto" },
            overflowY: "auto", 
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Abstand (z. B. 3 Tage)"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Menge (z. B. gering, normal, groß)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Konsistenz (z. B. fest, weich, normal)"
                name="consistency"
                value={formData.consistency}
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
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {loading ? "Speichern..." : "💾 Speichern"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EliminationCategory;

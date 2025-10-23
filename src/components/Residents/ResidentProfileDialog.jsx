import React, { useState } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddResidentDialog from "./AddResidentDialog";

// ✅ Category Components
import PainChart from "./categories/PainChart";
import NutritionCategory from "./categories/NutritionCategory";
import MobilityCategory from "./categories/MobilityCategory";
import EliminationCategory from "./categories/EliminationCategory";
import GeneralCategory from "./categories/GeneralCategory";

const ResidentProfileDialog = ({
  open,
  onClose,
  resident,
  tabIndex,
  setTabIndex,
  setResidents,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (!resident) return null;

  const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

  const categories = [
    { key: "pain", label: "Schmerz + Beobachtung", component: PainChart },
    { key: "nutrition", label: "Ernährung", component: NutritionCategory },
    { key: "mobility", label: "Mobilität", component: MobilityCategory },
    {
      key: "elimination",
      label: "Ausscheidung",
      component: EliminationCategory,
    },
    { key: "general", label: "Allgemein", component: GeneralCategory },
  ];

  const ActiveComponent = categories[tabIndex]?.component || GeneralCategory;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "16px",
            width: isMobile ? "100vw" : isTablet ? "90vw" : "85vw",
            height: isMobile ? "100vh" : isTablet ? "90vh" : "85vh",
            overflow: "hidden",
          },
        }}
      >
        {/* ✅ Header */}
        <AppBar
          sx={{
            position: "sticky",
            backgroundColor: "#fff",
            color: "black",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar
            sx={{
              px: isMobile ? 1 : 2,
              minHeight: isMobile ? "56px" : "64px",
            }}
          >
            <IconButton edge="start" onClick={onClose} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                fontSize: isMobile ? "1rem" : "1.2rem",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {capitalize(resident.name)}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ✅ Body */}
        <DialogContent
          sx={{
            p: isMobile ? 2 : 4,
            bgcolor: "#fafafa",
            overflowY: "auto",
            height: isMobile ? "calc(100vh - 56px)" : "calc(85vh - 64px)",
          }}
        >
          {/* 🧍 Resident Info */}
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "center" : "flex-start"}
            textAlign={isMobile ? "center" : "left"}
            gap={isMobile ? 2 : 3}
            mb={3}
          >
            <Avatar
              src={resident.photo}
              alt={resident.name}
              sx={{
                width: isMobile ? 80 : 100,
                height: isMobile ? 80 : 100,
              }}
            />
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                {capitalize(resident.name)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zimmer {resident.room || "N/A"} • Bett{" "}
                {resident.bedNumber || "N/A"} • Pflegestufe:{" "}
                {resident.careLevel || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* 🗂 Responsive Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="inherit"
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: isMobile ? "flex-start" : "center",
                gap: isMobile ? 0.5 : 2,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                color: "black",
                fontWeight: 600,
                minHeight: isMobile ? "32px" : "36px",
                paddingY: isMobile ? "3px" : "5px",
                px: isMobile ? 1.2 : 2.5,
                fontSize: isMobile
                  ? "0.75rem"
                  : isTablet
                  ? "0.85rem"
                  : "0.95rem",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              },
              "& .Mui-selected": {
                color: "#2E7D32",
                fontWeight: "bold",
                backgroundColor: isMobile
                  ? "rgba(46,125,50,0.08)"
                  : "transparent",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2E7D32",
                height: "3px",
                borderRadius: "3px",
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.key} label={cat.label} />
            ))}
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {/* 🧩 Category Content */}
          <ActiveComponent
            resident={resident}
            onAddResident={() => setShowAddForm(true)}
          />
        </DialogContent>
      </Dialog>

      {/* 🟢 Add Resident Modal */}
      <AddResidentDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        setResidents={setResidents}
      />
    </>
  );
};

export default ResidentProfileDialog;

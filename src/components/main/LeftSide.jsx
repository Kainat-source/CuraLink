import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArticleIcon from "@mui/icons-material/Article";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const LeftSide = ({ onResidentsClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const menuItems = [
    { name: "Bewohner", icon: <PeopleIcon />, action: onResidentsClick },
    { name: "Berichte", icon: <ArticleIcon /> },
    { name: "Nachweise", icon: <CalendarTodayIcon /> },
    { name: "Zeitplan", icon: <CalendarTodayIcon /> },
    { name: "Dokumente", icon: <DescriptionIcon /> },
    { name: "Termine", icon: <EventAvailableIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <List sx={{ width: "100%", maxWidth: 260 }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => {
              setSelectedIndex(index);
              if (item.action) item.action();
            }}
            sx={{
              borderRadius: "10px",
              mb: 0.8,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                "& .MuiListItemIcon-root": { color: "#2E7D32" },
              },
              "&:hover": { bgcolor: "#F1F8E9" },
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: "#555" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontSize: "15px",
                fontWeight: selectedIndex === index ? 600 : 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom status indicators */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          mt: 25,
          borderTop: "1px solid #e0e0e0",
          pt: 1,
        }}
      >
        <Button size="small" sx={{ flex: 1, textTransform: "none", color: "black" }}>
          <FiberManualRecordIcon color="success" fontSize="small" />
          Synchronisiert
        </Button>
        <Button size="small" sx={{ flex: 1, textTransform: "none", color: "black" }}>
          <PeopleIcon color="success" fontSize="small" />
          KI Aktiv
        </Button>
      </Box>
    </Box>
  );
};

export default LeftSide;



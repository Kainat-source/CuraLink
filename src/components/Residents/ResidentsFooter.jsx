// src/components/Residents/ResidentsFooter.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const ResidentsFooter = () => {
  return (
    <Box sx={{ mt: 5,mb: 1, textAlign: "center", pb: 4 }}>
      <Typography
        variant="subtitle1"
        sx={{
          color: "#2E7D32",
          fontWeight: 700,
          fontSize: "1.1rem",
          textShadow: "0px 0px 2px rgba(0,0,0,0.1)",
        }}
      >
       Pflege, die verbindet.
      </Typography>
    </Box>
  );
};

export default ResidentsFooter;

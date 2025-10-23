import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const RightSide = () => {
  const dailyPlan = [
    {
      name: "Frau Mustermann",
      room: 12,
      tasks: [
        { text: "Morgenpflege erledigt", subText: "10.00 Medikamente" },
      ],
    },
    {
      name: "Hr. Schwarz",
      room: 9,
      tasks: [{ text: "Transfer ausstehend" }],
    },
    {
      name: "Fr. Koch",
      room: 17,
      tasks: [{ text: "Baden erledigt" }],
    },
  ];

  return (
    <Box sx={{ p: 2, fontFamily: "Gilroy, sans-serif" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 1.2, color: "#000", fontSize: "1.05rem" }}
      >
        Tagesplan
      </Typography>

      {dailyPlan.map((person, i) => (
        <Box key={i} sx={{ mb: 1.2 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#000",
              mb: 0.3,
              fontSize: "0.95rem",
            }}
          >
            {person.name}, Zimmer {person.room}
          </Typography>

          <List dense sx={{ mt: 0, mb: 0, p: 0 }}>
            {person.tasks.map((task, j) => (
              <ListItem
                key={j}
                sx={{
                  pl: 0,
                  py: 0.2,
                  minHeight: "28px",
                }}
              >
                <ListItemIcon sx={{ minWidth: 26 }}>
                  <CheckCircleIcon sx={{ color: "#2E7D32", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
                      {task.text}
                    </Typography>
                  }
                  secondary={
                    task.subText ? (
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "#777",
                          mt: 0.1,
                        }}
                      >
                        {task.subText}
                      </Typography>
                    ) : null
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default RightSide;

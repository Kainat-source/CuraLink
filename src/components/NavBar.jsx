// import React from "react";
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   IconButton,
//   Typography,
//   Menu,
//   Avatar,
//   Tooltip,
//   MenuItem,
//   Container,
//   InputBase,
// } from "@mui/material";
// import AdbIcon from "@mui/icons-material/Adb";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import Curalogo from "../assets/download.png";

// const settings = ["Profile", "Account", "Dashboard", "Logout"];

// // 🔍 Search bar styles
// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: "8px",
//   backgroundColor: "#fff",
//   boxShadow: "0 0 6px rgba(0,0,0,0.15)",
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: "100%",
//   height: "50px",
//   display: "flex",
//   alignItems: "center",
//   [theme.breakpoints.up("sm")]: {
//     width: "500px",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   color: "#1B5E20",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "#000",
//   width: "100%",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1.5, 1, 1.5, 0),
//     paddingLeft: `calc(1em + ${theme.spacing(5)})`,
//     transition: theme.transitions.create("width"),
//     fontSize: "1rem",
//     width: "100%",
//     [theme.breakpoints.up("sm")]: {
//       width: "100%",
//     },
//   },
// }));

// const NavBar = () => {
//   const [anchorElUser, setAnchorElUser] = React.useState(null);
//   const navigate = useNavigate();
//   const name = localStorage.getItem("name");

//   const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
//   const handleCloseUserMenu = () => setAnchorElUser(null);

//   const handleMenuClick = (setting) => {
//     if (setting === "Logout") {
//       localStorage.clear();
//       navigate("/login", { replace: true });
//     } else {
//       alert(`You clicked on ${setting}`);
//     }
//     handleCloseUserMenu();
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         backgroundColor: "#1B5E20",
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
//           {/* Logo */}
//           <Box
//             sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//           >
//             <img
//               src={Curalogo}
//               alt="CuraLink Logo"
//               style={{
//                 width: 45,
//                 height: 45,
//                 backgroundColor: "transparent", // remove green box behind
//                 display: "block",
//               }}
//             />

//             <Typography
//               variant="h6"
//               noWrap
//               sx={{ color: "#fff", fontWeight: "bold", cursor: "pointer" }}
//             >
//               CuraLink
//             </Typography>
//           </Box>

//           {/* Search box */}
//           <Search>
//             <SearchIconWrapper>
//               <SearchIcon fontSize="medium" />
//             </SearchIconWrapper>
//             <StyledInputBase
//               placeholder="Bewohner oder Wohnung suchen..."
//               inputProps={{ "aria-label": "search" }}
//             />
//           </Search>

//           {/* Profile */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
//             <Tooltip title="Open settings">
//               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                 <Avatar
//                   sx={{
//                     width: 40,
//                     height: 40,
//                     backgroundColor: "#fff",
//                     color: "#1B5E20",
//                   }}
//                 >
//                   {name ? name[0] : "U"}
//                 </Avatar>
//               </IconButton>
//             </Tooltip>
//             <Typography sx={{ color: "#fff" }}>{name || "User"}</Typography>

//             <Menu
//               anchorEl={anchorElUser}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map((setting) => (
//                 <MenuItem
//                   key={setting}
//                   onClick={() => handleMenuClick(setting)}
//                   sx={{ color: setting === "Logout" ? "red" : "inherit" }}
//                 >
//                   <Typography textAlign="center">{setting}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default NavBar;



import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ListIcon from "@mui/icons-material/List";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Curalogo from "../assets/download.png";

// Menu items
const settings = ["Profile", "Account", "Dashboard", "Logout"];

// 🔍 Search bar styles
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 0 6px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  height: "45px",
  width: "100%",
  maxWidth: "500px",
  margin: "0 16px",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "180px",
    height: "38px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1B5E20",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#000",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: "1rem",
    width: "100%",
  },
}));

const NavBar = ({ onLeftMenuClick, onRightMenuClick }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const name = localStorage.getItem("name") || "User";

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleMenuClick = (setting) => {
    if (setting === "Logout") {
      localStorage.clear();
      navigate("/login", { replace: true });
    } else {
      alert(`You clicked on ${setting}`);
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1B5E20",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            px: isMobile ? 1 : 2,
          }}
        >
          {/* ✅ Left Menu Icon (only for mobile) */}
          {isMobile && !showSearch && (
            <IconButton color="inherit" onClick={onLeftMenuClick}>
              <MenuIcon />
            </IconButton>
          )}

          {/* ✅ Logo + Text */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 0.5 : 1.2,
              cursor: "pointer",
            }}
          >
            <img
              src={Curalogo}
              alt="CuraLink Logo"
              style={{
                width: isMobile ? 32 : 45,
                height: isMobile ? 32 : 45,
                display: "block",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "1rem" : "1.25rem",
              }}
            >
              CuraLink
            </Typography>
          </Box>

          {/* ✅ Search */}
          {isMobile ? (
            showSearch ? (
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon fontSize="medium" />
                  </SearchIconWrapper>
                  <StyledInputBase
                    autoFocus
                    placeholder="Bewohner suchen..."
                    inputProps={{ "aria-label": "search" }}
                    onBlur={() => setShowSearch(false)}
                  />
                </Search>
              </Box>
            ) : (
              <IconButton
                color="inherit"
                sx={{ ml: "auto", mr: 1 }}
                onClick={() => setShowSearch(true)}
              >
                <SearchIcon />
              </IconButton>
            )
          ) : (
            <Search>
              <SearchIconWrapper>
                <SearchIcon fontSize="medium" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Bewohner oder Wohnung suchen..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          )}

          {/* ✅ Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 0.5 : 1.2,
              ml: isMobile ? "auto" : 0,
            }}
          >
            {/* Profile */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#fff",
                    color: "#1B5E20",
                    fontSize: "1rem",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* User name (hidden on mobile) */}
            {!isMobile && (
              <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                {name}
              </Typography>
            )}

            {/* Right menu icon (only on mobile) */}
            {isMobile && !showSearch && (
              <IconButton
                color="inherit"
                onClick={onRightMenuClick}
                sx={{
                  ml: 0.5,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListIcon />
              </IconButton>
            )}

            {/* User Menu */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleMenuClick(setting)}
                  sx={{ color: setting === "Logout" ? "red" : "inherit" }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;

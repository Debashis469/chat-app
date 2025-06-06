// src/components/Header.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const Header = ({ onSearchClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" color="default" sx={{ padding: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Search bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{ width: "250px", backgroundColor: "#f1f1f1" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          onClick={onSearchClick}
        />

        {/* Middle Section: Tooltip with App Name */}
        <Tooltip title="CHATZY" arrow>
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{ cursor: "pointer" }}
          >
            CHATZY
          </Typography>
        </Tooltip>

        {/* Right Section: Notifications and User Profile */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton onClick={handleMenuClick} sx={{ ml: 1 }}>
            <Avatar src={user?.profilePicture} alt={user?.name} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

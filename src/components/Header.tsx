import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { SECTIONS } from "../constants/homeHeaderConstants";
import { User, setUser } from "../redux/reducers/userSlice";

interface Section {
  title: string;
  url: string;
}

const Header: React.FC = () => {
  const sections: Section[] = SECTIONS;
  const dispatch = useDispatch();
  const user: User | null = useSelector((state: RootState) => state.user.value);

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<
    (EventTarget & HTMLElement) | null
  >(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("userObj");
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user &&
        sections !== undefined &&
        sections.length > 0 &&
        sections.map((section) => (
          <MenuItem onClick={handleProfileMenuOpen} key={section.url}>
            <RouterLink
              key={section.title}
              to={section.url}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <Typography variant="h6" component="h6">
                {section.title}
              </Typography>
            </RouterLink>
          </MenuItem>
        ))}
      {user && (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      )}
      {!user && (
        <MenuItem onClick={handleProfileMenuOpen}>
          <RouterLink
            key={"SignIn"}
            to={"/login"}
            style={{
              flexShrink: "0",
              textDecoration: "none",
              color: "black",
            }}
          >
            <Typography variant="h6" component="h6">
              {"Sign In"}
            </Typography>
          </RouterLink>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <RouterLink to="/" style={{ textDecoration: "none", color: "white" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <strong>Message Board</strong>
            </Typography>
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          {user && (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {sections !== undefined &&
                  sections.length > 0 &&
                  sections.map((section) => (
                    <RouterLink
                      key={section.title}
                      to={section.url}
                      style={{
                        padding: "1rem",
                        flexShrink: "0",
                        textDecoration: "none",
                        color: "white",
                      }}
                    >
                      <Typography variant="h6" component="h6">
                        {section.title}
                      </Typography>
                    </RouterLink>
                  ))}
              </Box>

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="medium"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>
            </>
          )}

          {!user && (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {[{ title: "Contact", url: "/contact" }].map((section) => (
                  <RouterLink
                    key={section.title}
                    to={section.url}
                    style={{
                      padding: "1rem",
                      flexShrink: "0",
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" component="h6">
                      {section.title}
                    </Typography>
                  </RouterLink>
                ))}
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <RouterLink
                  key={"SignIn"}
                  to={"/login"}
                  style={{
                    padding: "1rem",
                    flexShrink: "0",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" component="h6">
                    {"Sign In"}
                  </Typography>
                </RouterLink>
              </Box>
            </>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="medium"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {user && <>{renderMenu}</>}
      {renderMobileMenu}
    </Box>
  );
};

export default Header;

import { React, useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SECTIONS } from "../constants/homeHeaderConstants";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { UserContext } from "../contexts/UserContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Header = () => {
  const sections = SECTIONS;
  const { user, setUser } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    // upon close event close menu
    setAnchorEl(null);

    // also close mobile menu
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userObj");
    // upon close event close menu
    setAnchorEl(null);

    // also close mobile menu
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
      <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {/* To separate items to left and right side */}
          <Box sx={{ flexGrow: 1 }} />

          {user && (
            <>
              {/* Sections */}
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

              {/* User account related*/}

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

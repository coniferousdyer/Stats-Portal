import Link from "next/link";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import CompareIcon from "@mui/icons-material/Compare";
import styles from "../../styles/components/common/Navbar.module.css";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  // The links to the pages present on the navbar
  const pages = [
    {
      name: "Leaderboards",
      link: "/leaderboards",
      icon: <LeaderboardIcon className={styles.link_icon} />,
    },
    {
      name: "User Visualizer",
      link: "/users",
      icon: <PersonIcon className={styles.link_icon} />,
    },
    {
      name: "Compare",
      link: "/compare",
      icon: <CompareIcon className={styles.link_icon} />,
    },
  ];

  // The navbar turns into a hamburger icon on smaller devices.
  // This function handles the menu opening on smaller devices.
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // This function handles the menu closing on smaller devices.
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Collapsed (with hamburger icon) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            className={styles.weighted_link}
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            STATS PORTAL
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page["name"]}>
                  <Link href={page["link"]} passHref>
                    <Typography
                      textAlign="center"
                      className={`${styles.unweighted_link} ${styles.menu_link}`}
                    >
                      {page["icon"]}
                      {page["name"]}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Uncollapsed (without hamburger icon) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            className={styles.weighted_link}
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            STATS PORTAL
          </Typography>

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className={styles.links_container}
          >
            {pages.map((page) => (
              <Link key={page["name"]} href={page["link"]} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  className={styles.weighted_link}
                  sx={{ my: 2, color: "black", display: "flex" }}
                >
                  {page["icon"]}
                  {page["name"]}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

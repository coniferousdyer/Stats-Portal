// External library components.
import Link from "next/link";
import { useState } from "react";

//  Material UI components.
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
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

// CSS styles.
import styles from "../../styles/components/common/Navbar.module.css";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  // Configure the scroll trigger. We need this to add the "scroll on appear" effect
  // to the navbar.
  const trigger = useScrollTrigger();

  // The links to the pages present on the navbar. These are common to both the
  // collapsed (smaller devices) and expanded (larger devices) navbars.
  const pages = [
    {
      name: "Leaderboards",
      link: "/leaderboards",
      icon: <LeaderboardIcon className={styles.link_icon} />,
    },
    {
      name: "User Visualizer",
      link: "/user",
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
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar color="">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Uncollapsed (with hamburger icon) navbar heading */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              className={styles.weighted_link}
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <Link href="/" passHref>
                STATS PORTAL
              </Link>
            </Typography>

            {/* Collapsed (with hamburger icon) links */}
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
                  <MenuItem key={page.name}>
                    <Link href={page.link} passHref>
                      <Typography
                        textAlign="center"
                        className={`${styles.unweighted_link} ${styles.menu_link}`}
                      >
                        {page.icon}
                        {page.name}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Collapsed (without hamburger icon) navbar heading */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              className={styles.weighted_link}
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <Link href="/" passHref>
                STATS PORTAL
              </Link>
            </Typography>

            {/* Uncollapsed (without hamburger icon) links */}
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
              className={styles.links_container}
            >
              {pages.map((page) => (
                <Link key={page.name} href={page.link} passHref>
                  <Button
                    onClick={handleCloseNavMenu}
                    className={styles.weighted_link}
                    sx={{ my: 2, color: "black", display: "flex" }}
                  >
                    {page.icon}
                    {page.name}
                  </Button>
                </Link>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Navbar;

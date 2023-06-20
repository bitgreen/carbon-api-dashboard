import React, { useState, useEffect } from "react";
import {
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
} from "@mui/material";
import Link from "next/link";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Co2Icon from "@mui/icons-material/Co2";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HubIcon from "@mui/icons-material/Hub";
import styles from "../styles/Home.module.css";

type Anchor = "top" | "left" | "bottom" | "right";

//Drawer component with links to dashboard pages
const MenuDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const returnIcon = (name: string) => {
    switch (name) {
      case "Home":
        return <HomeIcon color='inherit' />;
      case "Nodes":
        return <DevicesIcon />;
      case "Power Consumption":
        return <Battery3BarIcon />;
      case "Carbon Footprint":
        return <Co2Icon />;
      case "Energy Mix":
        return <SolarPowerIcon />;
      case "Networks":
        return <HubIcon />;
      default:
        return <ArrowRightIcon />;
    }
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      color='white'
    >
      <p style={{ padding: "10px 0px 0px 15px" }}>DASHBOARD</p>
      <List>
        {[
          ["Home", "/"],
          ["Power Consumption", "/data/power"],
          ["Carbon Footprint", "/data/carbon"],
          ["Energy Mix", "/data/renewables"],
        ].map((text, index) => (
          <Link key={index} href={text[1]}>
            <ListItem key={text[0]} disablePadding className={styles.menuItem}>
              <ListItemButton>
                <ListItemIcon className={styles.menuItemIcon}>
                  {returnIcon(text[0])}
                </ListItemIcon>
                <ListItemText primary={text[0]} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider style={{ backgroundColor: "lightGrey" }} />
      <List>
        {[
          ["Nodes", "/data/nodes"],
          ["Networks", "/networks"],
        ].map((text, index) => (
          <Link key={index} href={text[1]}>
            <ListItem key={text[0]} disablePadding className={styles.menuItem}>
              <ListItemButton>
                <ListItemIcon className={styles.menuItemIcon}>
                  {returnIcon(text[0])}
                </ListItemIcon>
                <ListItemText primary={text[0]} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider style={{ backgroundColor: "lightGrey" }} />
      <List>
        {["Parachain operators"].map((text, index) => (
          <Link key={index} href={"/login"}>
            <ListItem key={text} disablePadding className={styles.menuItem}>
              <ListItemButton>
                <ListItemIcon className={styles.menuItemIcon}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
  return (
    <div>
      <React.Fragment key={"right"}>
        <IconButton onClick={toggleDrawer("right", true)} color='inherit'>
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default MenuDrawer;

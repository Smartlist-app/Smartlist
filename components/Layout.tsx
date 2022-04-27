import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Skeleton from "@mui/material/Skeleton";
import { Navbar } from "./Navbar";
import { DrawerListItems } from "./Links";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";
import useWindowDimensions from "./useWindowDimensions";

import { blue } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LabelIcon from "@mui/icons-material/Label";
import useSWR from "swr";

import React, { useEffect } from "react";

const drawerWidth = 300;
const fetcher = (u: string, o: any) => fetch(u, o).then((res) => res.json());

function CustomRooms() {
  const url = "https://api.smartlist.tech/v2/rooms/";

  const { data, error } = useSWR(url, () =>
    fetcher(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken
      })
    })
  );
  if (error) return <div>Failed to load room!</div>;
  if (!data)
    return (
      <div>
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={118}
          animation={false}
        />
      </div>
    );
  interface Room {
    name: string;
    id: number;
  }
  // render data
  return (
    <>
      {data.data.map((room: Room) => (
        <ListItemButton sx={{ pl: 4, borderRadius: "0 40px 40px 0" }}>
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText primary={room.name} />
        </ListItemButton>
      ))}
    </>
  );
}

function ResponsiveDrawer(props: any): JSX.Element {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  useEffect(() => {
    if (document.querySelector(`meta[name="theme-color"]`))
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          mobileOpen
            ? global.theme === "dark"
              ? "#101010"
              : "#808080"
            : blue[50]
        );
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { width }: any = useWindowDimensions();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <SwipeableDrawer
          variant="temporary"
          swipeAreaWidth={width > 992 ? 0 : 10}
          open={mobileOpen}
          PaperProps={{
            sx: {
              pr: "2px",
              m: "15px",
              height: "calc(100vh - 30px)!important",
              borderRadius: 3
            }
          }}
          onClose={handleDrawerToggle}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              height: "100vh",
              overflowY: "scroll",
              width: drawerWidth
            }
          }}
        >
          <DrawerListItems
            customRooms={<CustomRooms />}
            handleDrawerToggle={handleDrawerToggle}
          />
        </SwipeableDrawer>
        <Drawer
          variant="permanent"
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "none", sm: "block" },
            width: drawerWidth,
            flexShrink: 0,
            height: "100px",
            borderRight: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              borderRight: 0,
              zIndex: 1000,
              height: "100vh",
              overflowY: "scroll",
              boxSizing: "border-box"
            }
          }}
          open
        >
          <DrawerListItems
            customRooms={<CustomRooms />}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Box
          sx={{
            py: {
              sm: 1,
              xs: 0.5
            }
          }}
        >
          {props.children}
          <Box sx={{ display: { sm: "none" } }}>
            <Toolbar />
          </Box>
        </Box>
        <FloatingActionButton />
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;

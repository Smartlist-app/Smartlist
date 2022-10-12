import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import BoringAvatar from "boring-avatars";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { colors } from "../../lib/colors";
import { ProfileMenu } from "../Layout/Profile";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";

/**
 * Returns the initials of a name
 * @param {any} fullName
 * @returns {any}
 */
export const getInitials = (fullName) => {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

/**
 * Navbar component for layout
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  const router = useRouter();
  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        transition: "background .1s",
        "& .MuiBadge-badge": {
          transition: "border .1s",
          transform: "none",
          border:
            router.asPath !== "/tidy"
              ? "2px solid #fff"
              : {
                  xs: `2px solid ${colors[themeColor][800]}`,
                  sm: `2px solid #fff`,
                },
          width: 12,
          height: 12,
          borderRadius: "50%",
        },
        color: {
          xs: global.user.darkMode
            ? "white"
            : router.asPath === "/tidy"
            ? colors[themeColor][100]
            : "black",
          sm: global.user.darkMode ? "white" : "black",
        },
        pr: 0.4,
        py: {
          sm: 1,
          xs: 0.9,
        },
        // transition: "all .2s",
        background: {
          xs: global.user.darkMode
            ? "rgba(0,0,0,0)"
            : router.asPath === "/tidy"
            ? colors[themeColor][800]
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode ? "rgba(0,0,0,0)" : "#fff",
        },
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            flexGrow: { xs: 1, sm: "unset" },
          }}
        >
          <InviteButton />
        </Box>
        <Box
          sx={{
            mx: { sm: "auto" },
          }}
        >
          <SearchPopup />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <AppsMenu />
        </Box>
        <ProfileMenu>
          <Tooltip
            title="My account"
            placement="bottom-start"
            PopperProps={{
              sx: { pointerEvents: "none" },
            }}
          >
            <IconButton
              color="inherit"
              disableRipple
              sx={{
                p: 0,
                ml: 0.6,
                color: global.user.darkMode ? "hsl(240, 11%, 90%)" : "#606060",
                "&:hover": {
                  background: "rgba(200,200,200,.3)",
                  color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                },
                "&:focus-within": {
                  background: `${
                    global.user.darkMode
                      ? colors[themeColor]["900"]
                      : colors[themeColor]["50"]
                  }!important`,
                  color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                },
                transition: "all .2s",
                "&:active": {
                  opacity: 0.5,
                  transform: "scale(0.95)",
                  transition: "none",
                },
              }}
            >
              <BoringAvatar
                size={35}
                name={global.user.name}
                variant="beam"
                colors={["#801245", "#F4F4DD", "#DCDBAF", "#5D5C49", "#3D3D34"]}
              />
            </IconButton>
          </Tooltip>
        </ProfileMenu>
      </Toolbar>
    </AppBar>
  );
}

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { colors } from "../../lib/colors";
import AddPopup from "../CreateItem";
import Settings from "../Settings/index";

export function Sidebar() {
  const router = useRouter();
  const styles = {
    borderRadius: 5,
    mb: 1,
    p: 2,
    transition: "none",
    "&:hover, &.active": {
      background: colors[themeColor]["50"] + "!important",
    },
    "& span": {
      display: "block",
      transition: "none",
      color: colors[themeColor]["A700"],
    },
    "&:active": {
      background: colors[themeColor]["100"] + "!important",
      transition: "none",
    },
  };

  return (
    <>
      <Drawer
        variant="permanent"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "none", md: "flex!important" },
          "& .MuiDrawer-paper": {
            maxWidth: "90px",
            width: "90px",
            zIndex: 1000,
            border: 0,
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        open
      >
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            pt: 10,
          }}
        >
          <Box sx={{ mt: "auto" }}></Box>
          <AddPopup>
            <Tooltip title="Create an item" placement="right">
              <IconButton
                disableRipple
                size="large"
                sx={{
                  ...styles,
                  background: `linear-gradient(15deg, ${colors[themeColor][200]}, ${colors[themeColor][700]}) !important`,
                  "&:hover, &:active": {
                    background: `linear-gradient(-15deg, ${colors[themeColor][200]}, ${colors[themeColor][700]}) !important`,
                  },
                  "& span": {
                    color: colors[themeColor][50],
                  },
                  mb: 2,
                }}
              >
                <span className="material-symbols-outlined">add</span>
              </IconButton>
            </Tooltip>
          </AddPopup>
          <Tooltip title="Tasks" placement="right">
            <IconButton
              disableRipple
              size="large"
              sx={styles}
              className={router.asPath === "/tasks" ? "active" : ""}
              onClick={() => router.push("/tasks")}
            >
              <span
                className={
                  router.pathname === "/tasks"
                    ? "material-symbols-rounded"
                    : "material-symbols-outlined"
                }
              >
                sticky_note_2
              </span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Items" placement="right">
            <IconButton
              disableRipple
              size="large"
              sx={styles}
              className={
                router.asPath === "/items" || router.asPath.includes("/rooms/")
                  ? "active"
                  : ""
              }
              onClick={() => router.push("/items")}
            >
              <span
                className={
                  router.asPath === "/items" ||
                  router.asPath.includes("/rooms/")
                    ? "material-symbols-rounded"
                    : "material-symbols-outlined"
                }
              >
                category
              </span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Explore" placement="right">
            <IconButton
              disableRipple
              size="large"
              sx={styles}
              className={router.asPath === "/explore" ? "active" : ""}
              onClick={() => router.push("//explore")}
            >
              <span
                className={
                  router.pathname === "/explore"
                    ? "material-symbols-rounded"
                    : "material-symbols-outlined"
                }
              >
                explore
              </span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Tidy" placement="right">
            <IconButton
              disableRipple
              size="large"
              sx={styles}
              className={router.asPath === "/tidy" ? "active" : ""}
              onClick={() => router.push("/tidy")}
            >
              <span
                className={
                  router.pathname === "/tidy"
                    ? "material-symbols-rounded"
                    : "material-symbols-outlined"
                }
              >
                auto_awesome
              </span>
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              mt: "auto",
              mb: 2,
            }}
          >
            <Settings>
              <Tooltip
                title={global.user.email}
                placement="left"
                PopperProps={{
                  sx: { pointerEvents: "none" },
                }}
              >
                <IconButton color="inherit" disableRipple sx={styles}>
                  <span className="material-symbols-outlined">settings</span>
                </IconButton>
              </Tooltip>
            </Settings>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

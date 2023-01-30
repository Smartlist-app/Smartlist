import { Box, Snackbar, useScrollTrigger } from "@mui/material";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import { colors } from "../../lib/colors";

/**
 * Bottom navigation bar
 * @returns {any}
 */
export function BottomNav() {
  const trigger = useScrollTrigger({ threshold: 0 });

  const iconStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    height: "35px",
    flex: "0 0 35px",
    width: "60px",
  };
  const styles = (active) => {
    return {
      textTransform: "none",
      color: global.user.darkMode ? "hsl(240,11%,90%)" : "#303030",
      height: "70px",
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        ...iconStyles,
      },
      fontWeight: "200",
      cursor: "pointer",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      fontSize: "14.5px",
      transition: "transform .2s",
      "&:active": {
        transform: "scale(.93)",
        transition: "none",
      },
      ...(active && {
        fontWeight: 700,
        color: `${
          colors[themeColor][global.user.darkMode ? 100 : 900]
        }!important`,
        "& .material-symbols-rounded, & .material-symbols-outlined": {
          ...iconStyles,
          background: `${
            global.user.darkMode
              ? "linear-gradient(120deg, hsl(240,11%,17%), hsl(240,11%,25%))"
              : hexToRgba(colors[themeColor][300], 0.5)
          }!important`,
        },
      }),
    };
  };

  const router = useRouter();

  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  return (
    <>
      <Snackbar
        open={!navigator.onLine}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{ mb: trigger ? 6.5 : 9, transition: "all .3s" }}
        message="You're offline. Please check your network connection."
      />
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: trigger ? -71 : 0,
          left: 0,
          transition: "bottom .3s",
          overflowX: "hidden",
          display: {
            xs: "flex",
            md: "none",
          },
          [`@media (max-height: 500px)`]: {
            display: "none",
          },
          zIndex: 999,
          height: "70px",
          userSelect: "none",
          "&, & *": {
            overflow: "hidden!important",
          },
          background: global.user.darkMode
            ? router.asPath == "/zen"
              ? "hsla(240,11%,10%,.9)"
              : "hsla(240, 11%, 10%, .9)"
            : "rgba(255,255,255,.4)",
          borderTop: global.user.darkMode
            ? router.asPath == "/zen"
              ? "1px solid hsla(240,11%,20%,1)"
              : "1px solid hsla(240, 11%, 20%, .8)"
            : global.user.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          backdropFilter: "blur(10px)",
          alignItems: "center",
        }}
      >
        <Box
          onClick={() => router.push("/zen")}
          onMouseDown={() => router.push("/zen")}
          sx={styles(
            router.asPath === "/" ||
              router.asPath === "" ||
              router.asPath.includes("/zen")
          )}
        >
          <span
            className={`material-symbols-${
              router.asPath === "/" ||
              router.asPath === "" ||
              router.asPath.includes("/zen")
                ? "rounded"
                : "outlined"
            }`}
          >
            change_history
          </span>
          Start
        </Box>
        <Box
          onClick={() => router.push("/tasks")}
          onMouseDown={() => router.push("/tasks")}
          sx={styles(router.asPath.includes("/tasks"))}
        >
          <span
            className={`material-symbols-${
              router.asPath.includes("/tasks") ? "rounded" : "outlined"
            }`}
          >
            circle
          </span>
          Lists
        </Box>
        <Box
          sx={styles(router.asPath === "/coach")}
          onDoubleClick={() => {
            router.push("/coach").then(() => {
              setTimeout(() => {
                document.getElementById("routineTrigger")?.click();
              }, 500);
            });
          }}
          onContextMenu={() => {
            router.push("/coach").then(() => {
              setTimeout(() => {
                document.getElementById("routineTrigger")?.click();
              }, 500);
            });
          }}
          onClick={() => router.push("/coach")}
          onMouseDown={() => router.push("/coach")}
        >
          <span
            className={`material-symbols-${
              router.asPath === "/coach" ? "rounded" : "outlined"
            }`}
          >
            favorite
          </span>
          Coach
        </Box>

        <Box
          sx={styles(
            router.asPath === "/items" || router.asPath.includes("rooms")
          )}
          onClick={() => router.push("/items")}
          onMouseDown={() => router.push("/items")}
        >
          <span
            className={`material-symbols-${
              router.asPath === "/items" || router.asPath.includes("rooms")
                ? "rounded"
                : "outlined"
            }`}
          >
            crop_square
          </span>
          Items
        </Box>
      </Box>
    </>
  );
}

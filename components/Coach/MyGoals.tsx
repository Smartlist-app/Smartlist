import Masonry from "@mui/lab/Masonry";
import { AppBar, Divider, IconButton, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../error";
import { ExploreGoals } from "./ExploreGoals";
import Toolbar from "@mui/material/Toolbar";

function Goal({ goal }: any) {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute("content", open ? colors[themeColor][900] : "#fff");
  });
  return (
    <>
      <CardActionArea
        className="w-full transition-transform active:scale-[.98] mb-2"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 5,
          px: 2,
          py: 1,
          "& *": {
            transition: "none!important",
          },
        }}
      >
        <Typography className="font-semibold" variant="h6">
          {goal.name}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {goal.time == "any"
            ? "Daily"
            : goal.time == "morning"
            ? "Every morning"
            : goal.time == "afternoon"
            ? "Every afternoon"
            : "Nightly"}{" "}
          &bull; {goal.durationDays - goal.progress} days left
        </Typography>
        <div className="flex gap-3 items-center">
          <Slider
            value={goal.progress}
            max={goal.durationDays}
            step={1}
            marks
            sx={{
              pointerEvents: "none",
              "& .MuiSlider-thumb": {
                height: 0,
                width: 7,
              },
              "& .MuiSlider-track": {
                height: 12,
                overflow: "hidden",
              },
              "& .MuiSlider-rail": {
                height: 12,
                overflow: "hidden",
              },
              "& .MuiSlider-mark": {
                width: { xs: 0, sm: 2 },
                height: 6,
                borderRadius: 5,
              },
            }}
            // valueLabelDisplay="on"
          />
          <span className="material-symbols-rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </CardActionArea>

      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100vw",
          },
        }}
      >
        <AppBar
          elevation={0}
          sx={{
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>Goal</Typography>
            <IconButton color="inherit" disableRipple>
              <span className="material-symbols-rounded">more_horiz</span>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: "-70px",
            background: `linear-gradient(45deg, ${colors[themeColor]["600"]}, ${colors[themeColor]["500"]})`,
            height: "400px",
            color: colors[themeColor][50],
            p: 5,
          }}
          className="flex"
        >
          <Box sx={{ mt: "auto" }}>
            <Chip
              label={goal.category}
              sx={{
                mb: 1,
                color: "#fff",
                background: "rgba(255,255,255,.1)",
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: "900" }}>
              {goal.name}
            </Typography>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
export function MyGoals(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);
  const { data, error } = useApi("user/routines");

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          className:
            "w-full h-[80vh] rounded-t-2xl p-10 px-5 overflow-y-auto sm:rounded-2xl sm:max-w-[90vw] sm:mx-auto shadow-none sm:mb-10",
          sx: {
            height: "90vh",
          },
        }}
      >
        <ExploreGoals />
      </SwipeableDrawer>

      {data ? (
        <>
          <Typography
            className="text-center sm:text-left font-semibold my-6 mt-14"
            variant="h5"
          >
            My goals
          </Typography>
          {data.length == 0 ? (
            <div className="text-gray-900 w-full bg-gray-200 rounded-xl p-3 px-5 mb-4">
              You haven&apos;t created any goals yet.
            </div>
          ) : (
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={0}>
              {[
                ...data.filter((item) => item.tasks === item.completed),
                ...data.filter((item) => item.tasks !== item.completed),
              ].map((goal) => (
                <Goal goal={goal} />
              ))}
            </Masonry>
          )}
        </>
      ) : error ? (
        <ErrorHandler error="An error occured while trying to fetch your routines" />
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          animation="wave"
          sx={{ borderRadius: 5 }}
        />
      )}
      <Divider sx={{ mt: 3 }} />
      <div
        onClick={() => setOpen(true)}
        className="w-full p-4 rounded-2xl flex items-center select-none cursor-pointer active:scale-[.98] transition-transform active:transition-[0s] my-3"
        style={{
          color: colors[themeColor][900],
        }}
      >
        <div>
          <h3 className="font-secondary font-bold">Set a goal</h3>
          <h4 className="font-sm font-light">
            Set a goal to get started with your routine
          </h4>
        </div>
        <span className="material-symbols-rounded ml-auto">add</span>
      </div>
    </>
  );
}

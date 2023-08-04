import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { GroupModal } from "../components/Group/GroupModal";

function StatusSelector({ mutationUrl }) {
  const session = useSession();
  const now = useMemo(() => dayjs(), []);

  const { data, url } = useApi("user/status");

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(
    data?.status && data?.until && dayjs(data?.until).isAfter(now)
      ? data?.status
      : ""
  );
  const [time, setTime] = useState(60);

  const handleStatusSelect = (status: string) => () => setStatus(status);
  const handleTimeSelect = (time: number) => () => setTime(time);

  const handleSubmit = async () => {
    await fetchRawApi(session, "user/status/set", {
      status,
      start: new Date().toISOString(),
      until: time,
    });
    setOpen(false);
    toast.success(
      "Status set until " + dayjs().add(time, "minute").format("h:mm A"),
      toastStyles
    );
    mutate(url);
    mutate(mutationUrl);
  };
  const resetStatus = useCallback(
    () =>
      setStatus(
        data?.status && data?.until && dayjs(data?.until).isAfter(now)
          ? data?.status
          : ""
      ),
    [data, now]
  );

  useEffect(() => {
    if (data) {
      resetStatus();
    }
  }, [data, resetStatus]);

  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));

  const chipPalette =
    status === "available"
      ? greenPalette
      : status === "busy"
      ? redPalette
      : status === "away"
      ? orangePalette
      : grayPalette;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        sx={{
          px: 2,
          mb: 2,
          mt: -2,
          mx: { sm: "auto" },
          "&, &:hover": {
            background: `linear-gradient(${chipPalette[9]}, ${chipPalette[8]}) !important`,
            color: `${chipPalette[12]} !important`,
          },
        }}
        variant="contained"
        size="large"
      >
        <Icon className="outlined">
          {status === "available"
            ? "check_circle"
            : status === "busy"
            ? "remove_circle"
            : status === "away"
            ? "dark_mode"
            : "circle"}
        </Icon>
        {status ? capitalizeFirstLetter(status) : "Set status"}
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          resetStatus();
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Puller showOnDesktop />
          <Typography variant="h6" sx={{ mb: 1, px: 2 }}>
            Set status
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
            {["available", "busy", "away", "offline"].map((_status) => (
              <Button
                key={_status}
                onClick={handleStatusSelect(_status)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_status === status ? "contained" : "outlined"}
                size="large"
              >
                {_status === status && <Icon>check</Icon>}
                {capitalizeFirstLetter(_status)}
              </Button>
            ))}
          </Box>
          <Typography variant="h6" sx={{ mb: 1, mt: 4, px: 2 }}>
            Clear after...
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
            {[60, 120, 240, 1440].map((_time) => (
              <Button
                key={_time}
                onClick={handleTimeSelect(_time)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_time === time ? "contained" : "outlined"}
                size="large"
              >
                {_time === time && <Icon>check</Icon>}
                {_time / 60} hours
              </Button>
            ))}
          </Box>
          <Box sx={{ px: 2 }}>
            <Button
              onClick={handleSubmit}
              sx={{ px: 2, mb: 2, mx: "auto", mt: 2 }}
              variant="contained"
              fullWidth
              size="large"
              disabled={!status || !time}
            >
              Done
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

const Friend = memo(function Friend({ friend }: any) {
  const session = useSession();
  const router = useRouter();

  const palette = useColor(friend.color, useDarkMode(session.darkMode));
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));

  const chipPalette =
    friend?.Status?.status === "available"
      ? greenPalette
      : friend?.Status?.status === "busy"
      ? redPalette
      : friend?.Status?.status === "away"
      ? orangePalette
      : grayPalette;

  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItemButton onClick={() => setOpen(true)}>
        <Box sx={{ position: "relative" }}>
          <ProfilePicture data={friend} mutationUrl="" size={60} />
          <Box
            sx={{
              position: "absolute",
              bottom: "-5px",
              textTransform: "capitalize",
              right: "-10px",
              borderRadius: 999,
              fontSize: "10px",
              px: 1,
              py: 0.1,
              background: `linear-gradient(${chipPalette[9]}, ${chipPalette[8]}) !important`,
            }}
          >
            {friend?.Status?.status ?? "Away"}
          </Box>
        </Box>
        <ListItemText
          primary={friend.name}
          secondary={
            friend?.Status &&
            "Until " + dayjs(friend?.Status?.until).format("h:mm A")
          }
          sx={{ ml: 1 }}
        />
        <IconButton>
          <Icon>arrow_forward_ios</Icon>
        </IconButton>
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{ sx: { background: palette[1] } }}
      >
        <Box
          sx={{
            background: `linear-gradient(${palette[11]}, ${palette[9]})`,
            height: "100px",
            overflow: "visible",
          }}
        >
          <Box sx={{ mt: 5, ml: 3 }}>
            <ProfilePicture data={friend} mutationUrl="" size={100} />
          </Box>
        </Box>
        <Box sx={{ p: 4, mt: 2 }}>
          <Typography variant="h3" className="font-heading" sx={{ mt: 1 }}>
            {friend.name}
          </Typography>
          <Typography variant="body2" sx={{}}>
            {friend.username && "@"}
            {friend.username || friend.email}
          </Typography>
          <Chip
            sx={{
              background: `linear-gradient(${chipPalette[9]}, ${chipPalette[8]}) !important`,
              mt: 1,
            }}
            label={capitalizeFirstLetter(friend?.Status?.status ?? "Away")}
          />
          <Button
            onClick={() =>
              router.push(`/users/${friend.username || friend.email}`)
            }
            fullWidth
            sx={{
              "&, &:hover": {
                background: palette[2],
                color: palette[11],
              },
              mt: 2,
            }}
          >
            View full profile
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
});

export function Logo({ intensity = 4, size = 45 }: any) {
  const session = useSession();

  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      version="1"
      viewBox="0 0 375 375"
      fill={palette[intensity]}
    >
      <defs>
        <clipPath id="963808ace8">
          <path d="M37.5 37.5h300.75v300.75H37.5zm0 0"></path>
        </clipPath>
        <clipPath id="f8e32d0f6d">
          <path
            d="M187.875 37.5c0 83.05 67.324 150.375 150.375 150.375-83.05 0-150.375 67.324-150.375 150.375 0-83.05-67.324-150.375-150.375-150.375 83.05 0 150.375-67.324 150.375-150.375zm0 0"
            clipRule="evenodd"
          ></path>
        </clipPath>
      </defs>
      <g clipPath="url(#963808ace8)">
        <g clipPath="url(#f8e32d0f6d)">
          <path d="M338.25 37.5H37.5v300.75h300.75zm0 0"></path>
        </g>
      </g>
    </svg>
  );
}

export function Navbar({
  showLogo = false,
  right,
  showRightContent = false,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
}) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
      }}
    >
      <Logo />
      {right}
      {(!right || showRightContent) && (
        <>
          <IconButton
            sx={{
              ml: showRightContent ? "" : "auto",
              color: palette[8],
              "&:active": { transform: "scale(.9)" },
              transition: "all .4s",
            }}
            onClick={openSpotlight}
          >
            <Icon className="outlined">search</Icon>
          </IconButton>
          <GroupModal list>
            <IconButton
              sx={{
                color: palette[8],
                "&:active": { transform: "scale(.9)" },
                transition: "all .4s",
              }}
              onClick={() =>
                router.push("/groups/" + session?.property?.propertyId)
              }
            >
              <Icon className="outlined">tag</Icon>
            </IconButton>
          </GroupModal>
        </>
      )}
    </Box>
  );
}

const HeadingComponent = ({ palette, isMobile }) => {
  const [isHover, setIsHover] = useState(false);
  const time = new Date().getHours();

  const open = () => {
    vibrate(50);
    setIsHover(true);
  };
  const close = () => {
    vibrate(50);
    setIsHover(false);
  };

  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  useEffect(() => {
    if (isHover) {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
      const interval = setInterval(() => {
        setCurrentTime(dayjs().format("hh:mm:ss A"));
      });
      return () => clearInterval(interval);
    }
  }, [isHover]);

  const getGreeting = useMemo(() => {
    if (time < 12) return "Good morning.";
    else if (time < 17) return "Good afternoon.";
    else if (time < 20) return "Good evening.";
    else return "Good night.";
  }, [time]);

  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  });

  return (
    <Typography
      className="font-heading"
      {...(isMobile
        ? {
            onTouchStart: open,
            onTouchEnd: close,
          }
        : {
            onMouseEnter: open,
            onMouseLeave: close,
          })}
      sx={{
        fontSize: {
          xs: "15vw",
          sm: "80px",
        },
        background: `linear-gradient(${palette[11]}, ${palette[5]})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        userSelect: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      variant="h4"
    >
      {isHover ? currentTime : greeting}
    </Typography>
  );
};

function SearchFriend({ mutationUrl }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const addFriend = async () => {
    try {
      const data = await fetchRawApi(session, "user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: query,
      });
      console.log(data);
      if (!data?.success) throw new Error();
      toast.success("Added friend!", toastStyles);
      setOpen(false);
      mutate(mutationUrl);
    } catch (e) {
      toast.error(
        "Hmm... That didn't work. Make sure you typed the email or username correctly.",
        toastStyles
      );
    }
  };

  return (
    <>
      <ListItemButton onClick={() => setOpen(true)}>
        <Avatar sx={{ background: palette[2], color: palette[11] }}>
          <Icon>add</Icon>
        </Avatar>
        <ListItemText primary="Add friend..." />
      </ListItemButton>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Email or username..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>alternate_email</Icon>
                </InputAdornment>
              ),
            }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            onClick={addFriend}
          >
            Add
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default function Home() {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { data, url } = useApi("user/profile/friends", {
    email: session.user.email,
    date: dayjs().startOf("day").toISOString(),
  });

  const { data: coachData } = useApi("user/coach");

  const completedGoals = (coachData || [])
    .filter((goal) => !goal.completed)
    .filter(
      (goal) =>
        dayjs(goal.lastCompleted).format("YYYY-MM-DD") ==
        dayjs().format("YYYY-MM-DD")
    );

  return (
    <Box sx={{ ml: { sm: -1 } }}>
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }}>
        {isMobile && <Navbar showLogo />}
      </motion.div>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <Box
          sx={{
            pt: { xs: 7, sm: 23 },
          }}
        >
          <Box
            sx={{
              mb: { xs: 3, sm: 5 },
              px: { xs: 4, sm: 6 },
              textAlign: { sm: "center" },
            }}
          >
            <HeadingComponent palette={palette} isMobile={isMobile} />
            <Typography
              sx={{ fontWeight: 700, color: palette[8] }}
              variant="h6"
            >
              {dayjs().format("MMMM D")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "500px",
            maxWidth: "calc(100% - 40px)",
            mx: "auto",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <StatusSelector mutationUrl={url} />

          {/* <DailyCheckIn /> */}
          {data &&
            data.friends
              .sort(({ following: friend }) => {
                if (friend?.Status?.status) return -1;
                else return 1;
              })
              .map(({ following: friend }) => (
                <Friend friend={friend} key={friend.email} />
              ))}
          <SearchFriend mutationUrl={url} />
        </Box>
        <Toolbar />
      </motion.div>
    </Box>
  );
}

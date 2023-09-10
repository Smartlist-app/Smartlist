import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  Skeleton,
  TextField,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import RoomLayout from ".";

export default function Page() {
  const webcamRef: any = useRef(null);
  const session = useSession();
  const router = useRouter();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const { width, height } = useWindowDimensions();
  const [taken, setTaken] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const titleRef: any = useRef<HTMLInputElement>();

  const [frontCamera, setFrontCamera] = useState(true);

  const handleCapture = async () => {
    titleRef.current.value = "";
    setTaken(true);
    setLoading(true);
    const imageUrl = await webcamRef.current.getScreenshot();
    const res = await fetch(`/api/property/inventory/items/scan`, {
      method: "POST",
      body: JSON.stringify({
        imageUrl,
      }),
    }).then((res) => res.json());
    if (res?.error?.includes("loading")) {
      toast.error(
        "We're loading our model for you. Please wait about " +
          res.estimated_time +
          " seconds and try again.",
        toastStyles
      );
      setLoading(false);
      setTaken(false);
      return;
    }

    titleRef.current.value = capitalizeFirstLetter(
      res?.[0]?.label?.split(", ")?.[0]
    );
    setLoading(false);

    // each res.label can have commas. map it and flatten it
    const res2 = res.map((r) => r.label.split(", ")).flat();
    setResults(res2);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setTaken(false);
    }, 500);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  return (
    <RoomLayout>
      <Box
        sx={{
          display: "flex",
          height: "100dvh",
          width: "100dvw",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            "& video": {
              width: "100dvw",
              height: "100%",
              objectFit: "cover",
              transition: "blur .2s ease, transform 0s",
              ...(taken && {
                transition: "all .2s ease",
                filter: "blur(30px)",
                transform: "scale(1.2)",
              }),
            },
          }}
        >
          <Webcam
            audio={false}
            height={height}
            width={width}
            ref={webcamRef}
            screenshotFormat="image/png"
            // screenshotQuality={0.5}
            videoConstraints={{
              facingMode: frontCamera ? "user" : "environment",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            height: "100dvh",
            zIndex: 9999,
            width: "100%",
            left: 0,
            bottom: 0,
            opacity: taken ? 1 : 0,
            pointerEvents: taken ? "all" : "none",
            transition: "all .3s ease",
            p: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: addHslAlpha(palette[2], 0.3),
            ...(submitted && {
              borderRadius: 5,
              animation: "submit .5s forwards",
            }),
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => setTaken(false)}
              sx={{
                background: addHslAlpha(palette[9], 0.1) + "!important",
                color: palette[11] + "!important",
              }}
            >
              <Icon>close</Icon>
            </IconButton>
            <Box sx={{ position: "relative", width: "100%" }}>
              <TextField
                inputRef={titleRef}
                inputProps={{
                  autoComplete: "off",
                }}
                disabled={loading}
                placeholder={loading ? "" : "Item name"}
              />
              {loading && (
                <Skeleton
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 15,
                    transition: "all .2s ease",
                  }}
                  height={50}
                  width={130}
                  animation="wave"
                />
              )}
            </Box>
            <IconButton
              onClick={handleSubmit}
              sx={{
                background: addHslAlpha(palette[9], 0.9) + "!important",
                color: palette[1] + "!important",
              }}
              disabled={loading}
            >
              <Icon>{loading ? <CircularProgress /> : "north"}</Icon>
            </IconButton>
          </Box>
          <Box
            sx={{
              overflowX: "scroll",
              display: "flex",
              maxWidth: "100vw",
              px: 5,
              gap: 2,
              mt: 2,
              height: "50px",
            }}
          >
            {results &&
              results.map((result) => (
                <Chip
                  sx={{
                    background: addHslAlpha(palette[5], 0.4) + "!important",
                  }}
                  label={capitalizeFirstLetter(result.trim())}
                  key={result}
                  onClick={() =>
                    (titleRef.current.value = capitalizeFirstLetter(
                      result.trim()
                    ))
                  }
                />
              ))}
          </Box>
          <TextField
            label="Quantity"
            size="small"
            placeholder="Add quantity"
            defaultValue={1}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Note"
            size="small"
            placeholder="Add note"
            sx={{ mt: 2 }}
            minRows={3}
            multiline
          />
          <TextField
            label="Tags"
            size="small"
            placeholder="Add tags..."
            sx={{ mt: 2 }}
          />
        </Box>
      </Box>
      {!taken && (
        <AppBar
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "transparent",
            border: 0,
            backdropFilter: "none",
          }}
        >
          <Toolbar>
            <IconButton onClick={() => router.push("/")}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => setFrontCamera((c) => !c)}
            >
              <Icon {...(!frontCamera && { className: "outlined" })}>
                flip_camera_ios
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box
        sx={{
          opacity: taken ? 0 : 1,
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "5px solid #fff",
          transition: "all .2s ease",
          width: 70,
          zIndex: 999999,
          height: 70,
          borderRadius: "100%",
          "&:active": {
            transform: "translateX(-50%) scale(0.9)",
          },
          ...(taken && {
            pointerEvents: "none",
          }),
        }}
        onClick={handleCapture}
      />
    </RoomLayout>
  );
}
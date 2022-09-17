import Box from "@mui/material/Box";

/**
 * Top-level component for the notification settings page.
 */
export default function Notifications() {
  return (
    <Box
      sx={{
        display: "flex",
        mt: -5,
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        px: 10,
      }}
    >
      <div className="onesignal-customlink-container" />
    </Box>
  );
}

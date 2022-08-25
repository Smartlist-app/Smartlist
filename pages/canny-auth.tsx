import Box from "@mui/material/Box";
import useSWR from "swr";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Head from "next/head";

function RenderData({ data }) {
  const url =
    "https://canny.io/api/redirects/sso?companyID=6306f3586e9c6244c28c1d1e&ssoToken=" +
    encodeURIComponent(data) +
    "&redirect=https://feedback.smartlist.tech/";
  window.location.href = url;
  return <></>;
}

export default function CannyAuth() {
  const url = "/api/canny-auth";
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.text())
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        background: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          background: "rgba(255,255,255,.1)",
          color: "#fff",
          p: 3,
          borderRadius: 4,
          width: "auto",
          maxWidth: "calc(100vw - 20px)",
        }}
      >
        <Head>
          <meta name="theme-color" content="#000" />
        </Head>
        <CircularProgress size="20px" color="inherit" />
        <Typography>Redirecting you to the feedback center</Typography>
        {error && "An error occured, please try again later..."}
        {data && <RenderData data={data} />}
      </Box>
    </Box>
  );
}

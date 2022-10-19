import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { colors } from "../lib/colors";
import Container from "@mui/material/Container";
import Head from "next/head";
import { useState } from "react";
import { Lists } from "../components/home/Lists";
import { RecentItems } from "../components/home/RecentItems";
import { Recipes } from "../components/home/Recipes";
import { Tips } from "../components/home/Tips";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const styles = {
    userSelect: "none",
    cursor: "pointer",
    mr: 1,
    px: 0.7,
    transition: "all .1s!important",
    fontWeight: "500",
    boxShadow: "none!important",
  };
  const activeTabStyles = {
    background: `${colors[themeColor]["A100"]} !important`,
    color: "#000",
  };
  const [activeTab, setActiveTab] = useState("lists");

  return (
    <>
      <Head>
        <title>
          Dashboard &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ pb: 3 }}>
          {["Recent", "Lists", "Planner", "Recipes"].map((item) => (
            <Chip
              key={item}
              label={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              sx={{
                ...styles,
                ...(activeTab === item.toLowerCase() && activeTabStyles),
              }}
            />
          ))}
        </Box>
        {activeTab === "lists" && <Lists />}
        {activeTab === "recent" && <RecentItems />}
        {activeTab === "planner" && <Tips />}
        {activeTab === "recipes" && <Recipes />}
      </Container>
    </>
  );
}

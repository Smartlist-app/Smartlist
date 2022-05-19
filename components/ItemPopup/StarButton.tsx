import React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { orange } from "@mui/material/colors";

export function StarButton({ setLastUpdated, id, star, setStar }: any) {
  return (
    <Tooltip title={star === 0 ? "Star" : "Unstar"}>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{
          mr: 1,
          transition: "none",
          color: "#404040",
          "&:hover": { color: "#000" },
          ...(parseInt(star, 10) === 1 && {
            "&:hover": {
              background: global.theme === "dark" ? orange[900] : orange[50]
            }
          })
        }}
        onClick={() => {
          setLastUpdated(dayjs().format("YYYY-MM-DD HH:mm:ss"));
          setStar((s: number) => {
            fetch("https://api.smartlist.tech/v2/items/star/", {
              method: "POST",
              body: new URLSearchParams({
                token: global.session && global.session.accessToken,
                id: id.toString(),
                date: dayjs().format("YYYY-MM-DD HH:mm:ss")
              })
            });
            return +!s;
          });
        }}
      >
        {star === 1 ? (
          <span
            className="material-symbols-rounded"
            style={{
              color: global.theme === "dark" ? orange[200] : orange[600]
            }}
          >
            star_border
          </span>
        ) : (
          <StarBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  );
}

import type { Item } from "@prisma/client";
import React from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";

import { Box, Button, Icon, Menu, MenuItem, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useHotkeys } from "react-hotkeys-hook";
import { useSession } from "../../pages/_app";

/**
 * Search bar
 */
function SearchBar({
  setItems,
  data,
}: {
  setItems: (items: Item[]) => void;
  data: Item[];
}) {
  /**
   * Handles blur event
   */
  const handleBlurEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.code === "Enter") target.blur();
    if (e.code === "Escape") {
      target.value = "";
      target.blur();
    }
  };
  const session = useSession();

  return (
    <Button
      id="basic-button"
      disableRipple
      sx={{
        backgroundColor: session.user.darkMode
          ? "hsl(240,11%,15%)!important"
          : `${grey[200]}!important`,
        borderRadius: 10,
        border: "1px solid transparent",
        mt: { xs: 1, sm: 0 },
        width: "100%",
        textAlign: "left",
        color: `${grey[600]}!important`,
        "&:focus-within": {
          background: session.user.darkMode
            ? "hsl(240,11%,10%)!important"
            : "#fff!important",
          "&, & .MuiInput-root *": {
            cursor: "text",
          },
          border: session.user.darkMode
            ? "1px solid hsl(240,11%,60%)"
            : "1px solid rgba(0,0,0,.5)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        textTransform: "none",
        justifyContent: "start",
        px: 2,
        pt: 1,
        "& *": {
          pointerEvents: "none",
        },
        "& *:focus": {
          pointerEvents: "unset!important",
        },
        verticalAlign: "middle",
      }}
      onClick={() => {
        document.getElementById("outlined-size-small")?.focus();
      }}
      onMouseDown={() => {
        document.getElementById("outlined-size-small")?.focus();
      }}
    >
      <Icon>search</Icon>
      <TextField
        placeholder="Search for an item..."
        id="outlined-size-small"
        onKeyDown={handleBlurEvent}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (value === "") {
            setItems(data);
            return;
          }
          setItems([]);
          setTimeout(() => {
            setItems(
              data.filter(
                (item) =>
                  item.name.toLowerCase().includes(value.toLowerCase()) ||
                  item.quantity.toLowerCase().includes(value.toLowerCase()) ||
                  JSON.parse(item.category)
                    .join(",")
                    .toLowerCase()
                    .includes(value.toLowerCase())
              )
            );
          }, 50);
        }}
        size="small"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            border: "0!important",
            mr: 0.5,
            width: "100%",
            background: "transparent!important",
          },
        }}
      />
    </Button>
  );
}

/**
 * Toolbar for a room
 * @param {any} {alias
 * @param {any} room
 * @param {any} items
 * @param {any} setItems
 * @param {any} data}
 * @returns {any}
 */
export function Toolbar({
  items,
  setItems,
  data,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
  data: Item[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Handles the click for the filter menu
   * @param {React.MouseEvent<HTMLButtonElement>} event
   * @returns {any}
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });
  const ref: any = React.useRef();
  useHotkeys(
    "s",
    (e) => {
      e.preventDefault();
      ref.current?.click();
    },
    [ref]
  );
  const session = useSession();

  return (
    <Box
      sx={{
        textAlign: "right",
        my: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <SearchBar setItems={setItems} data={data} />
      <Button
        disableRipple
        id="basic-button"
        variant="contained"
        ref={ref}
        sx={{
          background:
            (session.user.darkMode ? "hsl(240,11%,20%)" : "hsl(240,11%,90%)") +
            "!important",
          "&:hover": {
            background:
              (session.user.darkMode
                ? "hsl(240,11%,20%)"
                : "hsl(240,11%,90%)") + "!important",
            color: session.user.darkMode ? "#fff" : "#000",
          },
          color: session.user.darkMode ? "#aaa" : "#707070",
          borderRadius: 10,
          ml: 1,
          mt: { xs: 1, sm: 0 },
          py: 1.3,
          px: 1,
          gap: 1.5,
          verticalAlign: "middle",
        }}
        onClick={handleClick}
      >
        <Icon className="outlined">filter_list</Icon>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(items.sort((a, b) => a.name.localeCompare(b.name))),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) => a.name.localeCompare(b.name)).reverse()
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) => a.quantity.localeCompare(b.quantity))
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Quantity
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items
                    .sort((a, b) =>
                      a.lastModified
                        .toString()
                        .localeCompare(b.lastModified.toString())
                    )
                    .reverse()
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) =>
                    a.lastModified
                      .toString()
                      .localeCompare(b.lastModified.toString())
                  )
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Oldest to newest
        </MenuItem>
      </Menu>
    </Box>
  );
}

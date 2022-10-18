import { SwipeableDrawer } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";

/**
 * Product list
 * @returns {any}
 */
function Products() {
  const apps = [
    {
      key: 1,
      href: "//my.smartlist.tech",
      label: "Carbon",
      description: "Next-gen personal home inventory",
    },
    {
      key: 2,
      label: "Availability",
      href: "//availability.smartlist.tech",
      description:
        "Find the best time for a group to get together (Coming soon!)",
    },
  ];

  const [expanded, setExpanded] = React.useState(1);

  /**
   * @param {any} panel
   * @returns {any}
   */
  const handleChange = (panel: number) => {
    setExpanded(panel);
  };

  return (
    <div
      onMouseLeave={() => {
        handleChange(1);
      }}
      onBlur={() => {
        handleChange(1);
      }}
    >
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={{
            boxShadow: "none!important",
            margin: "0!important",
            borderRadius: "9px",
            cursor: "pointer",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background: colors[global.themeColor][100],
              // category.bg ??
              // (global.user.darkMode
              //   ? "hsl(240, 11%, 40%)"
              //   : colors[global.themeColor][200]),
            },
            transition: "all .2s",
            "&:before": {
              display: "none",
            },
            "& .MuiAccordionDetails-root": {
              opacity: 0,
              transform: "scale(.95)",
              transition: "all .3s",
            },
            "&:hover .MuiAccordionDetails-root, &.Mui-expanded .MuiAccordionDetails-root":
              {
                opacity: 1,
                transform: "scale(1)",
              },
          }}
          expanded={expanded === category.key}
          onMouseOver={() => handleChange(category.key)}
          onClick={() => category.href !== "" && window.open(category.href)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: global.user.darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[global.themeColor][900],
            }}
          >
            {category.label}
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: global.user.darkMode
                  ? "hsl(240, 11%, 80%)"
                  : colors[global.themeColor][700],
              }}
            >
              {category.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

function Apps() {
  const apps = [
    {
      key: 1,
      label: "Windows",
    },
    {
      key: 2,
      label: "Android",
    },
    {
      key: 3,
      label: "iOS",
    },
    {
      key: 4,
      label: "Web",
    },
    // {
    //   key: 5,
    //   bg: green[global.user.darkMode ? 900 : 200],
    //   href: "https://feedback.smartlist.tech/",
    //   target: "_blank",
    //   label: (
    //     <>
    //       <span
    //         className="material-symbols-outlined"
    //         style={{ marginRight: "10px" }}
    //       >
    //         lightbulb
    //       </span>
    //       Suggest an app
    //     </>
    //   ),
    //   description: (
    //     <div style={{ color: green[global.user.darkMode ? 300 : 700] }}>
    //       Have any ideas for apps? Let us know!
    //     </div>
    //   ),
    // },
  ];

  const [expanded, setExpanded] = React.useState(0);

  /**
   * @param {any} panel
   * @returns {any}
   */
  const handleChange = (panel: number) => {
    setExpanded(panel);
  };

  return (
    <div
      onMouseLeave={() => {
        handleChange(4);
      }}
      onBlur={() => {
        handleChange(4);
      }}
    >
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={{
            boxShadow: "none!important",
            margin: "0!important",
            borderRadius: "9px",
            cursor: "pointer",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background: colors[global.themeColor][100],
              // category.bg ??
              // (global.user.darkMode
              //   ? "hsl(240, 11%, 40%)"
              //   : colors[global.themeColor][200]),
            },
            transition: "all .2s",
            "&:before": {
              display: "none",
            },
            "& .MuiAccordionDetails-root": {
              opacity: 0,
              transform: "scale(.95)",
              transition: "all .3s",
            },
            "&:hover .MuiAccordionDetails-root, &.Mui-expanded .MuiAccordionDetails-root":
              {
                opacity: 1,
                transform: "scale(1)",
              },
          }}
          expanded={expanded === category.key}
          onMouseOver={() => handleChange(category.key)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: global.user.darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[global.themeColor][900],
            }}
          >
            {category.label}
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: "200px",
                color: global.user.darkMode
                  ? "hsl(240, 11%, 80%)"
                  : colors[global.themeColor][700],
              }}
            >
              {category.label === "Web" ? (
                <>You&apos;re using Carbon for Web</>
              ) : (
                <>
                  Download Carbon for {category.label} for extra features such
                  as push notifications, assistant, and more!
                </>
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

/**
 * Apps menu
 * @returns {any}
 */
export function AppsMenu() {
  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Handles app menu trigger
   * @param {React.MouseEvent<HTMLElement>} event
   * @returns {any}
   */
  const handleClick = () => setOpen(true);
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });

  return (
    <div>
      <Tooltip title="Apps">
        {global.user ? (
          <IconButton
            color="inherit"
            disableRipple
            sx={{
              borderRadius: 94,
              mr: 1,
              color: global.user.darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[themeColor][900],
              transition: "all .2s",
              "&:active": {
                opacity: 0.5,
                transform: "scale(0.95)",
                transition: "none",
              },
            }}
            onClick={handleClick}
          >
            <span className="material-symbols-rounded">apps</span>
          </IconButton>
        ) : (
          <Skeleton
            sx={{ mr: 2 }}
            variant="circular"
            width={40}
            height={40}
            animation="wave"
          />
        )}
      </Tooltip>
      <SwipeableDrawer
        disableSwipeToOpen
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="right"
        PaperProps={{
          elevation: 0,
          sx: {
            width: "300px",
            m: 2,
            borderRadius: 5,
            height: "auto",
            background: global.user.darkMode
              ? "hsl(240, 11%, 20%)"
              : colors[global.themeColor][50],
            color: global.user.darkMode
              ? "hsl(240, 11%, 90%)"
              : colors[global.themeColor][900],
          },
        }}
        open={open}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Workspace
          </Typography>
          <Products />
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Download the apps!
          </Typography>
          <Apps />
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

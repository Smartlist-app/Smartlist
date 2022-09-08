import emailjs from "@emailjs/browser";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";
import useSWR from "swr";
import { Puller } from "../Puller";

function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function AddPersonModal() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [permission, setpermission] = React.useState("member");

  const handleChange = (event: SelectChangeEvent) => {
    setpermission(event.target.value as string);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        disabled={global.property.permission !== "owner"}
        sx={{
          mb: 2,
          borderRadius: 4,
          ml: "auto",
          boxShadow: 0,
        }}
      >
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          add
        </span>
        Add person
      </Button>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        onClose={() => setOpen(false)}
        anchor="bottom"
        swipeAreaWidth={0}
      >
        <Puller />
        <Box sx={{ p: 4 }}>
          <Typography variant="h5">Invite a person</Typography>
          <Box
            sx={{
              fontSize: "15px",
              my: 4,
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 30%)"
                  : colors[themeColor][100],
              borderRadius: 5,
              display: "block",
              p: 2,
              userSelect: "none",
              textAlign: "center",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                display: "block",
                marginBottom: "10px",
              }}
            >
              warning
            </span>
            Make sure you trust who you are inviting. Anyone with access can
            view your s, lists, rooms, and inventory
          </Box>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="filled"
            autoComplete="off"
            label="Enter an email address"
            fullWidth
          />
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={permission}
              variant="filled"
              sx={{ mt: 2, pt: 0, pb: 1, mb: 2, height: "90px" }}
              label="Permissions"
              onChange={handleChange}
            >
              <MenuItem value={"read-only"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Read only</Typography>
                  <Typography variant="body2">
                    View access to your inventory, rooms, and lists
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={"member"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Member</Typography>
                  <Typography variant="body2">
                    Can view and edit your inventory, rooms, lists, etc
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <LoadingButton
            loading={loading}
            onClick={() => {
              if (isEmail(value)) {
                fetch(
                  "/api/property/members/add?" +
                    new URLSearchParams({
                      property: global.property.propertyId,
                      accessToken: global.property.accessToken,

                      email: value,
                      name: global.property.profile.name,
                      permission: permission,
                    })
                )
                  .then((res) => res.json())
                  .then((res: any) => {
                    emailjs
                      .send(
                        "service_bhq01y6",
                        "template_nbjdq1i",
                        {
                          to_email: value,
                          house_name: res.profile.name,
                        },
                        "6Q4BZ_DN9bCSJFZYM"
                      )
                      .then(() => {
                        toast.success("Invitation sent!");
                        setLoading(false);
                      })
                      .catch((err) => {
                        toast(
                          "An invitation was sent, but something went wrong while trying to send an email notification"
                        );
                        setLoading(false);
                      });
                  })
                  .catch((err) => {
                    setLoading(false);
                    toast.error(
                      "An error occured while trying to send an invite"
                    );
                  });
                setLoading(true);
              } else {
                toast.error("Please enter a valid email address");
              }
            }}
            variant="outlined"
            size="large"
            sx={{
              borderWidth: "2px!important",
              borderRadius: 4,
              transition: "none!important",
              mt: 1,
              float: "right",
            }}
          >
            Send invitation
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Member({ member }): any {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  return deleted ? (
    <>This user no longer has access to your home</>
  ) : (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontWeight: "600",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.user.email}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            mx: "auto",
            textOverflow: "ellipsis",
            display: "flex",
            mt: 0.5,
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="material-symbols-rounded">
            {member.permission === "member"
              ? "group"
              : member.permission == "owner"
              ? "productivity"
              : "visibility"}
          </span>
          <span
            style={{ marginTop: member.permission === "owner" ? "-4px" : "" }}
          >
            {member.permission == "member"
              ? "Read, write, and edit access"
              : member.permission == "owner"
              ? "Owner"
              : "Read-only access"}
          </span>
        </Typography>
        <LoadingButton
          loading={loading}
          variant="outlined"
          disabled={
            global.property.permission !== "owner" ||
            member.permission === "owner"
          }
          sx={{
            borderWidth: "2px!important",
            width: "100%",
            mt: 1.5,
            borderRadius: 4,
          }}
          onClick={() => {
            setLoading(true);
            fetch(
              "/api/account/sync/revokeToken?" +
                new URLSearchParams({
                  id: member.id,
                  email: member.email,
                  accessToken: global.property.accessToken,
                  property: global.property.propertyId,
                }),
              {
                method: "POST",
              }
            ).then((res) => {
              toast.success("Removed person from your home");
              setLoading(false);
              setDeleted(true);
            });
          }}
        >
          Remove
        </LoadingButton>
      </Box>
    </>
  );
}

export function MemberList() {
  const url =
    "/api/property/members?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        ...data.map((member) => {
          return {
            content: <Member member={member} />,
          };
        }),
      ]
    : [];

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", marginTop: "-40px" }}>
        <AddPersonModal />
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          mt: 1,
          "& *": {
            overscrollBehavior: "auto!important",
          },
          // "& [data-swipeable]": {
          //   width: "250px !important",
          // },
        }}
      >
        <SwipeableViews
          resistance
          style={{
            borderRadius: "20px",
            width: "100%",
            padding: "0 20px",
          }}
          slideStyle={{
            padding: "0 10px",
            paddingLeft: 0,
          }}
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <Box
              key={index.toString()}
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  userSelect: "none",
                  px: 2.5,
                  borderRadius: 5,
                  background:
                    global.theme === "dark"
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][100],
                }}
              >
                {step.content}
              </Box>
            </Box>
          ))}
        </SwipeableViews>
      </Box>
    </>
  );
}

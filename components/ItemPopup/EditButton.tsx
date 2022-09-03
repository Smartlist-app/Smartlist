import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import { AutocompleteData } from "../AutocompleteData";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";
import ListItem from "@mui/material/ListItem";

export function EditButton({ styles, item, setItemData }: any): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      categories: item.categories,
      title: item.title,
      quantity: item.amount,
    },
    onSubmit: async (values: {
      categories: Array<string>;
      title: string;
      quantity: string;
    }) => {
      fetch(
        "/api/inventory/edit?" +
          new URLSearchParams({
            propertyToken: global.property.id,
            accessToken: global.property.accessToken,
            id: item.id.toString(),
            lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            name: values.title,
            qty: values.quantity,
            category: JSON.stringify(values.categories),
          }),
        {
          method: "POST",
        }
      );

      // Update item object
      setItemData({
        ...item,
        title: values.title,
        quantity: values.quantity,
        categories: values.categories,
        lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
      handleClose();
    },
  });

  return (
    <div>
      <ListItem button sx={styles} onClick={handleClickOpen}>
        <span className="material-symbols-rounded">edit</span>
        Edit
      </ListItem>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            minHeight: {
              xs: "95vh",
              sm: "unset",
            },
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              autoFocus
              label="Title"
              fullWidth
              onChange={formik.handleChange}
              defaultValue={formik.values.title}
              name="title"
              variant="filled"
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              onChange={formik.handleChange}
              defaultValue={formik.values.quantity}
              name="quantity"
              variant="filled"
            />
            <Autocomplete
              id="categories"
              multiple
              freeSolo
              options={AutocompleteData}
              defaultValue={formik.values.categories}
              onChange={(e, newValue) =>
                formik.setFieldValue("categories", newValue)
              }
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  label="Categories"
                  name="categories"
                  variant="filled"
                  {...params}
                />
              )}
            />
            <Typography sx={{ mt: 2 }} variant="body2">
              Hit &ldquo;Enter&rdquo; after each category
            </Typography>

            <Box
              sx={{
                position: {
                  xs: "fixed",
                  sm: "unset",
                },
                bottom: 0,
                left: 0,
                width: "100%",
                p: 1,
                background: colors[themeColor][50],
              }}
            >
              <Button
                variant="contained"
                disableElevation
                size="large"
                type="submit"
                sx={{
                  borderRadius: 99,
                  float: "right",
                  px: 3,
                  py: 1,
                  mt: 1,
                  ml: 1,
                }}
              >
                Done
              </Button>
            </Box>
          </form>
        </DialogContent>
      </SwipeableDrawer>
    </div>
  );
}

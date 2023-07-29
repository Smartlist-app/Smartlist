import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Task } from ".";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ColorPopover } from "./ColorPopover";
import { CreateTask } from "./Create";
import { SelectDateModal } from "./DatePicker";
import { RescheduleModal } from "./Snooze";
import { parseEmojis } from "./TaskDrawer";

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const videoChatPlatforms = [
  "zoom.us",
  "meet.google.com",
  "teams.microsoft.com",
  "skype.com",
  "appear.in",
  "gotomeeting.com",
  "webex.com",
  "hangouts.google.com",
  "jitsi.org",
  "whereby.com",
  "discord.com",
  "vsee.com",
  "bluejeans.com",
  "join.me",
  "appear.in",
  "tokbox.com",
  "wire.com",
  "talky.io",
  "ooVoo.com",
  "fuze.com",
  "amazonchime.com",
  "viber.com",
  "slack.com",
];

export function isAddress(str) {
  if (!str) return false;

  const mapUrls = ["maps.google.com"];
  if (mapUrls.find((url) => str.includes(url))) return true;

  if (
    /^[\w\s.,#-]+$/.test(str) ||
    str.includes(" - ") ||
    str.includes(" high school") ||
    str.includes(" elementary school") ||
    str.includes(" middle school") ||
    str.includes(" university") ||
    str.includes(", ") ||
    /\d+\s+[^,]+,\s+[^,]+,\s+\w{2}\s+\d{5}/.test(str) ||
    /^(\d+\s[A-Za-z]+\s[A-Za-z]+(?:,\s[A-Za-z]+)?)$/.test(str)
  ) {
    return true;
  }

  return false;
}

const DrawerContent = React.memo(function DrawerContent({
  handleDelete,
  handleMutate,
  isDateDependent,
  handleParentClose,
  setTaskData,
  mutationUrl,
  data,
}: any) {
  const storage = useAccountStorage();
  const session = useSession();
  const dateRef = useRef();
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 600px)");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isDark = useDarkMode(session.darkMode);

  const isSubTask = data.parentTasks.length !== 0;

  const palette = useColor(session.themeColor, isDark);
  const greenPalette = useColor("green", isDark);

  const handlePriorityChange = useCallback(async () => {
    setAnchorEl(null);
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          fetchRawApi(session, "property/boards/column/task/edit", {
            id: data.id,
            pinned: data.pinned ? "false" : "true",
          }).then(() => mutate(mutationUrl));
          await mutate(mutationUrl);
          resolve("");
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: data.pinned ? "Changing priority..." : "Marking important...",
        success: data.pinned ? "Task unpinned!" : "Task pinned!",
        error: "Failed to change priority",
      },
      toastStyles,
    );
  }, [data.pinned, data.id, mutationUrl, setTaskData, session]);

  const handleEdit = useCallback(
    function handleEdit(id, key, value) {
      setTaskData((prev) => ({ ...prev, [key]: value }));
      fetchRawApi(session, "property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: [value],
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData, session],
  );

  const handleComplete = useCallback(async () => {
    let completed = data.completed;
    setTaskData((prev) => {
      completed = !prev.completed;
      return { ...prev, completed };
    });
    try {
      await fetchRawApi(session, "property/boards/column/task/edit", {
        completed: completed ? "true" : "false",
        id: data.id,
      });
      mutate(mutationUrl);
      handleMutate();
    } catch (e) {
      toast.error("An error occured while updating the task", toastStyles);
    }
  }, [data, setTaskData, mutationUrl, handleMutate, session]);

  const handlePostpone: any = useCallback(
    (count, type) => {
      if (isDateDependent) {
        handleParentClose();
      }
      setTaskData((prev) => ({
        ...prev,
        due: dayjs(data.due).add(count, type).toISOString(),
      }));
      handleEdit(
        data.id,
        "due",
        dayjs(data.due).add(count, type).toISOString(),
      );
    },
    [
      data.id,
      setTaskData,
      data.due,
      handleEdit,
      isDateDependent,
      handleParentClose,
    ],
  );

  const styles = {
    section: {
      background: palette[2],
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      mb: 3,
      "& .item": {
        color: palette[12],
        borderRadius: 0,
        "&.MuiListItem-root, &.MuiListItemButton-root": {
          px: 3,
        },
      },
      "& .item:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: palette[3],
      },
    },
  };
  const buttonStyles = {
    transition: "none",
    background: palette[3],
    color: palette[12],
    "&:hover": {
      background: { sm: palette[4] },
      color: { sm: palette[11] },
    },
    "&:active": {
      background: palette[5],
      color: palette[10],
    },
  };

  const shouldDisable =
    storage?.isReached === true || session.permission === "read-only";

  return (
    <>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton
            onClick={handleParentClose}
            size="small"
            sx={buttonStyles}
          >
            <Icon>close</Icon>
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
            <MenuItem onClick={handlePriorityChange} disabled={shouldDisable}>
              <Icon
                {...(!data.pinned && { className: "outlined" })}
                sx={{
                  ...(data.pinned && {
                    transform: "rotate(-20deg)",
                  }),
                  transition: "all .2s",
                }}
              >
                push_pin
              </Icon>
              {data.pinned ? "Pinned" : "Pin"}
            </MenuItem>
            <ConfirmationModal
              title="Delete task?"
              question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
              disabled={data.subTasks.length === 0}
              callback={async () => {
                handleParentClose();
                await handleDelete(data.id);
                handleMutate();
              }}
            >
              <MenuItem>
                <Icon className="outlined">delete</Icon>Delete
              </MenuItem>
            </ConfirmationModal>
          </Menu>
          <Box
            sx={{ ml: "auto", display: "flex", gap: 0.5 }}
            id="subtaskTrigger"
          >
            <Button
              disableRipple
              onClick={handleComplete}
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
              sx={{
                "& .text": {
                  display: { xs: "none", sm: "inline" },
                },
                px: 1.5,
                ...buttonStyles,
                ...(data.completed && {
                  background: greenPalette[2],
                  "&:hover": {
                    background: { sm: greenPalette[3] },
                  },
                  "&:active": {
                    background: greenPalette[4],
                  },
                }),
              }}
            >
              <Icon className={data.completed ? "" : "outlined"}>
                check_circle
              </Icon>
              <span className="text">
                {data.completed ? "Completed" : "Complete"}
              </span>
            </Button>
            <RescheduleModal
              data={data}
              handlePostpone={handlePostpone}
              handleEdit={handleEdit}
              setTaskData={setTaskData}
            >
              <Button
                disableRipple
                disabled={!data.due}
                sx={{
                  px: 1.5,
                  ...buttonStyles,
                }}
              >
                <Icon className="outlined">bedtime</Icon>
                Snooze
              </Button>
            </RescheduleModal>
            {!isMobile && (
              <IconButton
                onClick={handlePriorityChange}
                size="small"
                sx={{
                  flexShrink: 0,
                  ...buttonStyles,
                  ...(data.pinned && {
                    background: isDark
                      ? "hsl(24, 88.6%, 19.8%)"
                      : "hsl(25, 100%, 82.8%)",
                    "&:hover": {
                      background: isDark
                        ? "hsl(24, 92.4%, 24.0%)"
                        : "hsl(24, 100%, 75.3%)",
                    },
                    "&:active": {
                      background: isDark
                        ? "hsl(25, 100%, 29.0%)"
                        : "hsl(24, 94.5%, 64.3%)",
                    },
                  }),
                }}
                disabled={shouldDisable}
              >
                <Icon
                  {...(!data.pinned && { className: "outlined" })}
                  sx={{
                    ...(data.pinned && {
                      transform: "rotate(-20deg)",
                    }),

                    transition: "transform .2s",
                  }}
                >
                  push_pin
                </Icon>
              </IconButton>
            )}
            {isMobile && (
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{
                  flexShrink: 0,
                  ...buttonStyles,
                }}
                disabled={
                  storage?.isReached === true ||
                  session.permission === "read-only"
                }
              >
                <Icon>more_vert</Icon>
              </IconButton>
            )}
            {!isMobile && (
              <ConfirmationModal
                title="Delete task?"
                question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
                disabled={data.subTasks.length === 0}
                callback={async () => {
                  handleParentClose();
                  await handleDelete(data.id);
                  handleMutate();
                }}
              >
                <IconButton
                  onClick={handleParentClose}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    ...buttonStyles,
                  }}
                >
                  <Icon className="outlined">delete</Icon>
                </IconButton>
              </ConfirmationModal>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 3, sm: 4 }, pb: { sm: 1 } }}>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <ColorPopover
            mutationUrl={mutationUrl}
            setTaskData={setTaskData}
            data={data}
          />

          {!isSubTask && (
            <SelectDateModal
              ref={dateRef}
              styles={() => {}}
              date={data.due}
              setDate={(d) => {
                handleParentClose();
                setTaskData((prev) => ({
                  ...prev,
                  due: d ? null : d?.toISOString(),
                }));
                handleEdit(data.id, "due", d.toISOString());
              }}
            >
              <Chip
                variant="outlined"
                label={
                  data.due && dayjs(data.due).format("MMMM D, YYYY [at] h:mm A")
                }
                disabled={
                  storage?.isReached === true ||
                  session.permission === "read-only"
                }
              />
            </SelectDateModal>
          )}
        </Box>
        <TextField
          disabled={shouldDisable}
          multiline
          placeholder="Task name"
          fullWidth
          defaultValue={parseEmojis(data.name.trim())}
          variant="standard"
          onBlur={(e) => {
            if (e.target.value.trim() !== "") {
              handleEdit(data.id, "name", e.target.value);
            }
          }}
          onChange={(e: any) =>
            (e.target.value = e.target.value.replaceAll("\n", ""))
          }
          onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
          margin="dense"
          InputProps={{
            disableUnderline: true,
            className: "font-heading",
            sx: {
              "&:focus-within": {
                "&, & *": { textTransform: "none!important" },
                background: palette[2],
                px: 1,
                borderRadius: 5,
              },
              fontSize: { xs: "50px", sm: "55px" },
              textDecoration: "underline",
              color: colors[data.color][isDark ? "A200" : 800],
            },
          }}
        />

        <Box sx={styles.section}>
          <TextField
            className="item"
            onBlur={(e) => handleEdit(data.id, "where", e.target.value)}
            onKeyDown={(e: any) =>
              e.key === "Enter" && !e.shiftKey && e.target.blur()
            }
            placeholder={"Click to add location"}
            disabled={shouldDisable}
            fullWidth
            defaultValue={parseEmojis(data.where || "")}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                py: 1,
                px: 3,
              },
              ...((isValidHttpUrl(data.where) || isAddress(data.where)) && {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        if (isAddress(data.where)) {
                          window.open(
                            `https://maps.google.com/?q=${encodeURIComponent(
                              data.where,
                            )}`,
                          );
                          return;
                        }
                        window.open(data.where);
                      }}
                    >
                      <Icon>
                        {videoChatPlatforms.find((platform) =>
                          data.where.includes(platform),
                        )
                          ? "call"
                          : isAddress(data.where)
                          ? "location_on"
                          : "link"}
                      </Icon>
                      {videoChatPlatforms.find((platform) =>
                        data.where.includes(platform),
                      )
                        ? "Call"
                        : isAddress(data.where)
                        ? "Maps"
                        : "Open"}
                    </Button>
                  </InputAdornment>
                ),
              }),
            }}
          />

          {/* Description */}
          <TextField
            className="item"
            onBlur={(e) => handleEdit(data.id, "description", e.target.value)}
            onKeyDown={(e: any) =>
              e.key === "Enter" && !e.shiftKey && e.target.blur()
            }
            multiline
            placeholder={
              storage?.isReached === true
                ? "You've reached your account storage limits and you can't add a description."
                : "Click to add note..."
            }
            disabled={shouldDisable}
            fullWidth
            defaultValue={parseEmojis(data.description || "")}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                py: 1.5,
                px: 3,
              },
            }}
          />
          <ListItem className="item">
            <ListItemText primary="Attachments" />
          </ListItem>
        </Box>

        <Box sx={styles.section}>
          {!isSubTask && (
            <>
              <CreateTask
                isSubTask
                column={{ id: "-1", name: "" }}
                sx={{ mb: 0 }}
                parent={data.id}
                label="Create a subtask"
                placeholder="Add a subtask..."
                handleMutate={handleMutate}
                boardId={1}
              />
              {/* <ExperimentalAiSubtask task={data} /> */}
              {!isSubTask &&
                data.subTasks.map((subTask) => (
                  <Task
                    key={subTask.id}
                    isSubTask
                    sx={{
                      pl: { xs: 2.6, sm: 1.7 },
                      "& .date": {
                        display: "none",
                      },
                    }}
                    board={subTask.board || false}
                    columnId={subTask.column ? subTask.column.id : -1}
                    mutationUrl=""
                    handleMutate={handleMutate}
                    task={subTask}
                  />
                ))}
            </>
          )}
        </Box>

        <Box sx={styles.section}>
          {data.id.includes("-event-assignment") && (
            <ListItem className="item" sx={{ gap: 1.5 }}>
              <Box
                sx={{
                  background:
                    "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
                  color: "#000!important",
                  width: 13,
                  height: 13,
                  borderRadius: 999,
                }}
              />
              <ListItemText primary={`Imported from Canvas LMS`} />
            </ListItem>
          )}
          <ListItem className="item">
            <ListItemText
              primary={`Edited  ${dayjs(data.lastUpdated).fromNow()}`}
              sx={{ fontStyle: "italic" }}
            />
          </ListItem>
          <ListItemButton
            className="item"
            onClick={() => router.push(`/groups/${data.property.id}`)}
          >
            <ListItemText
              primary={
                !(data?.column?.board?.public === false)
                  ? data.property.name
                  : "Only visible to you"
              }
              secondary={
                !(data?.column?.board?.public === false)
                  ? "Visible to group"
                  : `Not visible to others in "${data.property.name}"`
              }
            />
            <Icon sx={{ ml: "auto" }} className="outlined">
              {!(data?.column?.board?.public === false) ? "group" : "lock"}
            </Icon>
          </ListItemButton>
          {data.column && (
            <ListItemButton
              className="item"
              onClick={() =>
                router.push(`/tasks/boards/${data.column.board.id}`)
              }
            >
              <ListItemText
                secondary={data.column.name}
                primary={`Found in "${data.column.board.name}"`}
              />
              <Icon sx={{ ml: "auto" }} className="outlined">
                view_kanban
              </Icon>
            </ListItemButton>
          )}
        </Box>
      </Box>
    </>
  );
});
export default DrawerContent;

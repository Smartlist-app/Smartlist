import {
  AppBar,
  Button,
  Chip,
  Dialog,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { green, orange } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import Image from "next/image";
import { useCallback, useState } from "react";
import DatePicker from "react-calendar";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Task } from ".";
import { useAccountStorage } from "../../../../../lib/client/useAccountStorage";
import { fetchRawApi } from "../../../../../lib/client/useApi";
import { useSession } from "../../../../../lib/client/useSession";
import { toastStyles } from "../../../../../lib/client/useTheme";
import { colors } from "../../../../../lib/colors";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { Color } from "./Color";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";
import { RescheduleModal } from "./RescheduleModal";
import { parseEmojis } from "./TaskDrawer";

export default function DrawerContent({
  isDateDependent,
  handleParentClose,
  isAgenda,
  setTaskData,
  mutationUrl,
  data,
}) {
  const storage = useAccountStorage();
  const session = useSession();

  const handlePriorityChange = useCallback(async () => {
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await fetchRawApi("property/boards/togglePin", {
            id: data.id,
            pinned: !data.pinned ? "true" : "false",
          }).then(() => {
            mutate(mutationUrl);
          });
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
      toastStyles
    );
  }, [data.pinned, data.id, mutationUrl, setTaskData]);

  const handleDelete = useCallback(
    function handleDelete(taskId) {
      setTaskData("deleted");
      fetchRawApi("property/boards/column/task/delete", {
        id: taskId,
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData]
  );

  const handleEdit = useCallback(
    function handleEdit(id, key, value) {
      setTaskData((prev) => ({ ...prev, [key]: value }));
      fetchRawApi("property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: [value],
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData]
  );

  const handleComplete = useCallback(async () => {
    let completed = data.completed;
    setTaskData((prev) => {
      completed = !prev.completed;
      return { ...prev, completed };
    });

    fetchRawApi("property/boards/column/task/mark", {
      completed: completed ? "true" : "false",
      id: data.id,
    })
      .then(() => mutate(mutationUrl))
      .catch(() =>
        toast.error("An error occured while updating the task", toastStyles)
      );
  }, [data, setTaskData, mutationUrl]);

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
        dayjs(data.due).add(count, type).toISOString()
      );
    },
    [
      data.id,
      setTaskData,
      data.due,
      handleEdit,
      isDateDependent,
      handleParentClose,
    ]
  );

  const [open, setOpen] = useState<boolean>(false);

  const iconStyles = {
    width: "100%",
    justifyContent: "start",
    borderRadius: 5,
    gap: 2,
    py: 1,
    px: 1.5,
    cursor: { sm: "default" },
    color: session.user.darkMode ? "hsl(240,11%,80%)" : "hsl(240,11%,30%)",
    "&:hover": {
      background: session.user.darkMode
        ? "hsl(240, 11%, 22%)"
        : "rgba(200, 200, 200, .3)",
    },
    "& .MuiIcon-root": {
      "&:not(.pinned)": {
        fontVariationSettings:
          '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
      },
      width: 40,
      color: session.user.darkMode ? "hsl(240,11%,90%)" : "hsl(240,11%,10%)",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99999,
      border: "1px solid",
      borderColor: `hsl(240, 11%, ${session.user.darkMode ? 30 : 80}%)`,
      "&.completed": {
        borderColor: `${green[900]}!important`,
      },
      "&.pinned": {
        borderColor: `${orange[900]}!important`,
        color: `${orange[50]}!important`,
        background: `${orange[900]}!important`,
      },
    },
  };

  const [option, setOption] = useState("Details");
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton onClick={handleParentClose}>
            <Icon>close</Icon>
          </IconButton>

          <Box sx={{ ml: "auto" }}>
            <Button
              {...(option === "Details" && { variant: "contained" })}
              size="small"
              onClick={() => setOption("Details")}
            >
              Details
            </Button>
            <Button
              {...(option === "Subtasks" && { variant: "contained" })}
              size="small"
              onClick={() => setOption("Subtasks")}
              disabled={data.parentTasks.length !== 0}
            >
              Subtasks
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {option === "Details" && (
        <Box sx={{ p: { xs: 3, sm: 4 }, pb: { sm: 1 } }}>
          <TextField
            disabled={
              storage?.isReached === true || session.permission === "read-only"
            }
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
                fontSize: { xs: "35px", sm: "40px" },
                textDecoration: "underline",
                mt: -2,
                color: colors[data.color][session.user.darkMode ? "A200" : 800],
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "scroll",
            }}
          >
            {session.permission !== "read-only" &&
              [
                "orange",
                "red",
                "brown",
                "pink",
                "purple",
                "indigo",
                "teal",
                "green",
                "grey",
              ].map((color) => (
                <Color
                  key={color}
                  color={color}
                  mutationUrl={mutationUrl}
                  setTaskData={setTaskData}
                  task={data}
                />
              ))}
          </Box>

          <>
            {/* Description */}
            <TextField
              onBlur={(e) => handleEdit(data.id, "description", e.target.value)}
              onKeyDown={(e: any) =>
                e.key === "Enter" && !e.shiftKey && e.target.blur()
              }
              multiline
              placeholder={
                storage?.isReached === true
                  ? "You've reached your account storage limits and you can't add a description."
                  : "Click to add description"
              }
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
              fullWidth
              defaultValue={parseEmojis(data.description)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  mt: 3,
                  borderRadius: 5,
                  background: session.user.darkMode
                    ? "hsl(240,11%,20%)"
                    : "rgba(200,200,200,.3)",
                  "&:focus-within, &:hover": {
                    background: session.user.darkMode
                      ? "hsl(240,11%,22%)"
                      : "rgba(200,200,200,.4)",
                  },
                  p: 2,
                  px: 2,
                },
              }}
            />

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{ sx: { p: 3 } }}
              keepMounted={false}
            >
              <DatePicker
                value={new Date(data.due || new Date().toISOString())}
                onChange={(e: any) => {
                  handleParentClose();
                  setTaskData((prev) => ({
                    ...prev,
                    due: e ? null : e?.toISOString(),
                  }));
                  handleEdit(data.id, "due", e.toISOString());
                  setOpen(false);
                }}
              />
            </Dialog>

            {/* Date */}
            {data.parentTasks.length == 0 && (
              <TextField
                fullWidth
                variant="standard"
                value={
                  data.due &&
                  dayjs(data.due).format("dddd, MMM D, YYYY, h:mm A")
                }
                placeholder="Set a due date"
                onClick={() => setOpen(true)}
                disabled={
                  storage?.isReached === true ||
                  session.permission === "read-only"
                }
                InputProps={{
                  readOnly: true,
                  sx: {
                    ...(storage?.isReached === true && {
                      pointerEvents: "none",
                    }),
                    borderRadius: 5,
                    background: session.user.darkMode
                      ? "hsl(240,11%,20%)"
                      : "rgba(200,200,200,.3)",
                    "&:focus-within, &:hover": {
                      background: session.user.darkMode
                        ? "hsl(240,11%,22%)"
                        : "rgba(200,200,200,.4)",
                    },
                    p: 1.5,
                    px: 2,
                    mt: 2,
                  },
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>today</Icon>
                    </InputAdornment>
                  ),
                  ...(data.due && {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={session.permission === "read-only"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskData((prev) => ({
                              ...prev,
                              due: false,
                            }));
                            handleParentClose();
                            handleEdit(data.id, "due", "");
                          }}
                          size="small"
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }),
                }}
              />
            )}
            {data.image && <Box sx={{ mt: 4 }} />}
            {data.image && <ImageViewer url={data.image} />}
            <Box
              sx={{
                background: session.user.darkMode
                  ? "hsl(240,11%,20%)"
                  : "rgba(200,200,200,.3)",
                borderRadius: 5,
                p: 0.5,
                my: 2,
              }}
            >
              <Button
                onClick={handleComplete}
                sx={iconStyles}
                disabled={
                  storage?.isReached === true ||
                  session.permission === "read-only"
                }
              >
                <Icon
                  className={`${data.completed && "completed"}`}
                  sx={{
                    ...(data.completed && {
                      background: green[900],
                      color: "#fff!important",
                    }),
                  }}
                >
                  {data.completed ? "check" : "close"}
                </Icon>
                {data.completed ? "Completed" : "Incomplete"}
              </Button>
              {data.parentTasks.length == 0 && (
                <Button
                  onClick={handlePriorityChange}
                  sx={iconStyles}
                  disabled={
                    storage?.isReached === true ||
                    session.permission === "read-only"
                  }
                >
                  <Icon
                    className={`${data.pinned && "pinned"}`}
                    sx={{
                      ...(data.pinned && {
                        transform: "rotate(-20deg)",
                      }),
                      transition: "all .2s",
                    }}
                  >
                    push_pin
                  </Icon>
                  {data.pinned ? "Important" : "Unpinned "}
                </Button>
              )}
              <ConfirmationModal
                title="Delete task?"
                question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
                disabled={data.subTasks.length === 0}
                callback={() => {
                  handleParentClose();
                  handleDelete(data.id);
                }}
              >
                <Button
                  sx={iconStyles}
                  disabled={session.permission === "read-only"}
                >
                  <Icon className="outlined shadow-md dark:shadow-xl">
                    delete
                  </Icon>
                  Delete
                </Button>
              </ConfirmationModal>
              {data.parentTasks.length == 0 && (
                <RescheduleModal handlePostpone={handlePostpone} data={data}>
                  <Button
                    sx={iconStyles}
                    disabled={
                      storage?.isReached === true ||
                      session.permission === "read-only"
                    }
                  >
                    <Icon className="outlined shadow-md dark:shadow-xl">
                      schedule
                    </Icon>
                    Reschedule
                  </Button>
                </RescheduleModal>
              )}
            </Box>
          </>
        </Box>
      )}
      {option === "Subtasks" && (
        <Box
          sx={{
            ...(data.parentTasks.length !== 0 && {
              display: "none",
            }),
            px: { sm: 2 },
            pt: 2,
          }}
        >
          {data.subTasks.length === 0 && (
            <Box sx={{ textAlign: "center", mb: 0.5 }}>
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  ...(session.user.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />
              <Box sx={{ px: 1.5 }}>
                <Typography variant="h6" gutterBottom>
                  Nothing much here...
                </Typography>
                <Typography gutterBottom>
                  You haven&apos;t created any subtasks yet
                </Typography>
              </Box>
              <Divider sx={{ opacity: 0.5, mt: 2 }} />
            </Box>
          )}
          {data.parentTasks.length === 0 &&
            data.subTasks.map((subTask, index) => (
              <Task
                isDateDependent={true}
                key={subTask.id}
                board={subTask.board || false}
                columnId={subTask.column ? subTask.column.id : -1}
                mutationUrl={""}
                task={subTask}
              />
            ))}
          <CreateTask
            column={{ id: "-1", name: "" }}
            parent={data.id}
            label="Create a subtask"
            placeholder={`Add a subtask to "${data.name}"`}
            mutationUrl={mutationUrl}
            boardId={1}
          />
        </Box>
      )}
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          px: { xs: 3, sm: 4 },
          gap: 2,
          mb: 3,
          ...(option !== "Details" && { display: "none" }),
        }}
      >
        {data.id.includes("-event-assignment") && (
          <Chip
            label="Synced to Canvas LMS"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
              color: "#000!important",
            }}
          />
        )}
        <Chip label={`Last updated ${dayjs(data.lastUpdated).fromNow()}`} />
      </Box>
    </>
  );
}

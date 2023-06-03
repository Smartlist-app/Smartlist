import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  Icon,
  IconButton,
  Popover,
  TextField,
  Toolbar,
} from "@mui/material";
import { green, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import DatePicker from "react-calendar";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Task } from ".";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { Color } from "./Color";
import { CreateTask } from "./Create";
import { ExperimentalAiSubtask } from "./ExperimentalAiSubtask";
import { ImageViewer } from "./ImageViewer";
import { RescheduleModal } from "./RescheduleModal";
import { parseEmojis } from "./TaskDrawer";

function ColorPopover({ data, setTaskData, mutationUrl }) {
  const session = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => setAnchorEl(event.currentTarget);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const trigger = (
    <Chip
      icon={<Icon sx={{ color: "#000!important", pl: 2 }}>label</Icon>}
      sx={{
        background: colors[data.color][session.user.darkMode ? "A200" : 100],
      }}
      onClick={handleClick}
    />
  );

  return (
    <>
      {trigger}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: 0,
          },
        }}
      >
        {trigger}
        <Box
          sx={{
            display: "flex",
            maxWidth: "60vw",
            mt: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
          onClick={handleClose}
        >
          {[
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
      </Popover>
    </>
  );
}

export default function DrawerContent({
  handleDelete,
  handleMutate,
  isDateDependent,
  handleParentClose,
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
          fetchRawApi("property/boards/column/task/edit", {
            id: data.id,
            pinned: data.pinned ? "false" : "true",
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

    fetchRawApi("property/boards/column/task/edit", {
      completed: completed ? "true" : "false",
      id: data.id,
    })
      .then(() => {
        mutate(mutationUrl);
        if (data.parentTasks.length !== 0)
          document.getElementById("subtaskTrigger")?.click();
      })
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

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            onClick={handleParentClose}
            size="small"
            sx={{
              background: `hsl(240,11%,${session.user.darkMode ? 20 : 90}%)`,
            }}
          >
            <Icon>close</Icon>
          </IconButton>

          <Box
            sx={{ ml: "auto", display: "flex", gap: 0.5 }}
            id="subtaskTrigger"
          >
            <Button
              onClick={handleComplete}
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
              sx={{
                px: 1.5,
                background: `hsl(240,11%,${session.user.darkMode ? 20 : 90}%)`,
                ...(data.completed && {
                  background: session.user.darkMode
                    ? "hsl(154, 48.4%, 12.9%)"
                    : "hsl(151, 50.0%, 53.2%)",
                  "&:hover": {
                    background: session.user.darkMode
                      ? "hsl(154, 49.7%, 14.9%)"
                      : "hsl(151, 55.0%, 41.5%)",
                  },
                }),
              }}
            >
              <Icon className="outlined">check_circle</Icon>
              {data.completed ? "Complete" : "Completed"}
            </Button>
            <RescheduleModal data={data} handlePostpone={handlePostpone}>
              <Button
                sx={{
                  px: 1.5,
                  background: `hsl(240,11%,${
                    session.user.darkMode ? 20 : 90
                  }%)`,
                }}
              >
                <Icon className="outlined">bedtime</Icon>
                Snooze
              </Button>
            </RescheduleModal>
            <IconButton
              onClick={handlePriorityChange}
              size="small"
              sx={{
                flexShrink: 0,
                background: `hsl(240,11%,${session.user.darkMode ? 20 : 90}%)`,
              }}
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
            >
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
            </IconButton>{" "}
            <ConfirmationModal
              title="Delete task?"
              question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
              disabled={data.subTasks.length === 0}
              callback={async () => {
                handleParentClose();
                await handleDelete(data.id);
                document.getElementById("subtaskTrigger")?.click();
              }}
            >
              <IconButton
                onClick={handleParentClose}
                size="small"
                sx={{
                  flexShrink: 0,
                  background: `hsl(240,11%,${
                    session.user.darkMode ? 20 : 90
                  }%)`,
                }}
              >
                <Icon className="outlined">delete</Icon>
              </IconButton>
            </ConfirmationModal>
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

          {data.parentTasks.length == 0 && (
            <Chip
              variant="outlined"
              label={
                data.due && dayjs(data.due).format("dddd, MMM D, YYYY, h:mm A")
              }
              onClick={() => setOpen(true)}
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
              onDelete={(e) => {
                e.stopPropagation();
                setTaskData((prev) => ({
                  ...prev,
                  due: false,
                }));
                handleParentClose();
                handleEdit(data.id, "due", "");
              }}
            />
          )}
        </Box>
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
              color: colors[data.color][session.user.darkMode ? "A200" : 800],
            },
          }}
        />

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
            storage?.isReached === true || session.permission === "read-only"
          }
          fullWidth
          defaultValue={parseEmojis(data.description || "")}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: 5,
              "&:focus-within": {
                background: session.user.darkMode
                  ? "hsl(240,11%,22%)"
                  : "rgba(200,200,200,.4)",
              },
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

        {data.image && <Box sx={{ mt: 2 }} />}
        {data.image && <ImageViewer url={data.image} />}
      </Box>

      <Box sx={{ px: { sm: 2.5 } }}>
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
        <ExperimentalAiSubtask task={data} />

        {data.parentTasks.length === 0 &&
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
      </Box>
      {/* <Box
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
      </Box> */}
    </>
  );
}

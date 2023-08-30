import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import { AgendaContext } from ".";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import SelectDateModal from "../Task/DatePicker";
import { ColumnMenu } from "./ColumnMenu";

function RandomTask({ date }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const taskIdeas = [
    {
      name: "Write a Poem",
      description: "Compose a creative poem about a topic of your choice.",
    },
    {
      name: "Take a Nature Walk",
      description:
        "Explore the outdoors and take a leisurely walk in a natural setting.",
    },
    {
      name: "Learn a New Recipe",
      description:
        "Discover a new recipe and try cooking a meal from a different cuisine.",
    },
    {
      name: "Read a Chapter",
      description:
        "Dedicate time to reading a chapter from a book you've been meaning to finish.",
    },
    {
      name: "Sketch Something",
      description:
        "Unleash your artistic side by sketching an object, scene, or person.",
    },
    {
      name: "Listen to a Podcast",
      description:
        "Select an interesting podcast episode and listen while you go about your day.",
    },
    {
      name: "Stretch Routine",
      description:
        "Engage in a 10-minute stretching routine to boost flexibility and relaxation.",
    },
    {
      name: "Write a Gratitude Journal",
      description:
        "List things you're grateful for in a journal to foster a positive mindset.",
    },
    {
      name: "Solve a Puzzle",
      description:
        "Challenge your mind with a puzzle or brainteaser to enhance cognitive skills.",
    },
    {
      name: "Call a Friend",
      description:
        "Reach out to a friend for a catch-up conversation and strengthen connections.",
    },
    {
      name: "Try Meditation",
      description:
        "Set aside time to meditate and achieve mental clarity and relaxation.",
    },
    {
      name: "Learn a Dance Move",
      description:
        "Pick a dance tutorial online and learn a new move to get your body grooving.",
    },
    {
      name: "Visit a Local Museum",
      description:
        "Explore the cultural offerings of your area by visiting a nearby museum.",
    },
    {
      name: "Plan a Day Trip",
      description:
        "Research and plan an itinerary for a day trip to a nearby town or attraction.",
    },
    {
      name: "Do a Digital Declutter",
      description:
        "Organize your digital spaces by deleting or organizing files, photos, and emails.",
    },
    {
      name: "Write a Short Story",
      description:
        "Exercise your imagination by writing a short fictional story or narrative.",
    },
    {
      name: "Practice a Musical Instrument",
      description:
        "Spend time practicing and improving your skills on a musical instrument.",
    },
    {
      name: "Complete a Workout",
      description:
        "Follow a workout routine to stay active and maintain your fitness goals.",
    },
    {
      name: "Research a New Topic",
      description:
        "Delve into a subject you're curious about and expand your knowledge.",
    },
    {
      name: "Volunteer Virtually",
      description:
        "Find a virtual volunteering opportunity to contribute to a cause you care about.",
    },
    {
      name: "Capture a Photo",
      description:
        "Capture an interesting moment or scene through photography using your smartphone or camera.",
    },
    {
      name: "Try a New Hairstyle",
      description:
        "Experiment with a different hairstyle or hairdo to change up your look.",
    },
    {
      name: "Watch a Documentary",
      description:
        "Select a documentary film to learn about a specific topic or real-life story.",
    },
    {
      name: "Plan my dream vacation",
      description:
        "Research and plan the details of your dream vacation, from destinations to activities.",
    },
    {
      name: "Learn a Magic Trick",
      description:
        "Amaze your friends by mastering a magic trick and performing it with flair.",
    },
    {
      name: "Do a Random Act of Kindness",
      description:
        "Brighten someone's day by performing a small act of kindness without expecting anything in return.",
    },
    {
      name: "Write a Letter",
      description:
        "Compose a handwritten letter to a friend, family member, or yourself.",
    },
    {
      name: "Create a Vision Board",
      description:
        "Gather images and words that represent your goals and aspirations on a digital or physical vision board.",
    },
    {
      name: "Try a New Workout",
      description:
        "Experiment with a different workout routine to challenge your body in new ways.",
    },
    {
      name: "Organize my closet",
      description:
        "Sort through your clothes, shoes, and accessories to declutter and reorganize your closet.",
    },
  ];

  const [random, setRandom] = useState(1);

  const handleClick = () => {
    setRandom(Math.floor(Math.random() * taskIdeas.length));
  };

  return (
    <CreateTask
      defaultDate={date}
      defaultFields={{
        date: date,
        title: capitalizeFirstLetter(taskIdeas[random].name.toLowerCase()),
        description: taskIdeas[random].description,
      }}
    >
      <IconButton
        onTouchStart={handleClick}
        onMouseDown={handleClick}
        size="large"
        sx={{
          ml: "auto",
          "&:active": {
            opacity: 0.6,
          },
          "&:hover": {
            background: { sm: palette[3] + "!important" },
          },
          color: palette[11] + "!important",
        }}
      >
        <Icon className="outlined">casino</Icon>
      </IconButton>
    </CreateTask>
  );
}

const Header = memo(function Header({
  subheading,
  column,
  isToday,
  tasksLeft,
  isPast,
  sortedTasks,
  heading,
  columnEnd,
}: any) {
  const session = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { mutateList, type } = useContext(AgendaContext);

  return (
    <Box
      sx={{
        pt: isMobile ? "65px" : 0,
        backdropFilter: { sm: "blur(20px)" },
        position: { sm: "sticky" },
        top: 0,
        left: 0,
        background: { sm: addHslAlpha(palette[1], 0.7) },
        zIndex: 99,
      }}
    >
      <motion.div
        key="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 4 },
            maxWidth: "100vw",
            mb: { xs: 0, sm: 2 },
            borderBottom: { sm: "1.5px solid" },
            borderColor: { sm: addHslAlpha(palette[4], 0.5) },
            height: "auto",
          }}
          id="taskMutationTrigger"
          onClick={mutateList}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobile && (
              <IconButton
                size="large"
                sx={{ color: palette[8], p: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("agendaPrev")?.click();
                }}
              >
                <Icon className="outlined">arrow_back_ios_new</Icon>
              </IconButton>
            )}
            <SelectDateModal
              date={dayjs(column).toDate()}
              setDate={(date) => {
                setTimeout(() => {
                  router.push(
                    "/tasks/agenda/days/" + dayjs(date).format("YYYY-MM-DD")
                  );
                }, 500);
              }}
              dateOnly
            >
              <Tooltip
                placement="bottom-start"
                title={
                  <Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {isToday
                        ? "Today"
                        : capitalizeFirstLetter(dayjs(column).fromNow())}
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(column).format("dddd, MMMM D, YYYY")}
                    </Typography>
                  </Typography>
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mx: "auto",
                    justifyContent: "cneter",
                    gap: 2,
                    maxWidth: "100%",
                    overflow: "hidden",
                    minWidth: 0,
                    "&:active": {
                      opacity: 0.6,
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      ...(isToday
                        ? {
                            color: "#000!important",
                            background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                            px: 0.5,
                          }
                        : {
                            background: `linear-gradient(${palette[4]}, ${palette[4]})`,
                            px: 0.5,
                          }),
                      borderRadius: 1,
                      width: "auto",
                      display: "inline-flex",
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      ...(isPast && { opacity: 0.5 }),
                    }}
                  >
                    {dayjs(column).format(heading)}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        ...(isPast && {
                          textDecoration: "line-through",
                          ...(isPast && { opacity: 0.5 }),
                        }),
                      }}
                    >
                      {dayjs(column).format(subheading)}
                      {type === "weeks" &&
                        " - " + dayjs(columnEnd).format("DD")}
                    </span>
                  </Typography>
                </Box>
              </Tooltip>
            </SelectDateModal>
            {isMobile && (
              <IconButton
                size="large"
                sx={{ color: palette[8], p: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("agendaNext")?.click();
                }}
              >
                <Icon className="outlined">arrow_forward_ios</Icon>
              </IconButton>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 3,
            pb: 2,
            justifyContent: "center",
          }}
        >
          {session.permission !== "read-only" && (
            <CreateTask
              onSuccess={mutateList}
              defaultDate={dayjs(column).startOf(type).toDate()}
            >
              <Button variant="contained" fullWidth>
                <Icon>add_circle</Icon>
                New task
              </Button>
            </CreateTask>
          )}
          <ColumnMenu tasksLeft={tasksLeft} data={sortedTasks} day={column}>
            <Button variant="outlined" size="small">
              <Icon>more_horiz</Icon>
            </Button>
          </ColumnMenu>
        </Box>
      </motion.div>
    </Box>
  );
});

const Column = React.memo(function Column({
  column,
  data,
  view,
}: any): JSX.Element {
  const scrollParentRef = useRef();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { mutateList, type } = useContext(AgendaContext);

  const columnStart = dayjs(column).startOf(type).toDate();
  const columnEnd = dayjs(columnStart).endOf(type).toDate();

  const [isScrolling, setIsScrolling] = useState(false);

  const heading = {
    days: "DD",
    weeks: "#W",
    months: "YYYY",
  }[type];

  const columnMap = {
    days: "day",
    weeks: "week",
    months: "month",
  }[type];

  const subheading = {
    days: "dddd",
    weeks: "D",
    months: "MMM",
  }[type];

  const isToday = dayjs(column).isSame(dayjs().startOf(columnMap), type);
  const isPast = dayjs(column).isBefore(dayjs().startOf(columnMap), type);

  // stupid virtuoso bug
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    setRerender(true);
  }, []);

  /**
   * Sort the tasks in a "[pinned, incompleted, completed]" order
   */
  const sortedTasks = useMemo(
    () =>
      data
        .filter((task) => {
          const dueDate = new Date(task.due);
          return dueDate >= columnStart && dueDate <= columnEnd;
        })
        .sort((e, d) =>
          e.completed && !d.completed
            ? 1
            : (!e.completed && d.completed) || (e.pinned && !d.pinned)
            ? -1
            : !e.pinned && d.pinned
            ? 1
            : 0
        ),
    [data, columnEnd, columnStart]
  );

  const completedTasks = useMemo(
    () => sortedTasks.filter((task) => task.completed),
    [sortedTasks]
  );

  const tasksLeft = sortedTasks.length - completedTasks.length;
  const [loading, setLoading] = useState(false);

  return (
    <Box
      ref={scrollParentRef}
      {...(isToday && { id: "active" })}
      sx={{
        height: { xs: "auto", sm: "100%" },
        flex: { xs: "0 0 100%", sm: "0 0 300px" },
        width: { xs: "100%", sm: "300px" },
        borderRight: "1.5px solid",
        ...(!isMobile && {
          overflowY: "scroll",
        }),
        ...(view === "priority" &&
          !isToday && {
            opacity: 0.2,
            filter: "blur(5px)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              opacity: 1,
              filter: "none",
            },
          }),
        ...(view === "priority" && {
          borderLeft: "1.5px solid",
        }),
        borderColor: addHslAlpha(palette[4], 0.5),
      }}
    >
      <Header
        subheading={subheading}
        column={column}
        isToday={isToday}
        tasksLeft={tasksLeft}
        loading={loading}
        isPast={isPast}
        sortedTasks={sortedTasks}
        heading={heading}
        columnEnd={columnEnd}
      />
      <Box sx={{ px: { sm: 1 }, height: { sm: "100%" } }}>
        {sortedTasks.filter((task) => !task.completed).length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: "auto",
              py: { sm: 2 },
              alignItems: { xs: "center", sm: "start" },
              textAlign: { xs: "center", sm: "left" },
              flexDirection: "column",
              "& img": {
                display: { sm: "none" },
              },
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  borderRadius: "20px",
                  ...(isDark && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  maxWidth: "calc(100% - 20px)",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: palette[2],
                  borderRadius: 5,
                  py: 1,
                  px: 2,
                  mt: -1,
                }}
              >
                <Typography variant="h6">
                  {sortedTasks.length === 0
                    ? "No tasks..."
                    : "You finished everything!"}
                </Typography>
                <RandomTask date={column} />
              </Box>
              <Box sx={{ width: "100%", mt: 1 }}>
                {sortedTasks.length !== 0 && <Divider sx={{ my: 2 }} />}
              </Box>
            </motion.div>
          </Box>
        )}
        <Virtuoso
          useWindowScroll
          isScrolling={setIsScrolling}
          {...(!isMobile && { customScrollParent: scrollParentRef.current })}
          data={sortedTasks}
          itemContent={(_, task) => (
            <Task
              isAgenda
              isDateDependent={true}
              key={task.id}
              isScrolling={isScrolling}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutate={() => {}}
              mutateList={mutateList}
              task={task}
            />
          )}
        />
        <Box sx={{ height: { xs: "calc(130px + var(--sab))", sm: "10px" } }} />
      </Box>
    </Box>
  );
});
export default Column;

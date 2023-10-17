"use client";
import { containerRef } from "@/app/(app)/container";
import { ErrorHandler } from "@/components/Error";
import { Task } from "@/components/Tasks/Task";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { view } = params as any;

  const scrollParentRef = useRef();
  const isMobile = useMediaQuery("(max-width: 600px)");

  //   IDFK WHY THIS HAPPENS!?
  const key = useMemo(() => {
    if (view) {
      return [
        "property/tasks/stream",
        { view, time: new Date().toISOString() },
      ];
    }
    return null;
  }, [view]);

  const { data, mutate, error } = useSWR(key);

  return (
    <Box
      sx={{
        maxWidth: "500px",
        px: { sm: 2 },
        mx: "auto",
        mt: { xs: 15, sm: 10 },
      }}
    >
      <Box sx={{ px: { xs: 3, sm: 0 } }}>
        <Typography variant="h2" className="font-heading">
          {view}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.6 }}>
          {data?.length || 0} items
        </Typography>
      </Box>
      {error && <ErrorHandler callback={mutate} />}
      {data ? (
        <Virtuoso
          useWindowScroll
          customScrollParent={
            isMobile ? containerRef.current : scrollParentRef.current
          }
          data={data}
          itemContent={(_, task) => (
            <Task
              isAgenda
              isDateDependent={true}
              key={task.id}
              isScrolling={false}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutate={() => {}}
              mutateList={(updatedTask) => {
                if (!updatedTask) return mutate();
                mutate(
                  (oldData: any) =>
                    oldData.map((_task) => {
                      if (_task.id === updatedTask.id) return updatedTask;
                      return _task;
                    }),
                  {
                    revalidate: false,
                  }
                );
              }}
              task={task}
            />
          )}
        />
      ) : (
        <Box sx={{ px: 3, display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
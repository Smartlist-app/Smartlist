import { Box, Skeleton } from "@mui/material";
import React from "react";
import { useApi } from "../../../hooks/useApi";
import { ErrorHandler } from "../../Error";
import { Column } from "./Column";
import { CreateColumn } from "./Column/Create";

function Renderer({ data, url, board }) {
  return (
    <>
      {data &&
        data.map((column) => (
          <Column
            key={column.id}
            tasks={
              /**
               * Return all tasks in boards, which contain columns containing tasks
               */
              data.map((column) => column.tasks).flat()
            }
            checkList={board.columns.length == 1}
            mutationUrl={url}
            boardId={board.id}
            column={column}
          />
        ))}
    </>
  );
}

export const Board = React.memo(function Board({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  return (
    <Box
      sx={{
        pb: 2,
        ml: { sm: -1 },
      }}
    >
      <Box sx={{ overflowX: "scroll" }}>
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your tasks" />
        )}
        <Box
          sx={{
            mt: 4,
            maxWidth: "100vw",
            pl: data && board.columns.length === 1 ? 0 : 4,
            pr: data ? 0 : 4,
          }}
        >
          <Box
            sx={{
              ...(board.columns.length !== 1
                ? {
                    display: "flex",
                    gap: "10px",
                  }
                : {
                    mt: -3,
                  }),
            }}
          >
            <Renderer data={data} url={url} board={board} />
            {data ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mx: 2,
                  flexDirection: "column",
                }}
              >
                {board.columns.length !== 1 && data.length < 5 && (
                  <CreateColumn id={board.id} mutationUrl={url} />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

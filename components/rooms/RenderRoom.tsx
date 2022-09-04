import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useState } from "react";
import type { Item } from "../../types/item";
import { Header } from "./Header";
import { ItemCard } from "./ItemCard";
import { Toolbar } from "./Toolbar";

export function RenderRoom({ data, index }: any) {
  const router = useRouter();
  const [items, setItems] = useState(data);
  const [updateBanner, setUpdateBanner] = useState(false);
  global.setUpdateBanner = setUpdateBanner;

  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header
        room={index}
        itemCount={data.length}
        useAlias={router.query.custom}
      />
      <Toolbar
        room={router.query.custom ? decode(index).split(",")[0] : index}
        alias={router.query.custom ? decode(index).split(",")[1] : index}
        items={items}
        setItems={setItems}
        data={data}
      />
      {updateBanner ===
        (router.query.custom ? decode(index).split(",")[0] : index) && (
        <Box
          sx={{
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 15%)"
                : "rgba(200,200,200,.4)",
            borderRadius: 5,
            p: 3,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>New items have been added to this room.</Typography>
          <Button
            sx={{ ml: "auto", borderWidth: "2px!important", borderRadius: 4 }}
            variant="outlined"
            onClick={() => {
              setUpdateBanner(false);
              fetch(
                "/api/property/inventory/list?" +
                  new URLSearchParams({
                    propertyId: global.property.id,
                    accessToken: global.property.accessToken,
                    room: router.query.custom
                      ? decode(index).split(",")[0]
                      : index,
                  }),
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  setItems([]);
                  setTimeout(() => {
                    setItems(res.data);
                  }, 10);
                });
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Show&nbsp;changes&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          mr: {
            sm: -2,
          },
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          {items.length === 0 ? (
            <Paper
              sx={{
                boxShadow: 0,
                p: 0,
                width: "calc(100% - 15px)!important",
                textAlign: "center",
                mb: 2,
              }}
              key={"_noItems"}
            >
              <Card
                sx={{
                  mb: 2,
                  background: "rgba(200,200,200,.3)",
                  borderRadius: 5,
                  p: 3,
                }}
              >
                <CardContent>
                  <picture>
                    <img
                      alt="No items found"
                      src="https://ouch-cdn2.icons8.com/Hj-wKD-6E5iYnxo_yY-janABxscaiw4DWw7PW6m3OnI/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODQ0/LzAzNjE5YWJjLWQ0/ZTQtNGUyMi04ZTli/LWQ2NTliY2M2ZGE3/OC5zdmc.png"
                      style={{ width: "200px", maxWidth: "100%" }}
                    />
                  </picture>
                  <Typography
                    variant="h5"
                    sx={{
                      mt: 1,
                    }}
                  >
                    No items found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      gap: "10px",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    Try clearing any filters.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          ) : null}

          {items.map((item: Item, key: number) => (
            <div key={key.toString()}>
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      </Box>
    </Container>
  );
}

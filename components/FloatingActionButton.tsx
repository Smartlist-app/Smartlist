import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { blue } from "@mui/material/colors";
import AddPopup from "./AddPopup";

export function FloatingActionButton() {
	return (
		<Box
			sx={{
				position: "fixed",
				bottom: {
					lg: "15px",
					sm: "70px",
					md: "15px",
					xs: "70px"
				},
				right: "15px"
			}}
		>
			<AddPopup>
				<Fab
					variant="extended"
					color="primary"
					aria-label="add"
					sx={{
						borderRadius: "20px",
						textTransform: "none",
						px: 3,
						boxShadow: 0,
						fontSize: "15px",
						background: blue[200],
						color: blue[900],
						"&:hover": {
							background: blue[300]
						},
						py: 2,
						height: "auto",
						maxHeight: "auto"
					}}
				>
					<span
						class="material-symbols-rounded"
						style={{ marginRight: "15px" }}
					>
						add
					</span>
					Create
				</Fab>
			</AddPopup>
		</Box>
	);
}

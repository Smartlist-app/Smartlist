import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

function CreateRoom() {
	const [open, setOpen] = React.useState(false);

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	return (
		<>
			<ListItemButton
				sx={{ pl: 4, borderRadius: "0 40px 40px 0" }}
				onClick={toggleDrawer(true)}
			>
				<ListItemIcon>
					<span class="material-symbols-rounded">add_location_alt</span>
				</ListItemIcon>
				<ListItemText primary="Create room" />
			</ListItemButton>
			<SwipeableDrawer
				anchor="bottom"
				PaperProps={{
					sx: {
						width: {
							sm: "50vw"
						},
						borderRadius: "40px 40px 0 0",
						mx: "auto"
					}
				}}
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				ModalProps={{
					keepMounted: true
				}}
			>
				<DialogTitle sx={{ mt: 2, textAlign: "center" }}>
					Create list
				</DialogTitle>
				<Box sx={{ p: 3 }}>
					<TextField
						inputRef={(input) => setTimeout(() => input && input.focus(), 100)}
						margin="dense"
						label="Room name"
						fullWidth
						autoComplete={"off"}
						name="name"
						variant="filled"
					/>

					<LoadingButton
						sx={{ mt: 1, float: "right" }}
						color="primary"
						type="submit"
						loading={false}
						// onClick={() => setTimeout(setClickLoading, 10)}
						variant="rounded"
					>
						Create
					</LoadingButton>
					<Button
						sx={{ mt: 1, mr: 1, float: "right" }}
						color="primary"
						type="button"
						onClick={() => {
							// setLoading(false);
							// setOpen(false);
						}}
					>
						Back
					</Button>
				</Box>
			</SwipeableDrawer>
		</>
	);
}

const ListItem = React.memo(function ListItem({
	href = "/dashboard",
	asHref = "/dashboard",
	text,
	icon
}: any) {
	const router = useRouter();
	if (!router.asPath) router.asPath = "/dashboard";
	return (
		<Link href={href} as={asHref} replace>
			<ListItemButton
				sx={{
					pl: 4,
					borderRadius: "0 20px 20px 0",
					...(router.asPath === asHref && {
						backgroundColor: blue[50],
						transition: "all .2s",
						color: blue[800],
						"&:hover": {
							backgroundColor: blue[100],
							color: blue[900]
						},
						"& svg": {
							transition: "all .2s"
						},
						"&:hover svg": {
							color: blue[700] + "!important"
						}
					})
				}}
			>
				<ListItemIcon
					sx={{
						...(router.asPath === asHref && {
							color: blue[500]
						})
					}}
				>
					{icon}
				</ListItemIcon>
				<ListItemText primary={text} />
			</ListItemButton>
		</Link>
	);
});

export function DrawerListItems({ handleDrawerToggle, customRooms }: any) {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<List
			sx={{ width: "100%" }}
			component="nav"
			aria-labelledby="nested-list-subheader"
		>
			<Box
				sx={{
					display: {
						xs: "none",
						sm: "block"
					},
					pt: 2
				}}
			>
				<Toolbar />
			</Box>
			<div onClick={handleDrawerToggle}>
				<ListSubheader sx={{ pl: 2 }}>Home</ListSubheader>
				<ListItem
					text="Overview"
					icon={<span class="material-symbols-rounded">home</span>}
				/>
				<ListItem
					href="/finances"
					asHref="/finances"
					text="Finances"
					icon={<span class="material-symbols-rounded">payments</span>}
				/>
				<ListItem
					asHref="/meals"
					href="/meals"
					text="Meals"
					icon={<span class="material-symbols-rounded">lunch_dining</span>}
				/>
				{/* <ListItem href="/meals" text="Eco-friendly tips" icon={<SpaIcon />} /> */}
			</div>
			<div onClick={handleDrawerToggle}>
				<ListSubheader sx={{ pl: 2 }}>Rooms</ListSubheader>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/kitchen"
					text="Kitchen"
					icon={<span class="material-symbols-rounded">microwave</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/bedroom"
					text="Bedroom"
					icon={<span class="material-symbols-rounded">bedroom_parent</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/bathroom"
					text="Bathroom"
					icon={<span class="material-symbols-rounded">bathroom</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/garage"
					text="Garage"
					icon={<span class="material-symbols-rounded">bathroom</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/dining"
					text="Dining room"
					icon={<span class="material-symbols-rounded">dining</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/living-room"
					text="Living room"
					icon={<span class="material-symbols-rounded">living</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/laundry-room"
					text="Laundry room"
					icon={
						<span class="material-symbols-rounded">local_laundry_service</span>
					}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/storage-room"
					text="Storage room"
					icon={<span class="material-symbols-rounded">inventory_2</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/camping"
					text="Camping"
					icon={<span class="material-symbols-rounded">landscape</span>}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/garden"
					text="Garden"
					icon={<span class="material-symbols-rounded">yard</span>}
				/>
			</div>

			<ListItemButton
				onClick={handleClick}
				sx={{ borderRadius: "0 40px 40px 0" }}
			>
				<ListItemIcon>
					<span class="material-symbols-rounded">add_location</span>
				</ListItemIcon>
				<ListItemText primary="More rooms" />
				<span class="material-symbols-rounded">
					{open ? "expand_less" : "expand_more"}
				</span>
			</ListItemButton>
			<Collapse
				in={open}
				timeout="auto"
				unmountOnExit
				onClick={handleDrawerToggle}
			>
				<List component="div" disablePadding>
					{customRooms}
					<CreateRoom />
				</List>
			</Collapse>
			<ListSubheader component="div" id="nested-list-subheader" sx={{ pl: 2 }}>
				Other
			</ListSubheader>
			<ListItem
				text="Home maintenance"
				icon={<span class="material-symbols-rounded">label</span>}
			/>
			<ListItem
				href="/starred"
				asHref="/starred"
				text="Starred items"
				icon={<span class="material-symbols-rounded">star</span>}
			/>
			<ListItem
				href="/trash"
				asHref="/trash"
				text="Trash"
				icon={<span class="material-symbols-rounded">delete</span>}
			/>
		</List>
	);
}

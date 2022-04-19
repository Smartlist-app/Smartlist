import React, { useState } from "react";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import QRCode from "react-qr-code";

export function QrCodeModal({ title, quantity }: any): JSX.Element {
	const [open, setOpen] = useState(false);
	const [qrText, setQrText] = useState(
		`I have ${quantity.trim()} ${title.toLowerCase().trim()} in my inventory`
	);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const stopPropagationForTab = (event: any) => {
		if (event.key !== "Esc") {
			event.stopPropagation();
		}
	};

	return (
		<>
			<MenuItem disableRipple onClick={handleClickOpen}>
				<QrCodeScannerIcon />
				Generate QR code
			</MenuItem>
			<Dialog
				onKeyDown={stopPropagationForTab}
				open={open}
				onClose={handleClose}
				sx={{
					backdropFilter: "blur(10px)",
					transition: "all .2s"
				}}
				PaperProps={{
					sx: {
						borderRadius: "28px"
					}
				}}
			>
				<DialogTitle>QR code</DialogTitle>
				<DialogContent sx={{ textAlign: "center" }}>
					<TextField
						autoFocus
						margin="dense"
						autoComplete={"off"}
						id="name"
						type="text"
						fullWidth
						label="QR code content"
						defaultValue={qrText}
						onChange={(e) => setQrText(e.target.value)}
						sx={{ mt: 1, mb: 2 }}
					/>
					<QRCode value={qrText} />
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						disableElevation
						size="large"
						sx={{ borderRadius: 99, textTransform: "none", px: 3, py: 1 }}
						onClick={handleClose}
					>
						Download
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

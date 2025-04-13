import React, { useState, useRef } from "react";
import {
  Card,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Autocomplete, TextField, Snackbar, Alert } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import NameTag from "./NameTag";

const fetchChattableList = async (sender) => {
  console.log("enter fetchChattableList()");
  const url = `${
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"
  }/api/chat/chatTables?username=${sender}`;
  try {
    const res = await fetch(url, { mode: "cors" });
    const data = await res.json();
    console.log("fetched chattable list:", data);
    return data;
  } catch (error) {
    console.error("Error fetching chattable list:", error);
    return [];
  }
};

const PanelHeader = ({ sender, setRecipient, socket }) => {
  const [open, setOpen] = useState(false);
  const [chattables, setChattables] = useState([]);
  const [alertVisibility, setAlertVisibility] = useState(false);

  const handleClickOpen = async () => {
    const list = await fetchChattableList(sender);
    setChattables(list);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlertVisibility(false);
  };

  const formRef = useRef();

  const handleConfirm = () => {
    const target = formRef.current?.value;
    if (target && chattables.includes(target)) {
      socket.emit("leaveRoom");
      setRecipient(target);
      setOpen(false);
      setAlertVisibility(false);
    } else {
      setAlertVisibility(true);
    }
  };

  const handleAlertClose = () => {
    setAlertVisibility(false);
  };

  return (
    <>
      <Card square style={{ minHeight: "10%" }}>
        <Grid container justifyContent="center" alignItems="center">
          <NameTag name={sender} />
          <IconButton aria-label="compose" onClick={handleClickOpen}>
            <RateReviewIcon color="warning" />
          </IconButton>
        </Grid>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Search user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Search the name of recipient to open a new chatroom and start
            chatting!
          </DialogContentText>
          <Autocomplete
            id="autocomplete_search"
            freeSolo
            options={chattables}
            renderInput={(params) => (
              <TextField
                inputRef={formRef}
                {...params}
                label="Search whom to chat with..."
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Chat now!</Button>
        </DialogActions>

        <Snackbar
          open={alertVisibility}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleAlertClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Cannot find that user. Please select a valid username.
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  );
};

export default PanelHeader;
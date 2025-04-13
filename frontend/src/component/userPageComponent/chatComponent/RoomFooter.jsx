import React from "react";
import { TextField, Button, Card, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  messageInput: {
    flex: 1,
  },
  sendButton: {
    margin: "0 2em",
  },
});

const RoomFooter = ({ sendMessage, newMessage, setNewMessage }) => {
  const classes = useStyles();

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card
      square
      style={{
        display: "flex",
        width: "100%",
        minHeight: "10%",
        position: "absolute",
        bottom: 0,
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <TextField
          className={classes.messageInput}
          id="message"
          label="Message"
          placeholder="Type here..."
          variant="outlined"
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={3}
        />
        <Button
          disabled={!newMessage.trim()}
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          className={classes.sendButton}
        >
          Send
        </Button>
      </Grid>
    </Card>
  );
};

export default RoomFooter;
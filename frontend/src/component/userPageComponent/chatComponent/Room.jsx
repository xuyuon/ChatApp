import React, { useRef, useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useChatRoom from "./useChatRoom";
import MsgBubble from "./MsgBubble";
import RoomHeader from "./RoomHeader";
import RoomFooter from "./RoomFooter";

const useStyles = makeStyles({
  roomContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  messageContainer: {
    overflowY: "auto",
    height: "80%",
  },
});

const Room = ({ sender, recipient, socket }) => {
  const classes = useStyles();
  const { messages, sendMessage } = useChatRoom(sender, recipient, socket);
  const [newMessage, setNewMessage] = useState("");
  const messageRef = useRef();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Paper elevation={8} className={classes.roomContainer}>
      <RoomHeader recipient={recipient} />
      <div className={classes.messageContainer}>
        <MsgBubble msgList={messages} />
        <div ref={messageRef}></div>
      </div>
      {recipient && (
        <RoomFooter
          sendMessage={sendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
        />
      )}
    </Paper>
  );
};

export default Room;
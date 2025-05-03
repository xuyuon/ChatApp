import React, { useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { SocketContext } from "./Socket";

import Room from "./chatComponent/Room";
import Panel from "./chatComponent/Panel";


// Styling
const useStyles = makeStyles({
  pageContainer: {
    position: "relative",
    top: "5vh",
    left: "50px",
    borderStyle: "solid",
    borderColor: "green",

    display: "flex",
    flex: 1,
    width: "70vw",
    height: "90vh",
    backgroundColor: "#263238",
  },
});

const ChatPage = ({ sender }) => {
  const classes = useStyles();
  const socket = useContext(SocketContext);
  // A state to store the name of target that the actioner is chatting with
  const [recipient, setRecipient] = useState("");

  return (
    
    <div className={classes.pageContainer}>
      {
        /*  
          Panel shows the list of users (aka recipient) that the actioner (aka sender) has chatted with,
          or allow the actioner to choose new target to chat with.
          Pass states as props so subcomponents can access to those states globally.
        */
        <Panel sender={sender} setRecipient={setRecipient} socket={socket} />
      }

      {
        /*
          Room is the chatroom area, which shows the current chatting target on the top,
          the messages exchange in the middle,
          and the input tools (e.g. Emoji picker and image uploader) and textbox to receive user input.
          Pass states as props so subcomponents can access to those states globally.
        */
        <Room sender={sender} recipient={recipient} socket={socket} />
      }
    </div>
  );
};

export default ChatPage;

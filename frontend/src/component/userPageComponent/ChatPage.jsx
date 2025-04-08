import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { io } from "socket.io-client";

// import Room from "./chatComponent/Room";
// import Panel from "./chatComponent/Panel";

// Connect to web socket
const SOCKET_SERVER_URL = "http://" + window.location.hostname + ":3030";
const socket = io(SOCKET_SERVER_URL);
console.log("Connect to socket", socket);

// Styling
const useStyles = makeStyles({
  pageContainer: {
    position: "relative",
    top: "5vh",
    left: "350px",
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
  // A state to store the name of target that the actioner is chatting with
  const [recipient, setRecipient] = useState("");

  return (
    <div className={classes.pageContainer}>
      {
        // <Panel sender={sender} setRecipient={setRecipient} socket={socket} />
      }

      {
        // <Room sender={sender} recipient={recipient} socket={socket} />
      }
    </div>
  );
};

export default ChatPage;

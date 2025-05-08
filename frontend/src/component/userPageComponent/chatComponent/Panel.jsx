/**
 * Chat panel displaying a list of users the sender has chatted with.
 * Allows selecting a recipient to initiate a conversation
 */

import React from "react";
import { Card, CardActionArea, Box } from "@mui/material";
import { makeStyles } from '@mui/styles'
import PanelHeader from "./PanelHeader";
import usePanel from "./usePanel.jsx";
import NameTag from "./NameTag";
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles({
  panelContainer: {
    width: "25%",
    height: "100%",
    position: "relative",
  },
  recipientContainer: {
    height: "90%",
    overflowY: "auto",
  },
});


const Panel = ({ sender, setRecipient, socket }) => {
  const classes = useStyles();

  const { nameList, isLoading } = usePanel(sender, socket);

  const handleClick = (name) => {
    console.log("Setting recipient to:", name);
    socket.emit("leaveRoom");
    setRecipient(name);
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Card square className={classes.panelContainer}>
      <PanelHeader
        sender={sender}
        setRecipient={setRecipient}
        socket={socket}
      />
      {
        // Panel body
        <div className={classes.recipientContainer}>
          {nameList.map((name, i) => (
            <CardActionArea
              key={name}
              onClick={() => handleClick(name)}
            >
              <NameTag name={name} />
            </CardActionArea>
          ))}
        </div>
      }
    </Card>
  );
};

export default Panel;

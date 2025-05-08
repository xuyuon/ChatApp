/**
 * Custom hook for managing a panel of chatted users.
 * Fetches and updates the list of users a sender has chatted with using socket communication.
 */

import { useEffect, useState } from "react";

const usePanel = (sender, socket) => {
  const [nameList, setNameList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Emitting reqChatted for", sender);
    socket.emit("reqChatted", sender);

    const handleChattedUser = (obj) => {
      console.log("Received chattedUser:", obj);
      setNameList(obj);
      setIsLoading(false);
    };

    socket.on("chattedUser", handleChattedUser);

    return () => {
      socket.off("chattedUser", handleChattedUser);
    };
  }, [socket, sender]);

  return { nameList, isLoading };
};

export default usePanel;
import { useEffect, useState } from "react";

const usePanel = (sender, socket) => {
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    console.log("Emitting reqChatted for", sender);
    socket.emit("reqChatted", sender);

    socket.on("chattedUser", (obj) => {
      console.log("Received chattedUser:", obj);
      setNameList(obj);
    });

    return () => {
      socket.off("chattedUser");
    };
  }, [socket, sender]);

  return { nameList };
};

export default usePanel;
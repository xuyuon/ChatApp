import { useEffect, useState } from "react";

const usePanel = (sender, socket) => {
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chattedUser", (obj) => {
      setNameList(obj);
    });

    return () => {
      socket.off("chattedUser");
    };
  }, [socket]);

  return { nameList };
};

export default usePanel;
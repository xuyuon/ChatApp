import { useEffect, useState } from "react";

const NEW_MESSAGE_EVENT = "newMessageEvent";

function nowFormattedString() {
  const now = new Date();
  const offsetToUTC = now.getTimezoneOffset() * 60 * 1000;
  const nowWithOffset = now - offsetToUTC;
  const newNow = new Date(nowWithOffset);
  return newNow.toISOString().replace("T", " ").slice(0, -5);
}

const useChatRoom = (msgSender, msgRecipient, socket) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket || !msgSender || !msgRecipient) return;

    console.log(
      `join Room and fetch history between "${msgSender}" and "${msgRecipient}"`
    );
    console.log(`socket id of "${msgSender}"(sender) is`, socket.id);

    socket.emit("joinRoom", [msgSender, msgRecipient]);
    socket.emit("reqChatted", msgSender);

    socket.on("chatHistory", (res) => {
      const formattedMessages = res.map((item) => ({
        ...item,
        isSender: item.sender === msgSender,
      }));
      setMessages(formattedMessages);
    });

    return () => {
      socket.emit("leaveRoom");
    };
  }, [msgSender, msgRecipient, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on(NEW_MESSAGE_EVENT, (message) => {
      console.log("received", message);
      const incomingMessage = {
        ...message,
        isSender: message.sender === msgSender,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socket.off(NEW_MESSAGE_EVENT);
    };
  }, [msgSender, socket]);

  const sendMessage = (messageBody) => {
    if (!messageBody.trim()) return;
    console.log("sending msg, time now is", new Date());
    socket.emit(NEW_MESSAGE_EVENT, {
      sender: msgSender,
      recipient: msgRecipient,
      message: messageBody,
      sendTime: nowFormattedString(),
    });
  };

  return { messages, sendMessage };
};

export default useChatRoom;
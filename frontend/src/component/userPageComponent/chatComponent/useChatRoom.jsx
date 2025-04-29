import { useEffect, useState } from "react";

const NEW_MESSAGE_EVENT = "newMessageEvent";

function nowFormattedString() {
  const now = new Date();
  return now.toISOString(); // Use ISO format for timeSent
}

const useChatRoom = (msgSender, msgRecipient, socket) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket || !msgSender || !msgRecipient) return;

    console.log(
      `join Room and fetch history between "${msgSender}" and "${msgRecipient}"`
    );
    console.log(`socket id of "${msgSender}"(sender) is`, socket.id);

    // Emit joinRoom with sender and recipient usernames
    socket.emit("joinRoom", [msgSender, msgRecipient]);
    socket.emit("reqChatted", msgSender);

    // Handle chat history from backend
    socket.on("chatHistory", (res) => {
      const formattedMessages = res.map((item) => ({
        content: item.content,
        sender_id: item.sender_id,
        receiver_id: item.receiver_id,
        timeSent: item.timeSent,
        isSender: item.sender_id === msgSender, // Compare with sender username or ID
      }));
      setMessages(formattedMessages);
    });

    return () => {
      socket.emit("leaveRoom");
      socket.off("chatHistory");
    };
  }, [msgSender, msgRecipient, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on(NEW_MESSAGE_EVENT, (message) => {
      console.log("received", message);
      const incomingMessage = {
        content: message.content,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        timeSent: message.timeSent,
        isSender: message.sender_id === msgSender,
      };
      setMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      socket.off(NEW_MESSAGE_EVENT);
    };
  }, [msgSender, socket]);

  const sendMessage = (content) => {
    if (!content.trim()) return;
    console.log("sending msg, time now is", new Date());

    // Emit message with schema-compatible fields
    socket.emit(NEW_MESSAGE_EVENT, {
      sender_id: msgSender, // Username or ID, depending on backend
      receiver_id: msgRecipient, // Username or ID
      content: content,
      timeSent: nowFormattedString(),
    });
  };

  return { messages, sendMessage };
};

export default useChatRoom;
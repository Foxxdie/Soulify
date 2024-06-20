import React, { useEffect, useRef } from "react";

interface Message {
  sender: string;
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="overflow-y-auto text-black flex flex-col gap-y-2"
    >
      {messages.map((msg, index) => (
        <p
          key={index}
          className={`message  rounded-lg transition-colors duration-500 ${
            msg.sender === "Soul" ? "soul-message" : "user-message"
          }`}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
        >
          {msg.sender}: {msg.text}
        </p>
      ))}
    </div>
  );
};

export default ChatMessages;
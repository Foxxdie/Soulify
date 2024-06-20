"use client";
import React, { useState } from "react";
import { ArrowUpIcon, WindowIcon } from "@heroicons/react/16/solid";
import { Soul, SoulOpts } from "@opensouls/engine";
import ChatInput from "./ChatInput";

interface ChatFooterProps {
  soul: Soul | null;
  soulProps: SoulOpts;
  onSendMessage: (inputText: string) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ soul, soulProps, onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false); // State to manage focus

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const handleFocus = () => {
    setIsFocused(true); // Set focus state to true when focused
  };

  const handleBlur = () => {
    setIsFocused(false); // Set focus state to false when not focused
  };

  return (
    <>
      <div className="">
        <div className="hidden items-center justify-between md:flex">
        
          <div className="flex flex-row items-center gap-0">
            <ChatInput
              inputText={inputText}
              handleInputChange={handleInputChange}
              handleSend={handleSend}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function SoulDebuggerButton({ soul, soulProps }: { soul: Soul | null, soulProps: SoulOpts}) {

  const disableDebugger = !soul || soul?.soulId === undefined || process.env.NEXT_PUBLIC_SOUL_ENGINE_APIKEY === undefined;
  const openDebugger = () => {
    const url = `https://souls.chat/chats/${soulProps.organization}/${soulProps.blueprint}/${soul?.soulId}`;
    window.open(url, '_blank');
  }

  return (
    <button onClick={openDebugger}  disabled={disableDebugger}>
      <ArrowUpIcon />
    </button>
  );
}

export default ChatFooter;
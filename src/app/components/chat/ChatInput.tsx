import React from "react";

interface ChatInputProps {
  inputText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  handleInputChange,
  handleSend,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="flex items-center justify-between p-2">
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Talk..."
        className="text-md mr-2 min-w-96 flex-grow rounded-lg px-4 py-2 border border-gray-400 bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button 
        onClick={handleSend}
        className="border rounded p-2 py-1 text-white bg-black">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
"use client";

import React, { useState, useEffect } from "react";
import { Soul, SoulOpts, said, Events } from "@opensouls/soul";
import { ActionEvent } from "@opensouls/engine";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import { useSoulEngine } from "@/app/providers/SoulProvider";

export const SOUL_DEBUG = process.env.NEXT_PUBLIC_SOUL_ENGINE_DEV === 'true';

export const defaultSoul: SoulOpts = {
  soulId: process.env.NEXT_PUBLIC_SOUL_ENGINE_ID as string,
  blueprint: process.env.NEXT_PUBLIC_SOUL_ENGINE_BLUEPRINT as string,
  organization: process.env.NEXT_PUBLIC_SOUL_ENGINE_ORGANIZATION as string,
  token: SOUL_DEBUG ? process.env.NEXT_PUBLIC_SOUL_ENGINE_APIKEY : undefined,
  debug: SOUL_DEBUG,
}

interface Message {
  sender: string;
  text: string;
};

function ChatWithSoul() {
  const { doc, updateFile, getFileContent, initialSync } = useSoulEngine();
  const [messages, setMessages] = useState<Message[]>([]);
  const [soul, setSoul] = useState<Soul | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);


  useEffect(() => {
    console.log("doc: ", doc);
    console.log("initialSync: ", initialSync);
    // if (lastSync  initialSync) {
    //   return;
    // }

    if (isActive === false && initialSync === true) {
      setIsActive(true);
      // Create a new Soul instance
      const newSoul = new Soul(defaultSoul);
      setSoul(newSoul);

      // Connect to Soul
      console.log("connecting");

      const handleSays = async ({ content }: ActionEvent) => {
        const response = await content();
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Soul", text: response },
        ]);
      };

      newSoul
        .connect()
        .then(() => {
          newSoul.on("says", handleSays);

          // set up other events with soul.on("actionName",....)
        })
        .catch((error) => {
          console.error("Failed to connect to Soul:", error);
        });

      return () => {
        if (newSoul) {
          newSoul.off("says", handleSays);
          console.log('disconnected');
          newSoul.disconnect();
        }
      };
    }
    

  }, [doc]);

  useEffect(() => {
    if (soul && soul.connected) {
      soul.dispatch(said("User", "Hi!"))
        .catch((error) => {
          console.error("Failed to dispatch message:", error);
        });
    }
  }, [soul, soul?.connected]);

  // Function to handle sending a message
  const handleSendMessage = async (inputText: string) => {

    // Check if the Soul instance is started before dispatching a message
    if (soul && soul.connected) {
      try {
        await soul.dispatch(said("User", inputText));
        setMessages((prev) => ([...prev, { sender: "User", text: inputText }]));
      } catch (err) {
        console.error("Failed to dispatch message:", err);
      }
    } else {
      console.error("Soul is not connected. Cannot dispatch message.");
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-col p-4 h-full">
        <div className="grow">
          <ChatMessages messages={messages} />
        </div>
        <div className="shrink">
          <ChatFooter onSendMessage={handleSendMessage} soul={soul} soulProps={defaultSoul} />
        </div>
      </div>
    </div>
  );
}

export default ChatWithSoul;
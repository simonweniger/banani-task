"use client"

import { useState } from "react";
import { InputField } from "@/components/AIInputField";
import type { Message } from "@/types/messages";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("Messages", messages)

  const onSubmit = async (prompt: string) => {
    
    const userMessage: Message = {
        role: "user",
        content: {
            design: "",
            message: prompt,
        },
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messages }),
    });

    const newMessage = await res.json();

    console.log("result", newMessage)

    if (res.ok) {
      setMessages(prevMessages => [...prevMessages, newMessage.result]);
    } else {
      console.error(res);
    }
  };

  return (
    <div className="space-y-8 min-w-[350px] max-w-7">
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
            {msg.content?.message}
          </div>
        ))}
        <InputField
          onSubmit={onSubmit}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}

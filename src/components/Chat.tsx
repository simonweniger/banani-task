"use client"

import { useState } from "react";
import { InputField } from "@/components/AIInputField";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  const simulateResponse = async (message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setMessages((prev) => [...prev, message]);
  };
  return (
    <div className="space-y-8 min-w-[350px]">
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
            {msg}
          </div>
        ))}
        <InputField
          onSubmit={simulateResponse}
          loadingDuration={3000}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}

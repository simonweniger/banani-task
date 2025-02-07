"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { InputField } from "@/components/AIInputField";
import type { Message } from "@/types/messages";
import GenTable from "./GenTable";
import { cn } from "@/lib/utils";

export default function DesignCanvas() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastDesign = messages.length > 0 ? messages[messages.length - 1].content.design : "";

  console.log("Messages", messages);

  const onSubmit = async (prompt: string) => {
    const userMessage: Message = {
      role: "user",
      content: {
        design: "",
        message: prompt,
      },
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
      });

      const newMessage = await res.json();

      if (res.ok) {
        setMessages((prevMessages) => [...prevMessages, newMessage.result]);
      } else {
        console.error(res);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative itesm-center justify-center w-full h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl mx-auto p-6 rounded-lg"
          >
            <motion.div
              className="w-full h-64 bg-gradient-to-r from-primary/5 via-muted/50 to-primary-10 rounded-lg border"
              animate={{
                backgroundPosition: ["200% 50%", "-200% 50%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        ) : (
          lastDesign && (
            <motion.div
              key="table"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <GenTable tableProps={lastDesign} />
            </motion.div>
          )
        )}
      </AnimatePresence>

      <div className={cn(lastDesign || messages.length >= 1 ? "fixed bottom-0 left-0 right-0 p-4 flex justify-center" : "fixed top-64 left-0 right-0 p-4 flex justify-center")}>
        <div className="w-full max-w-2xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <h1 className="text-3xl w-full text-center">
                banani table generator
              </h1>
            )}
            <AnimatePresence>
              {messages.slice(-3).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-black/5 dark:bg-white/5 rounded-lg"
                >
                  {msg.content?.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <InputField onSubmit={onSubmit} placeholder="Type a message..." />
        </div>
      </div>
    </div>
  );
}

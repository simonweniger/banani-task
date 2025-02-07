"use client";

import { useState, useEffect, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useResizeTextarea } from "@/hooks/use-resize-textarea";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  loadingDuration?: number;
  thinkingDuration?: number;
  onSubmit: (value: string) => void | Promise<void>;  // simplified prop type
  className?: string;
  autoAnimate?: boolean;
}

export function InputField({
  id = "ai-input",
  placeholder = "What table can I create for you?",
  minHeight = 56,
  maxHeight = 200,
  onSubmit,
  className,
  autoAnimate = false,
}: AIInputWithLoadingProps) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(autoAnimate);

  const { textareaRef, adjustHeight } = useResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleSubmit = async () => {
    if (!inputValue.trim() || submitted) return;

    setSubmitted(true);
    await onSubmit(inputValue.trim());
    setInputValue("");
    adjustHeight(true);

    setTimeout(() => {
      setSubmitted(false);
    });
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-start flex-col gap-2">
        <div className="relative max-w-xl w-full mx-auto">
          <Textarea
            id={id}
            placeholder={placeholder}
            className={cn(
              "max-w-xl w-full rounded-3xl pl-6 pr-10 py-4",
              "resize-none text-wrap leading-[1.2]",
              `min-h-[${minHeight}px]`
            )}
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            disabled={submitted}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-xl py-1 px-1",
              submitted ? "bg-none" : "bg-black/5 dark:bg-white/5"
            )}
            type="button"
            disabled={submitted}
          >
            {submitted ? (
              <div
                className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin transition duration-700"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <span
                className={cn(
                  "material-symbols-rounded transition-opacity",
                  inputValue ? "opacity-100" : "opacity-30"
                )}
              >
                play_arrow
              </span>
            )}
          </button>
        </div>
      </div>
      <p className="pl-4 h-4 text-xs mx-auto text-black/70 dark:text-white/70">
        {submitted ? "AI is thinking..." : "Ready to submit!"}
      </p>
    </div>
  );
}

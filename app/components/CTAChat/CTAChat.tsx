"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CTAChat.module.css";
import { CircleArrowOutUpRight } from "lucide-react";

const CTAChat = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      router.push(`/chatbot?message=${encodeURIComponent(message)}`);
    }
  };

  return (
    <form className={styles.chatInput} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Plan your career now..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">
        <CircleArrowOutUpRight />
      </button>
    </form>
  );
};

export default CTAChat;

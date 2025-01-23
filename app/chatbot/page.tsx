"use client";

import React, { useEffect, useState } from "react";
import Chat from "../components/Chat/Chat";
import { useRouter, useSearchParams } from "next/navigation";

const ChatbotPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message") || "";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to access the chatbot.");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user details.");
        }

        setUserDetails(data.user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchUserDetails();
  }, [router]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Chat initialMessage={initialMessage} userDetails={userDetails} />
    </>
  );
};

export default ChatbotPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState(""); // Changed from username to fullName
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, password }), // Changed from username to fullName
      });

      console.log(fullName, email, password); // Changed from username to fullName

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      alert("Signup successful!");
      setEmail("");
      setFullName(""); // Changed from setUsername to setFullName
      setPassword("");

      router.push("/dashboard");
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Sign Up</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name" // Changed from Username to Full Name
          value={fullName} // Changed from username to fullName
          onChange={(e) => setFullName(e.target.value)} // Changed from setUsername to setFullName
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <span className={styles.login}>
          Already have an account? <Link href="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;

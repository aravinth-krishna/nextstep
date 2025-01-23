"use client";

import React from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import styles from "./NavBar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>NextStep</div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/#about">About</Link>
        </li>
        <li>
          <Link href="/chatbot">Chatbot</Link>
        </li>
        <li>
          <Link href="/resume">Resume Review</Link>
        </li>
        <li>
          <Link href="/interviews">Mock Interviews</Link>
        </li>
      </ul>
      <div className={styles.rightSection}>
        <Link href="/login" className={styles.loginLink}>
          LOGIN
        </Link>
        <Link className={styles.profileIcon} href={"/dashboard"}>
          <FaUserCircle size={30} />
        </Link>
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

const Dashboard = () => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceData, setExperienceData] = useState<Experience[]>([
    {
      id: "",
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setExperienceData((prevData) =>
      prevData.map((exp, i) => (i === index ? { ...exp, [name]: value } : exp))
    );
  };

  const handleAddExperience = () => {
    setExperienceData((prevData) => [
      ...prevData,
      {
        id: "",
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperienceData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to submit your profile.");
        return;
      }

      const payload = {
        fullName,
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
        experience: experienceData,
      };

      console.log("Submitting payload:", payload);

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit profile.");
      }

      alert("Profile submitted successfully!");
      setFullName("");
      setBio("");
      setSkills("");
      setExperienceData([
        {
          id: "",
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Your Dashboard</h1>
      <p>Fill out the form below to provide your career-related information.</p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="fullName" className={styles.label}>
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label htmlFor="bio" className={styles.label}>
            Bio:
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <div>
          <label htmlFor="skills" className={styles.label}>
            Skills (comma separated):
          </label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {experienceData.map((exp, index) => (
          <div key={index} className={styles.experienceSection}>
            <div>
              <label htmlFor={`title-${index}`} className={styles.label}>
                Job Title:
              </label>
              <input
                type="text"
                id={`title-${index}`}
                name="title"
                value={exp.title}
                onChange={(e) => handleExperienceChange(e, index)}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor={`company-${index}`} className={styles.label}>
                Company:
              </label>
              <input
                type="text"
                id={`company-${index}`}
                name="company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(e, index)}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor={`startDate-${index}`} className={styles.label}>
                Start Date:
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(e, index)}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor={`endDate-${index}`} className={styles.label}>
                End Date (optional):
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                name="endDate"
                value={exp.endDate || ""}
                onChange={(e) => handleExperienceChange(e, index)}
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor={`description-${index}`} className={styles.label}>
                Job Description:
              </label>
              <textarea
                id={`description-${index}`}
                name="description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(e, index)}
                required
                className={styles.textarea}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveExperience(index)}
              className={styles.removeButton}
            >
              Remove Experience
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddExperience}
          className={styles.addButton}
        >
          Add Experience
        </button>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Submitting..." : "Submit Profile"}
        </button>
      </form>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

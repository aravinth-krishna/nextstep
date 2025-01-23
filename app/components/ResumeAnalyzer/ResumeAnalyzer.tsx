"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Groq from "groq-sdk";
import styles from "./ResumeAnalyzer.module.css";

// Ensure PDF.js worker is loaded
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ResumeAnalyzer() {
  const groq = new Groq({
    apiKey:
      process.env.GROQ_API_KEY ||
      "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",
    dangerouslyAllowBrowser: true,
  });

  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle file upload & extract text from PDF
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      try {
        const pdfData = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          extractedText += `Page ${i}:\n${pageText}\n\n`;
        }

        setResumeText(extractedText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    };
  };

  // Send resume & job description to AI for analysis
  async function analyzeResume() {
    if (!resumeText || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    const userMessage = `Analyze the following resume:\n\n${resumeText}\n\nBased on this job description:\n\n${jobDescription}\n\nIdentify skill gaps and suggest improvements.`;

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: userMessage }],
        model: "llama-3.3-70b-versatile",
      });

      const aiResponse =
        response.choices[0]?.message?.content || "No response received.";
      setAnalysis(aiResponse);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAnalysis("An error occurred while analyzing the resume.");
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1>Resume Analyzer & Skill Gap Detector</h1>

      <div className={styles.uploadSection}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
        />
      </div>

      <textarea
        className={styles.textArea}
        value={resumeText}
        rows={8}
        placeholder="Extracted resume text will appear here..."
        readOnly
      />

      <textarea
        className={styles.textArea}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={5}
        placeholder="Enter job description here..."
      />

      <button
        className={styles.button}
        onClick={analyzeResume}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <div className={styles.analysisSection}>
          <h2>Analysis & Skill Gaps</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}

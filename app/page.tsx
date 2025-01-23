import Image from "next/image";
import styles from "./page.module.css";
import CTAChat from "./components/CTAChat/CTAChat";
import CTAButton from "./components/CTAButton/CTAButton";
import {
  FaRegLightbulb,
  FaUserGraduate,
  FaCogs,
  FaChartLine,
} from "react-icons/fa";

export default function Page() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.leftSection}>
          <h1 className={styles.robotoFont}>
            Your Future, One Step Ahead with AI
          </h1>
          <span>
            From real-time feedback to personalized career paths, NextStep is
            your partner in professional growth.
          </span>
          <div className={styles.ctaSection}>
            <CTAButton />
            <CTAChat />
          </div>
        </div>

        <div className={styles.rightSection}>
          <Image
            src="/ai-career.png"
            alt="Hero Section Image"
            width={500}
            height={435}
          />
        </div>
      </div>

      <div id="about" className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>About NextStep</h2>
        <div className={styles.aboutPoints}>
          <div className={styles.point}>
            <FaRegLightbulb className={styles.icon} />
            <h3>Personalized Career Paths</h3>
            <p>
              Get tailored career advice and actionable steps to achieve your
              goals.
            </p>
          </div>
          <div className={styles.point}>
            <FaUserGraduate className={styles.icon} />
            <h3>Skill Development</h3>
            <p>
              Identify skill gaps and find the right resources to level up your
              expertise.
            </p>
          </div>
          <div className={styles.point}>
            <FaCogs className={styles.icon} />
            <h3>AI-Powered Insights</h3>
            <p>
              Receive real-time feedback and predictive insights to guide your
              professional journey.
            </p>
          </div>
          <div className={styles.point}>
            <FaChartLine className={styles.icon} />
            <h3>Career Tracking</h3>
            <p>
              Monitor your growth, track milestones, and visualize your career
              trajectory.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./register.module.css";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password }, handleReset);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const isFormValid =
    name.trim() !== "" || email.trim() !== "" || password.trim() !== "";

  return (
    <div className={styles.loginContainer}>
      <div className={styles.heroSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Sign Up</h2>
          <div className={styles.signupPrompt}>
            Already a member? <Link href="/login">Login.</Link>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Name</label>
              <div className={styles.inputWrapper}>
                <Image
                  src="/images/name.svg"
                  alt="Name"
                  width={20}
                  height={20}
                  className={styles.inputIcon}
                />
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <Image
                  src="/images/@.svg"
                  alt="Email"
                  width={20}
                  height={20}
                  className={styles.inputIcon}
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Image
                  src="/images/lock.svg"
                  alt="Password"
                  width={20}
                  height={20}
                  className={styles.inputIcon}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className={styles.icon} />
                  ) : (
                    <Eye className={styles.icon} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <svg className={styles.loader} viewBox="0 0 50 50">
                    <circle
                      className={styles.spinner}
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="4"
                    />
                  </svg>
                  Signing Up...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

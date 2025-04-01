"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";
import { EyeOff, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     const response= await login({ email, password }, handleReset);
     if (response?.user?.role === "admin") {
      router.push("/");
      toast.success("Login successful");
      window.location.reload();
    } else {
      toast.error("Access denied. Admin only.");
    }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setEmail("");
    setPassword("");
  };

  const isFormValid = email.trim() !== "" || password.trim() !== "";

  return (
    <section className={styles.formSection} aria-labelledby="login-heading">
      <div className={styles.formContainer}>
        <h1 id="login-heading" className={styles.title}>
          Login
        </h1>

        <p className={styles.signupText}>
          Are you a new member?{" "}
          <Link href="/register" className={styles.signupLink}>
            Sign up here.
          </Link>
        </p>

        <form
          className={styles.form}
          method="POST"
          onSubmit={handleSubmit}
          aria-label="Login Form"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Image
                src="/images/@.svg"
                alt="Email icon"
                width={20}
                height={20}
                className={styles.icon}
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="emmawatson@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-required="true"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Image
                src="/images/lock.svg"
                alt="Password icon"
                width={20}
                height={20}
                className={styles.icon}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-required="true"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.eyeToggleBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className={styles.loginBtn}
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
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <button
            type="reset"
            className={styles.resetBtn}
            disabled={!isFormValid || loading}
            onClick={handleReset}
          >
            Reset
          </button>
         
        </form>

        <div className={styles.footerLinks}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;

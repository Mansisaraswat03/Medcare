"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {FiUser } from "react-icons/fi";
import styles from "./navbar.module.css";
import { useAuthContext } from "@/context/authContext";

export default function Navbar() {
  const {logout, checkToken } = useAuth();
  const {auth_token} = useAuthContext()
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.link}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.png" alt="MedCare Logo" width={30} height={30} />
          MedCare
        </Link>
      </div>

      <div className="text-2xl text-gray-400">Admin Dashboard</div>

      <div className={styles.actions}>
        {auth_token ? (
          <div className={styles.profileContainer} ref={profileRef}>
            <button className={styles.profileBtn} onClick={toggleProfile} aria-label="Profile">
              <FiUser size={24} />
            </button>
            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <Link href="/profile" className={styles.dropdownItem}>Profile</Link>
                <button onClick={logout} className={styles.dropdownItem}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login">
              <button className={styles.loginBtn}>Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

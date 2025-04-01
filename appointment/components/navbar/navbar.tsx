"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import styles from "./navbar.module.css";

export default function Navbar() {
  const { token, logout, checkToken } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.link}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.png" alt="MedCare Logo" width={30} height={30} />
          MedCare
        </Link>

        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/appointments">Appointments</Link></li>
          <li><Link href="/doctors">Doctors</Link></li>
          <li><Link href="/reviews">Reviews</Link></li>
        </ul>
      </div>

      <div className={styles.actions}>
        {token ? (
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
            <Link href="/register">
              <button className={styles.registerBtn}>Register</button>
            </Link>
          </>
        )}

        <button className={styles.menuIcon} onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className={`${styles.sliderMenu} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.sliderHeader}>
          <Link href="/" className={styles.logo}>
            <Image src="/images/logo.png" alt="MedCare Logo" width={30} height={30} />
            MedCare
          </Link>
          <button onClick={toggleMenu} className={styles.closeIcon} aria-label="Close Menu">
            <FiX size={28} />
          </button>
        </div>

        <ul className={styles.sliderLinks}
        // onClick={toggleMenu}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("a")) {
            toggleMenu();
          }
        }}
        >
          <li><Link href="/">Home</Link></li>
          <li><Link href="/appointments">Appointments</Link></li>
          <li><Link href="/doctors">Doctors</Link></li>
          <li><Link href="/reviews">Reviews</Link></li>
          {
            !token && (
              <>
                <li><Link href="/register">Register</Link></li>
                <li><Link href="/login" >Login</Link></li>
              </>
            )
          }
        </ul>
      </div>
    </nav>
  );
}

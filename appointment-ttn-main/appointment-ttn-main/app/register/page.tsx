import SignupForm from "@/components/register/register-form";
import Image from "next/image";
import styles from '@/components/login/login.module.css'

export default function RegisterPage() {
    return (
        <main className={styles.pageWrapper}>
          <div className={styles.backgroundImage}>
            <Image
              src="/images/login-bg.png"
              alt="Healthcare items with a stethoscope, mint leaves, and pills on a desk"
              fill
              priority
              className={styles.bgImage}
            />
          </div>
          <SignupForm />
        </main>
      );                
}
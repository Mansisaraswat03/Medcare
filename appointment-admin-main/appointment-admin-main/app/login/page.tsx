import Image from 'next/image';
import styles from '@/components/login/login.module.css';
import Login from '@/components/login/login-form';

export default function LoginPage() {
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
      <Login/>
    </main>
  );
}

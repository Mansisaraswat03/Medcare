import styles from './hero.module.css';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.left}>
        <h1 className={styles.heading}>
          Health in Your <br /> Hands.
        </h1>
        <p className={styles.description}>
          Take control of your healthcare with CareMate. Book appointments with ease, explore health blogs, and stay on top of your well-being, all in one place.
        </p>
        <button className={styles.ctaButton}>Get Started</button>
      </div>
      <div className={styles.right}>
        <Image
          src="/images/hero-image.png"
          alt="Doctor with patient"
          width={600}
          height={400}
          className={styles.heroImage}
        />
      </div>
    </section>
  );
}

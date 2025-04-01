import styles from "./skeleton.module.css";

const DoctorSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.image}></div>
      <div className={styles.text}></div>
      <div className={styles.text}></div>
      <div className={styles.rating}></div>
    </div>
  );
};

export default DoctorSkeleton;

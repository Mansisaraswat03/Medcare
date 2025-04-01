import { DoctorCardProps } from '@/types/types';
import styles from './DoctorCard.module.css';
import Link from 'next/link';

const DoctorCard = ({ id,name, specialty, experience, rating, profile }: DoctorCardProps) => {
  return (
    <div className={styles.card}>
      <img
        src={profile}
        alt={name}
        className={styles.image}
      />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.specialty}>{specialty} · {experience} Years</p>
      <p className={styles.rating}>Ratings: {'⭐'.repeat(rating)}</p>
      <button className={styles.button}><Link href={`/book-appointment?doctorId=${id}`}>Book Appointment</Link></button>
    </div>
  );
};

export default DoctorCard;

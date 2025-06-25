"use client"
import Image from "next/image";
import styles from "./Volunteer.module.css";


interface Volunteer {
  name: string;
  image: string;
}

export default function Volunteer() {
  const volunteers: Volunteer[] = [
    { name: "Courage", image: "/pgc1.jpg" },
    { name: "Betty Polycarp", image: "/pgc2.jpg" },
    { name: "Sarah Ocheche", image: "/pgc3.jpg" },
    { name: "Agatha Ogbole", image: "/pgc4.jpg" },
  ];

  return (
    <section className={styles.volunteersSection}>
      <h2 className={styles.sectionTitle}>Team Member</h2>
      <h1 className={styles.mainTitle}>Our Expert Volunteer</h1>
      <div className={styles.volunteersGrid}>
        {volunteers.map((volunteer, index) => (
          <div key={index} className={styles.volunteerCard}>
              <Image
                src={volunteer.image}
                alt={volunteer.name}
                width={400} 
                height={260}
                className={styles.volunteerImage}
              />

            <h3 className={styles.volunteerName}>{volunteer.name}</h3>
            <p className={styles.volunteerRole}>Volunteer</p>
          </div>
        ))}
      </div>
    </section>
  )
}

'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

interface School {
  title: string;
  description: string;
  image: string;
}


const Gallery: React.FC = () => {
  const schools: School[] = [
    { title: 'Lady Victoria', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image: '/pgc1.jpg' },
    { title: 'Mother Victoria', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image:'/pgc2.jpg' },
    { title: 'Elite Secondary School', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image: '/pgc3.jpg' },
    { title: 'St Paul Secondary School', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image: '/pgc4.jpg' },
    { title: 'Courage', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image: '/pgc5.jpg' },
    { title: 'kfjkhjdk', description: 'Contrary to popular belief, Lorem ipsum is not simply random text.', image: '/pgc6.jpg' },
  ];

  return (
    <div className={styles.galleryContainer}>
      <section className={styles.schoolSection}>
        <h2 className={styles.sectionTitle}>Images Gallery</h2>
        <h1 className={styles.mainTitle}>Schools We&apos;ve Reached Out To</h1>
        <div className={styles.schoolGrid}>
          {schools.map((school, index) => (
            <div key={index} className={styles.schoolCard}>
              <Image
                src={school.image}
                alt={school.title}
                width={400}
                height={300}
                className={styles.schoolImage}
              />
              <h3 className={styles.schoolTitle}>{school.title}</h3>
              <p className={styles.schoolDescription}>{school.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Gallery;

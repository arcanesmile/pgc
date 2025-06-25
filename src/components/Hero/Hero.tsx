'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const slides = [
  {
    image: '/pgc6.jpg',
    title: 'When Purpose Is Not known,Abuse Is Inevitable',
    subtitle: 'Helping Them Realize Purpose Today',
  },
  {
    image: '/pgc5.jpg',
    title: 'Provide Education For Every Child',
    subtitle: 'Give Them A Future',
  },
  {
    image: '/pgc7.jpg',
    title: 'Provide Bags,Books And Uniform',
    subtitle: 'Be The Reason Someone Smiles',
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const { image, title, subtitle } = slides[index];

  return (
    <div className={styles.heroContainer}>
      <Image
        src={image}
        alt={subtitle}
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.overlay}>
        <div className={styles.content}>
          <p className={styles.subtitle}>{subtitle}</p>
          <h1 className={styles.title}>
            {title.split(' ').slice(0, -2).join(' ')}
            <br />
            {title.split(' ').slice(-2).join(' ')}
          </h1>
          <button className={styles.button}>Learn More</button>
        </div>
      </div>
      <button
        aria-label="Previous slide"
        onClick={prevSlide}
        className={styles.navLeft}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        aria-label="Next slide"
        onClick={nextSlide}
        className={styles.navRight}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

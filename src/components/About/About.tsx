import React from 'react';
import styles from './About.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <main className={styles.about}>
      <section className={styles.imageSection}>
        
        <Image
          src="/pgc3.jpg"
          alt="about photo"
          width={480}
          height={480}
          className={styles.aboutImage}
        />
      </section>

      <section className={styles.textSection}>
        <p className={styles.subtitle}>About Us</p>
        <h1 className={styles.title}>
          Step Forward
          <br />
          Serve Humanity
          <br />
          Reach Out & Enlighten Minds.
        </h1>
        <p className={styles.description}>
          There are many variations of passages of Lorem Ipsum but the majority have suffered alteration in some form,
          by injected humour, or randomised words which don’t look slightly believable. If you are going to use a passage of Lorem Ipsum.
        </p>

        <ul className={styles.list}>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
            Have Enough Food For Life.
          </li>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
            Poor Children Can Return To School.
          </li>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
            Support Poor People To Have Better Jobs.
          </li>
        </ul>

        <button className={styles.button}>Join Now</button>
      </section>
    </main>
  );
};

export default About;

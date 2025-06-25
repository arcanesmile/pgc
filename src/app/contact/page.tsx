import React from 'react';
import Link from 'next/link';
import Contact from '../../components/contact/Contact';
import styles from './contact.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faClock } from '@fortawesome/free-solid-svg-icons';

export default function ContactPage() {
  return (
    <>
      <div className={styles.contactContainer}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Contact Us</h1>
          <p className={styles.links}>
            <Link href="/" className={styles.link}>Home</Link> / Contact Us
          </p>
        </div>
      </div>

      <div className={styles.mapcontainer}>
        <div className={styles.mapWrapper}>
         <iframe src="https://maps.google.com/maps?q=makurdi&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder={"0"}></iframe>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoBox}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
            <h3 className={styles.title}>Address Info</h3>
            <p className={styles.text}>
              sheraton hotel,makurdi.
              <br />
              Benue,Nigeria.
            </p>
          </div>

          <div className={styles.infoBox}>
            <FontAwesomeIcon icon={faPhoneAlt} size="2x" />
            <h3 className={styles.title}>Contact Info</h3>
            <p className={styles.text}>
              091-2411-5768
              <br />
              demo@example.com
            </p>
          </div>

          <div className={styles.infoBox}>
            <FontAwesomeIcon icon={faClock} size="2x" />
            <h3 className={styles.title}>Working Hours</h3>
            <p className={styles.text}>
              Open: 8:00AM – Close: 18:00PM
              <br />
              Saturday – Sunday: Close
            </p>
          </div>
        </div>
      </div>

      <Contact />
    </>
  );
}

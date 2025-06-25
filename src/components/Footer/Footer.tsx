'use client';
import React, { useState } from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    connect: false,
    contact: false,
    static: false,
    info1: false,
    info2: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Newsletter</h2>
        </section>

        <hr className={styles.divider} />


        {/* Connect With Us */}
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('connect')}>
            <h3 className={styles.sectionTitle}>Connect With Us:</h3>
            <FontAwesomeIcon
              icon={openSections.connect ? faChevronUp : faChevronDown}
              className={styles.chevron}
            />
          </div>
          {openSections.connect && (
            <div className={styles.socialIcons}>
              <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
              <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          )}
        </section>

        <hr className={styles.divider} />

        {/* Contact Us */}
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('contact')}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <FontAwesomeIcon
              icon={openSections.contact ? faChevronUp : faChevronDown}
              className={styles.chevron}
            />
          </div>
          {openSections.contact && (
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                <span>Sheraton hotel, behind Benue State House of Assembly, Makurdi Benue State.</span>
              </li>
              <li className={styles.contactItem}>
                <FontAwesomeIcon icon={faPhoneAlt} className={styles.icon} />
                <span>091 211 5768</span>
              </li>
              <li className={styles.contactItem}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                <span>pgc@gmail.com</span>
              </li>
            </ul>
          )}
        </section>

        <hr className={styles.divider} />


        {/* Static Link */}
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('static')}>
            <h3 className={styles.sectionTitle}>Static Link</h3>
            <FontAwesomeIcon
              icon={openSections.static ? faChevronUp : faChevronDown}
              className={styles.chevron}
            />
          </div>
          {openSections.static && (
            <ul className={styles.linkList}>
              <li><a href="">About</a></li>
              <li><a href="">Contact Us</a></li>
              <li><a href="">Report Abuse</a></li>
            </ul>
          )}
        </section>


      <hr className={styles.divider} />


        {/* Information 1 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('info1')}>
            <h3 className={styles.sectionTitle}>Information</h3>
            <FontAwesomeIcon
              icon={openSections.info1 ? faChevronUp : faChevronDown}
              className={styles.chevron}
            />
          </div>
          {openSections.info1 && (
            <ul className={styles.linkList}>
              <li><a href="">What We Do</a></li>
              <li><a href="">Checkout</a></li>
              <li><a href="">Our Blog</a></li>
              <li><a href="">Affiliate</a></li>
            </ul>
          )}
        </section>

         <hr className={styles.divider} />



        {/* Information 2 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('info2')}>
            <h3 className={styles.sectionTitle}>Information</h3>
            <FontAwesomeIcon
              icon={openSections.info2 ? faChevronUp : faChevronDown}
              className={styles.chevron}
            />
          </div>
          {openSections.info2 && (
            <ul className={styles.linkList}>
              <li><a href="">Our Gallery</a></li>
              <li><a href="">Events</a></li>
              <li><a href="">Our Service</a></li>
            </ul>
          )}
        </section>
      </div>

      <hr className={styles.divider} />


      {/* Footer Bottom */}
      <footer className={styles.footerBottom}>
        © 2025 All Rights Reserved.
      </footer>
    </div>
  );
};

export default Footer;

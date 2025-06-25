import Link from 'next/link';

import styles from './about.module.css';
import About from "../../components/About/About";
import Video from "../../components/Video/Video";
import FAQ from "../../components/FAQ/FAQ";
import Stats from "../../components/Stats/Stats";
import Volunteer from "../../components/Volunteer/Volunteer";

export default function AboutPage() {
    return(
      <>
        <div className={styles.aboutContainer}>
          <div className={styles.content}>
            <h1 className={styles.heading}>About Us</h1>
            <p className={styles.links}>
                <Link href="/" className={styles.link}
                >Home</Link>/About Us
            </p>
          </div>
        </div>
        <About />
        <Video />
        <FAQ />
        <Stats />
        <Volunteer />
        </>
    );
}
import Link from 'next/link';
import Volunteer from '../../components/Volunteer/Volunteer';
import About from '../../components/About/About';
import styles from './volunteer.module.css';


export default function VolunteerPage() {
    return(
      <>
        <div className={styles.aboutContainer}>
          <div className={styles.content}>
            <h1 className={styles.heading}>Volunteers</h1>
            <p className={styles.links}>
                <Link href="/" className={styles.link}
                >Home</Link>/Volunteer
            </p>
          </div>
        </div>
        <Volunteer />
        <About />
        </>
    );
}
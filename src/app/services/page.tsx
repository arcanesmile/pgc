import Link from 'next/link';
import Events from '../../components/Events/Events';
import Video from '../../components/Video/Video';
import styles from './services.module.css';


export default function ServicesPage() {
    return(
      <>
        <div className={styles.aboutContainer}>
          <div className={styles.content}>
            <h1 className={styles.heading}>Our Services</h1>
            <p className={styles.links}>
                <Link href="/" className={styles.link}
                >Home</Link>/Services
            </p>
          </div>
        </div>
        <Events />
        <Video />
        </>
    );
}
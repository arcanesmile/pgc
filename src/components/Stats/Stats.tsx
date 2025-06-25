import styles from './Stats.module.css';

export default function Stat() {
  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>120</h3>
          <p className={styles.statLabel}>Featured Campaign</p>
        </div>

        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>7,120+</h3>
          <p className={styles.statLabel}>Money Raised</p>
        </div>

        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>170+</h3>
          <p className={styles.statLabel}>Dedicated Volunteers</p>
        </div>

        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>220+</h3>
          <p className={styles.statLabel}>People Helped Happily</p>
        </div>
      </div>
    </div>
  );
};


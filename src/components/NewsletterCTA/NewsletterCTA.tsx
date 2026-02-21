import styles from './NewsletterCTA.module.css';

export default function Newsletter() {
  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContent}>
        <div className={styles.newsletterIcon}>✉️</div>
        <h3 className={styles.newsletterTitle}>Stay Updated</h3>
        <p className={styles.newsletterText}>
          Get the latest articles, insights, and resources delivered directly to your inbox.
        </p>
        <form className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Your email address"
            className={styles.newsletterInput}
            required
          />
          <button type="submit" className={styles.newsletterButton}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
'use client';

import styles from './blogPage.module.css';

export default function ErrorState() {
  return (
    <div className={styles.errorState}>
      <h2>Error Loading Posts</h2>
      <p>We encountered an issue loading the blog posts. Please try again later.</p>
      <button
        className={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}
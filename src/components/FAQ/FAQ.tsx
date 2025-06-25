'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: 'who are you',
    answer:
      'i am me'
  },
  {
    question: 'who are you',
    answer:
      'i am me.',
  },
  {
    question: 'What is your name?',
    answer:'benjamin',
  },
  {
    question:"who are you",
    answer:
      'i am me',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className={styles.faqMain}>
      <div className={styles.faqImageWrapper}>
        <Image
          src="/pgc7.jpg"
          alt="faq"
          width={480}
          height={480}
          className={styles.faqImage}
        />
      </div>
      <section className={styles.faqContent}>
        <p className={styles.faqSubheading}>Our FAQ</p>
        <h2 className={styles.faqHeading}>Common Question</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                aria-expanded={openIndex === index}
                onClick={() => toggleFAQ(index)}
                className={styles.faqButton}
              >
                {faq.question}
                <FontAwesomeIcon
                  icon={openIndex === index ? faMinus : faPlus}
                  className={styles.faqIcon}
                />
              </button>
              {openIndex === index && <p className={styles.faqAnswer}>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}



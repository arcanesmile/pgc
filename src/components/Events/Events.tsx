'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './Events.module.css'

export default function Events() {
  const [expanded, setExpanded] = useState([false, false, false]) // one state per card

  const toggleExpand = (index: number) => {
    const newExpanded = [...expanded]
    newExpanded[index] = !newExpanded[index]
    setExpanded(newExpanded)
  }

  const descriptions = [
    {
      title: 'Help For Education',
      img: '/pgc1.jpg',
      shortText: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
      moreText: ' It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
    },
    {
      title: 'Help Humanity Discover Purpose',
      img: '/pgc2.jpg',
      shortText: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
      moreText: ' It has roots in a piece of classical Latin literature that changed the world.',
    },
    {
      title: 'Help Nocture Greatness',
      img: '/pgc3.jpg',
      shortText: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
      moreText: ' It has roots in a Latin classic, dating back to ancient Roman times.',
    },
  ]

  return (
    <section className={styles.eventsSection}>
      <p className={styles.subheading}>Welcome To A New World</p>
      <h1>Small Actions Lead<br />To Big Changes</h1>
      <div className={styles.cards}>
        {descriptions.map((desc, index) => (
          <div key={index} className={styles.card} >
            <Image src={desc.img} alt={desc.title} width={400} height={260} />
            <h3>{desc.title}</h3>
            <p >
              {desc.shortText}
              {expanded[index] && desc.moreText}
            </p>
            <button
              onClick={() => toggleExpand(index)}
              className={styles.readMoreBtn}
            >
              {expanded[index] ? 'Read Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

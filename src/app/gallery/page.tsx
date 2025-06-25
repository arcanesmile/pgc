'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './gallery.module.css';
import Link from 'next/link';

type Category = 'Show All' | 'Health' | 'Education' | 'Food';

type ImageItem = {
  src: string;
  alt: string;
  category: Exclude<Category, 'Show All'>;
};

const categories: Category[] = ['Show All', 'Health', 'Education', 'Food'];

const imageData: ImageItem[] = [
  {
    src: '/pgc4.jpg',
    alt: 'Man in mask working in storage room with boxes and shelves',
    category: 'Health',
  },
  {
    src: '/pgc5.jpg',
    alt: 'Group of people carrying boxes on their heads in an outdoor setting',
    category: 'Food',
  },
  {
    src: '/pgc6.jpg',
    alt: 'People wearing masks distributing food in takeout containers indoors',
    category: 'Food',
  },
  {
    src: '/pgc2.jpg',
    alt: 'Children sitting in a classroom with colorful decorations',
    category: 'Education',
  },
  {
    src: '/pgc1.jpg',
    alt: 'Young boy wearing a mask holding a wrapped gift box',
    category: 'Health',
  },
  {
    src: '/pgc7.jpg',
    alt: 'People packing boxes with food items in a warehouse',
    category: 'Food',
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('Show All');

  const filteredImages =
    activeCategory === 'Show All'
      ? imageData
      : imageData.filter((img) => img.category === activeCategory);

  return (
    <div className={styles.galleryPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gallery</h1>
        <nav className={styles.link}>
          <Link href="/">Home</Link> / Gallery
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.buttonGroup}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`${styles.button} ${
                activeCategory === category ? styles.active : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.galleryGrid}>
          {filteredImages.map((img, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={260}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};



"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import styles from "./AbtVolunteer.module.css";

const AbtVolunteer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rotationInterval = 8000;

  const volunteers = [
    {
      id: 1,
      quote:
        "There are many variations of passages of Lorem Ipsum available, but the majori humour, or randomised words which don't look even slightly believable...",
      name: "solomon ogbo",
      role: "Volunteer",
      image: "/pgc5.jpg",
    },
    {
      id: 2,
      quote:
        "This organization changed my life. The team's dedication is inspiring and I'm proud to contribute to their mission.",
      name: "courage",
      role: "Coordinator",
      image: "/pgc6.jpg",
    },
    {
      id: 3,
      quote:
        "Volunteering here has been the most rewarding experience. The impact we make together is truly remarkable.",
      name: "betty",
      role: "Support Staff",
      image: "/pgc4.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % volunteers.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [volunteers.length]);

  useEffect(() => {
    setIsAnimating(false);
    const timeout = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide((prev) => (prev + 1) % volunteers.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) =>
        prev === 0 ? volunteers.length - 1 : prev - 1
      ),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section className={styles.abtSlider}>
      <div
        className={`${styles["abt-slider-container"]} ${
          isAnimating ? styles.show : ""
        }`}
        {...swipeHandlers}
      >
        <p className={styles["abt-text"]}>{volunteers[currentSlide].quote}</p>

        <div className={styles["volunteer-image-container"]}>
          <Image
            src={volunteers[currentSlide].image}
            alt={`Portrait of ${volunteers[currentSlide].name}`}
            width={64}
            height={64}
            className={styles["volunteer-image"]}
          />
        </div>

        <h3 className={styles["volunteer-name"]}>
          {volunteers[currentSlide].name}
        </h3>
        <p className={styles["volunteer-role"]}>
          {volunteers[currentSlide].role}
        </p>

        <div className={styles["slider-dots"]}>
          {volunteers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.dot} ${
                currentSlide === index ? styles.active : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AbtVolunteer;

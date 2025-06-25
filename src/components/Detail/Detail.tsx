import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faQuestionCircle,
  faPrayingHands,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Detail.module.css";

const Detail = () => {
  const cards = [
    {
      title: "Who are you?",
      icon: faUser,
      image: "/pgc1.jpg",
      overlayClass: styles.orangeOverlay,
    },
    {
      title: "Why are you here?",
      icon: faQuestionCircle,
      image: "/pgc2.jpg",
      overlayClass: styles.blueOverlay,
    },
    {
      title: "How to seek God's help",
      icon: faPrayingHands,
      image: "/pgc3.jpg",
      overlayClass: styles.greenOverlay,
    },
  ];

  return (
    <div className={styles.cardContainer}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={styles.card}
          style={{ backgroundImage: `url(${card.image})` }}
        >
          <div className={`${styles.overlay} ${card.overlayClass}`}>
            <FontAwesomeIcon icon={card.icon} className={styles.icon} />
            <h2>{card.title}</h2>
            <a href="#" className={styles.link}>
              Learn More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Detail;

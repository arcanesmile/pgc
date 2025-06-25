import styles from "./Video.module.css"


export default function Video() {
    return (
        <section className={styles.videoSection}>
        <div className={styles.text}>
          <p>Watch Video</p>
          <h2>Watch Our Latest Activities</h2>
          <p>
            There are many variations of passages of The Lorem Ipsum available, but the majority have suffered
            alteration in this some form, by injected humour, or randomised words which don’t look even slightly
            believable. If you are going to use a passage of Lorem Ipsum.
          </p>
          <a href="#">Read More</a>
        </div>
        <div className={styles.videoBox}>
          <video controls width="100%">
            <source src="/videos/activities.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

    )
}
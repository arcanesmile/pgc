import Image from 'next/image';
import styles from "./Contact.module.css";


export default function Contact() {

    return(
        <section className={styles.contactContainer}>
            <div className={styles.formDetails}>
                <div className={styles.headers}>
                <p className={styles.subtitle}>Contact Us</p>
                <h1 className={styles.title}>Interested <br />Discussing</h1>
                </div>
                <form action="#" className={styles.formContainer} >
                    <input type="text" placeholder="Enter Your Name"/>
                    <input type="" placeholder="Phone Number"/>
                    <input type="email" placeholder="Email Address"/>
                    <textarea name="" id="" placeholder='write to us'></textarea>
                    <button className={styles.formBtn}>Submit Now</button>
                </form>
            </div>
            <div className={styles.imageContainer}>
                <Image
                src='/pgc1.jpg'
                alt='contact image'
                width={500}
                height={500}
                className={styles.contactImage} 
                />
            </div>
        </section>

    )
}
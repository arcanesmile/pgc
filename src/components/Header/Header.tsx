"use client";
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown, faChevronUp, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User, signOut  } from 'firebase/auth';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      closeMenu();
    } catch (error) {
      console.error('Sign out error:', error);
      }
    }
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropDownOpen(!isDropDownOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src="/pgc-logo.png"
            width={120}
            height={50}
            alt="PGC logo"
            className={styles.logo}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navList}>
          <li>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === '/about' ? styles.active : ''}>
              About
            </Link>
          </li>
          <hr className={styles.divider} />
          <li>
            <Link href="/contact" className={pathname === '/contact' ? styles.active : ''}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/blog" className={pathname === '/blog' ? styles.active : ''}>
              Blog
            </Link>
          </li>
          <li className={styles.dropdown}>
            <button 
              className={`${styles.dropdownBtn} ${isDropDownOpen ? styles.open : ''}`}
              onClick={toggleDropdown}
            >
              Engage
              <FontAwesomeIcon
                icon={isDropDownOpen ? faChevronUp : faChevronDown}
                className={styles.dropdownIcon}
              />
            </button>
            {isDropDownOpen && (
              <ul className={styles.dropdownContent}>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/volunteer">Volunteer</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
              </ul>
            )}
          </li>
        </ul>
        
        {currentUser ? (
          <Link href="/support" className={styles.desktopDonateButton}>
            Support
          </Link>
        ) : (
          <Link href="/login" className={styles.desktopDonateButton}>
            Login
          </Link>
        )}

        {/* Mobile Controls */}
        <div className={styles.mobileControls}>
          <button 
            className={styles.menuButton} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          {currentUser ? (
            <Link href="/support" className={styles.donateButton}>
              Support
            </Link>
          ) : (
            <Link href="/login" className={styles.donateButton}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.showMenu : ''}`}>
          <div className={styles.menuHeader}>
            <h2>Welcome</h2>
            <button onClick={closeMenu} className={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
          <ul>
            <li>
              <Link href="/" className={pathname === '/' ? styles.active : ''} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <hr className={styles.divider} />
            <li>
              <Link href="/about" className={pathname === '/about' ? styles.active : ''} onClick={closeMenu}>
                About
              </Link>
            </li>
            <hr className={styles.divider} />
            <li>
              <Link href="/contact" className={pathname === '/contact' ? styles.active : ''} onClick={closeMenu}>
                Contact
              </Link>
            </li>
            <hr className={styles.divider} />
            <li>
              <Link href="/blog" className={pathname === '/blog' ? styles.active : ''} onClick={closeMenu}>
                Blog
              </Link>
            </li>
            <hr className={styles.divider} />
            <li className={styles.mobileDropdown}>
              <button 
                className={`${styles.dropdownBtn} ${isDropDownOpen ? styles.open : ''}`}
                onClick={toggleDropdown}
              >
                Engage
                <FontAwesomeIcon
                  icon={isDropDownOpen ? faChevronUp : faChevronDown}
                  className={styles.dropdownIcon}
                />
              </button>
              {isDropDownOpen && (
                <ul className={styles.mobileDropdownContent}>
                  <li><Link href="/services" onClick={closeMenu}>Services</Link></li>
                  <li><Link href="/volunteer" onClick={closeMenu}>Volunteer</Link></li>
                  <li><Link href="/gallery" onClick={closeMenu}>Gallery</Link></li>
                </ul>
              )}
            </li>
            <hr className={styles.divider} />
            {currentUser && (
              <>
              <li>
                <button onClick={handleSignOut} className={styles.signOutButton}>
                  <FontAwesomeIcon icon={faSignOutAlt}  className={styles.signOutIcon}/>
                  Sign Out
                </button>
              </li>
              </>
            )}
          </ul>
        </div>

        {/* Overlay */}
        {isMenuOpen && <div className={styles.menuOverlay} onClick={closeMenu}></div>}
      </nav>
    </header>
  );
}
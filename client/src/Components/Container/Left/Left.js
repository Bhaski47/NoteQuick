import React from 'react'
import styles from './header.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faGraduationCap,faGear,faUserClock } from '@fortawesome/free-solid-svg-icons';
function Left() {
  return (
    <div className={styles.container}>
            <h1 className={styles.title}>Flecx</h1>
            <ul>
                <a href='google.com'><li><FontAwesomeIcon icon={faHouse} /> Main</li></a>
                <a href='google.com'><li><FontAwesomeIcon icon={faGraduationCap} /> UG Colleges</li></a>
                <a href='google.com'><li><FontAwesomeIcon icon={faGraduationCap} /> PG Colleges</li></a>
                <a href='google.com'><li><FontAwesomeIcon icon={faGear} /> Settings</li></a>
            </ul>
                <a href='google.com'><li><FontAwesomeIcon icon={faUserClock} /> Log Out</li></a>
        
    </div>
  )
}

export default Left
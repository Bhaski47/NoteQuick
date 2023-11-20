import React from 'react'
import styles from './top.module.scss'
function Top() {
  return (
    <div className={styles.container}>
        <div className={styles.box}>
            <h2 className={styles.title}>Flecx</h2>
            <div className={styles.ref}>
                <a className={styles.pageRef} href="google.com">Home</a>
                <a className={styles.pageRef} href="google.com">Contact</a>
                <a className={styles.pageRef} href="google.com">About</a>
            </div>
                <a className={styles.pageRef} href="google.com">Sign In</a>
        </div>
    </div>
  )
}

export default Top
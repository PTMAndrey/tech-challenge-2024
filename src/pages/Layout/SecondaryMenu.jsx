import React from 'react'
import styles from './Layout.module.scss'

const SecondaryMenu = ({ links }) => {
  return (
    <nav className={styles.secondaryMenu}>
      {links.map((link, index) => (
        <a key={index} href={link.path} className={window.location.pathname === link.path ? styles.active : null}>{link.text}</a>
      ))}
    </nav>
  )
}

export default SecondaryMenu
import React from 'react'
import styles from './Layout.module.scss'
import { Container } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';

const PageTitle = ({ title, secondNav }) => {
    
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
  const nav = currentTab?.charAt(0).toUpperCase() + currentTab?.slice(1)
    return (
        <Container className={styles.pageTitle}>
            {title} {nav ? (' / '+ nav) : null}
        </Container>
    )
}

export default PageTitle
import React from 'react'
import styles from './Home.module.scss';
import { Container } from 'react-bootstrap';

const Home = () => {
  console.log(window.location.pathname);
  return (
    <Container fluid className={styles.mainContainer}>
      <div>
        <h2>WELCOME HOME</h2>
      </div>
    </Container >
  )
}

export default Home
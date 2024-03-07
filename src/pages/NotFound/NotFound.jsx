import React from 'react';
import imagineNotFound from '../../assets/images/notfound.png';
import { BiHomeAlt } from 'react-icons/bi';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import styles from './NotFound.module.scss';

const NotFound = () => {
    return (
        <Container className={styles.containerNotFound}>
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <img src={imagineNotFound} alt='Pagina nu a fost gasita' className={`${styles.imagineNotFound} ${styles.rotateAndShake}`} />
                    <div className={styles.errorText}>
                        <h1 className={styles.ntf}>#404</h1>
                        <h2>Aha! Vezi? Și tu poți greși! (sau am greșit noi)...</h2>
                        <p>... indiferent care e situația, probabil ar trebui să mergi la pagina principală</p>
                        <Button href='/' variant="outline-primary" className={styles.homeButton}><BiHomeAlt /> Pagina Principală</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound;

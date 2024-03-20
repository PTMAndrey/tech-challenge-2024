import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { Container, Row, Col, Card } from 'react-bootstrap';
import useAuthProvider from '../../hooks/useAuthProvider';
import { getOrganisationStatistics } from '../../api/API';

const Home = () => {
  const { user } = useAuthProvider();
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    (async () => {
      const response = await getOrganisationStatistics(user?.idOrganisation);
      if (response.status === 200) {
        setStatistics(response.data);
      }
    })();
  }, []);

  const toFriendlyText = (key) => {
    const mappings = {
      numberOfEmployees: 'Employees',
      numberOfProjectManagers: 'Project Managers',
      numberOfDepartmentManagers: 'Department Managers',
      numberOfOrganisationAdmins: 'Organisation Admins',
      numberOfDepartments: 'Departments',
      numberOfProjects: 'Projects'
    };
    return mappings[key] || key;
  };

 const statisticsArray = Object.entries(statistics).map(([key, value]) => ({
    name: toFriendlyText(key),
    value,
  }));
  

  return (
    <Container fluid className={styles.mainContainer}>
      <Row xs={1} md={2} lg={3} className="g-4">
        <h3>Welcome</h3>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {statisticsArray.map((stat, index) => (
          <Col key={index}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{stat.name}</Card.Title>
                <Card.Text>
                  {stat.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;

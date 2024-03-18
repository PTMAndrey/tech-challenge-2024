import React, { Fragment } from "react";
import EmployeesCard from '../../../components/Card/EmployeesCard';
import styles from '../Departments.module.scss'
import { Col, Container, Row } from 'react-bootstrap';
import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon } from '../../imports/muiiconsMaterial';
import useStateProvider from "../../../hooks/useStateProvider";
import Pagination from "../../../components/Pagination/Pagination";


const ListAvailableEmployees = (props) => {
  const { pageSizeMyDepartmentEmployees, currentPageMyDepartmentEmployees, setCurrentPageMyDepartmentEmployees } = useStateProvider();

  return (
    <>
      <div onClick={() => props.toggleSortDirectionAndColumn('firstName')} className={styles.sortButtonCard}>
        <FilterListIcon />
        <p>Sort by first name </p>
        <span>{props.sortDirection === 'Ascending' && props.sortBy === 'firstName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />} </span>
      </div>

      {props.currentTableData?.length >= 1 &&
        <Pagination
          data={props.rows}
          className={styles.paginationBar}
          totalCount={props.rows?.length}
          pageSize={pageSizeMyDepartmentEmployees}
          currentPage={currentPageMyDepartmentEmployees}
          onPageChange={page => setCurrentPageMyDepartmentEmployees(page)}
        />
      }

      <Container className={styles.yourContainerStyle}>
        <Row>
          {props.currentTableData?.map((user, index) => (
            <Col className="mb-4"  key={`${user?.idUser}_${index}`}>
              <EmployeesCard
                key={user.idUser}
                data={user}
                handleOpenAddUpdate={props.handleOpenAddUpdate}
                handleActionYes={props.handleActionYes}
                handleOpenDelete={props.handleOpenDelete}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default ListAvailableEmployees
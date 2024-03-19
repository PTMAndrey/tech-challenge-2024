import React, { Fragment } from "react";
import EmployeesCard from '../../../components/Card/EmployeesCard';
import styles from '../Departments.module.scss'
import { Col, Container, Row } from 'react-bootstrap';
import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon } from '../../imports/muiiconsMaterial';
import useStateProvider from "../../../hooks/useStateProvider";
import Pagination from "../../../components/Pagination/Pagination";


const ListAvailableEmployees = (props) => {
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
          pageSize={props.pageSize}
          currentPage={props.currentPage}
          onPageChange={page => props.setCurrentPage(page)}
        />
      }

      <Container>
        <Row>
          {props.currentTableData?.map((user, index) => (
            <Col className="mb-4"  key={`${user?.idUser}_${index}`}>
              <EmployeesCard
                key={user.idUser}
                data={user}
                handleActionYes={props.handleActionYes}
                handleActionNo={props.handleActionNo}
                action={props.action}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default ListAvailableEmployees
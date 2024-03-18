import React, { useEffect, useState } from 'react'
import styles from './Departments.module.scss'
import { useLocation } from 'react-router';
import AdminDepartments from './AdminDepartments';
import MyDepartment from './MyDepartment';
import useAuthProvider from '../../hooks/useAuthProvider';

const Departments = () => {
  const {user} = useAuthProvider();
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
  console.log(currentTab);
  const tabSelector = () => {
    switch (currentTab) {
      case "admin":
        return <AdminDepartments />;
      case ("myDepartment"):
        return < MyDepartment />;
      default:
        break;
    }
  };
  return (
    <section className={styles.pageDepartments}>
      <div>{tabSelector()}</div>
    </section>

  );
}

export default Departments;
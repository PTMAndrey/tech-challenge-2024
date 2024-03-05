import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import styles from './SidebarNavigation.module.scss';
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";


const SidebarNavigation = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
      <div className={styles.headerSideBar}>
        <div className={styles.profileContainer}>
          <a href="/profile">
            <FaUserCircle className={styles.profileImg} />
            {isSidebarOpen && <span>Profile</span>}
          </a>
        </div>
      </div>
      <hr />
      <div className={styles.menuItems}>
        <a href="/" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Home</span>}
        </a>
        <a href="/team-roles" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Team Roles</span>}
        </a>
        <a href="/departments" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Departments</span>}
        </a>
        <a href="/projects" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Projects</span>}
        </a>
        <a href="/skills" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Skills</span>}
        </a>
        <a href="/teams" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Teams</span>}
        </a>
        <a href="/users" className={styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Users</span>}
        </a>
      </div>
      <hr />
      <div className={styles.bottomSideBar}>
        <div className={styles.notifications}>
          <a href="/notifications">
            <FaBell className={styles.notificationBell} />
            {isSidebarOpen && <span>Notifications</span>}
          </a>
        </div>
        <button onClick={toggleSidebar} className={styles.buttonToggleSideBar}>
          {isSidebarOpen ? <TbLayoutSidebarRightExpandFilled /> : <TbLayoutSidebarLeftExpandFilled />}
        </button>
      </div>
    </div>
  );
}
export default SidebarNavigation;

import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import style from './SidebarNavigation.module.scss';
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";


const SidebarNavigation = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className={`${style.sidebar} ${isSidebarOpen ? style.open : style.closed}`}>
      <div className={style.headerSideBar}>
        <div className={style.profileContainer}>
          <a href="/profile">
            <FaUserCircle className={style.profileImg} />
            {isSidebarOpen && <span>Profile</span>}
          </a>
        </div>
      </div>
      <hr />
      <div className={style.menuItems}>
        <a href="/" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Home</span>}
        </a>
        <a href="/team-roles" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Team Roles</span>}
        </a>
        <a href="/departments" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Departments</span>}
        </a>
        <a href="/projects" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Projects</span>}
        </a>
        <a href="/skills" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Skills</span>}
        </a>
        <a href="/teams" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Teams</span>}
        </a>
        <a href="/users" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Users</span>}
        </a>
      </div>
      <hr />
      <div className={style.bottomSideBar}>
        <div className={style.notifications}>
          <a href="/notifications">
            <FaBell className={style.notificationBell} />
            {isSidebarOpen && <span>Notification</span>}
          </a>
        </div>
        <button onClick={toggleSidebar} className={style.buttonToggleSideBar}>
          {isSidebarOpen ? <TbLayoutSidebarRightExpandFilled /> : <TbLayoutSidebarLeftExpandFilled />}
        </button>
      </div>
    </div>
  );
}
export default SidebarNavigation;

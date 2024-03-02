import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import style from './SidebarNavigation.module.scss';
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";


const SidebarNavigation = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className={`${style.sidebar} ${isSidebarOpen ? style.open : style.closed}`}>

      <button onClick={toggleSidebar}>
        {isSidebarOpen ? <TbLayoutSidebarRightExpandFilled /> : <TbLayoutSidebarLeftExpandFilled />}
      </button>

      <div className={style.menuItems}>
        <a href="/" className={style.menuItem}>
          <FaHome className={style.img} />
          {isSidebarOpen && <span>Home</span>}
        </a>
      </div>
    </div>
  );
}
export default SidebarNavigation;

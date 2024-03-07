import React from "react";
import { FaHome } from "react-icons/fa";
import styles from "./SidebarNavigation.module.scss";
import { TbLayoutSidebarRightExpandFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { LiaUsersSolid } from "react-icons/lia";
import { GiTeamIdea, GiSkills } from "react-icons/gi";
import { FaFolderOpen } from "react-icons/fa6";
import { MdOutlineStars } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import useAuthProvider from "../../hooks/useAuthProvider";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useStateProvider from "../../hooks/useStateProvider";


const SidebarNavigation = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout } = useAuthProvider();
  
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
      <div className={styles.headerSideBar}>
        <div className={styles.profileContainer}>
          <button onClick={toggleSidebar} className={styles.buttonToggleSideBar}>
            {isSidebarOpen ? <TbLayoutSidebarRightExpandFilled /> : <TbLayoutSidebarLeftExpandFilled />}
          </button>
          <Link to="/profile" className={location === "/profile" ? styles.activeMenuItem : null}>
            <FaUserCircle className={styles.profileImg} />
            {isSidebarOpen && <span>Profile</span>}
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.menuItems}>
        <Link to="/" className={location === "/" ? styles.activeMenuItem : styles.menuItem}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Home</span>}
        </Link>
        <hr />
        <Link to="/team-roles" className={location === "/team-roles" ? styles.activeMenuItem : styles.menuItem}>
          <IoIosPeople className={styles.img} />
          {isSidebarOpen && <span>Team Roles</span>}
        </Link>
        <hr />
        <Link to="/departments" className={location === "/departments" ? styles.activeMenuItem : styles.menuItem}>
          <MdOutlineStars className={styles.img} />
          {isSidebarOpen && <span>Departments</span>}
        </Link>
        <hr />
        <Link to="/projects" className={location === "/projects" ? styles.activeMenuItem : styles.menuItem}>
          <FaFolderOpen className={styles.img} />
          {isSidebarOpen && <span>Projects</span>}
        </Link>
        <hr />
        <Link to="/skills" className={location === "/skills" ? styles.activeMenuItem : styles.menuItem}>
          <GiSkills className={styles.img} />
          {isSidebarOpen && <span>Skills</span>}
        </Link>
        <hr />
        <Link to="/teams" className={location === "/teams" ? styles.activeMenuItem : styles.menuItem}>
          <GiTeamIdea className={styles.img} />
          {isSidebarOpen && <span>Teams</span>}
        </Link>
        <hr />
        <Link to="/employees" className={location === "/employees" ? styles.activeMenuItem : styles.menuItem} >
          <LiaUsersSolid className={styles.img} />
          {isSidebarOpen && <span>Employees</span>}
        </Link>
        <hr />
        <Link to="/notifications" className={location === "/notifications" ? styles.activeMenuItem : styles.menuItem}>
          <FaBell className={styles.img} />
          {isSidebarOpen && <span>Notifications</span>}
        </Link>
        <hr />
      </div>
      <hr />
      <div className={styles.bottomSideBar}>
        <button onClick={handleLogout}>
          <BiLogOutCircle className={styles.notificationBell} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
export default SidebarNavigation;

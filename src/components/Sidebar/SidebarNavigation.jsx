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
import { useNavigate, Link } from "react-router-dom";
import useStateProvider from "../../hooks/useStateProvider";


const SidebarNavigation = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout } = useAuthProvider();
  const { activeNavbarItem, handleNavbarOption } = useStateProvider();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleItemClick = (path) => {
    handleNavbarOption(path);
    navigate(path);
  };
console.log(activeNavbarItem);
  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
      <div className={styles.headerSideBar}>
        <div className={styles.profileContainer}>
          <button onClick={toggleSidebar} className={styles.buttonToggleSideBar}>
            {isSidebarOpen ? <TbLayoutSidebarRightExpandFilled /> : <TbLayoutSidebarLeftExpandFilled />}
          </button>
          <Link to="/profile" className={activeNavbarItem === "/profile" ? styles.activeMenuItem : null} onClick={() => handleItemClick("/profile")}>
            <FaUserCircle className={styles.profileImg} />
            {isSidebarOpen && <span>Profile</span>}
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.menuItems}>
        <Link to="/" className={activeNavbarItem === "/" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/")}>
          <FaHome className={styles.img} />
          {isSidebarOpen && <span>Home</span>}
        </Link>
        <hr />
        <Link to="/team-roles" className={activeNavbarItem === "/team-roles" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/team-roles")}>
          <IoIosPeople className={styles.img} />
          {isSidebarOpen && <span>Team Roles</span>}
        </Link>
        <hr />
        <Link to="/departments" className={activeNavbarItem === "/departments" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/departments")}>
          <MdOutlineStars className={styles.img} />
          {isSidebarOpen && <span>Departments</span>}
        </Link>
        <hr />
        <Link to="/projects" className={activeNavbarItem === "/projects" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/projects")}>
          <FaFolderOpen className={styles.img} />
          {isSidebarOpen && <span>Projects</span>}
        </Link>
        <hr />
        <Link to="/skills" className={activeNavbarItem === "/skills" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/skills")}>
          <GiSkills className={styles.img} />
          {isSidebarOpen && <span>Skills</span>}
        </Link>
        <hr />
        <Link to="/teams" className={activeNavbarItem === "/teams" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/teams")}>
          <GiTeamIdea className={styles.img} />
          {isSidebarOpen && <span>Teams</span>}
        </Link>
        <hr />
        <Link to="/employees" className={activeNavbarItem === "/employees" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/employees")}>
          <LiaUsersSolid className={styles.img} />
          {isSidebarOpen && <span>Employees</span>}
        </Link>
        <hr />
        <Link to="/notifications" className={activeNavbarItem === "/notifications" ? styles.activeMenuItem : styles.menuItem} onClick={() => handleItemClick("/notifications")}>
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

import React, { useEffect, useState } from 'react';
import styles from './Layout.module.scss'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useLocation } from 'react-router';

const Layout = ({ children }) => {
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setSidebarOpen(width <= 550 ? false : true);
  }, [width])
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    document.title = "Team Finder";
    if (pathSegments.length > 0) {
      const segment = pathSegments[0];
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      document.title = `Team Finder - ${title}`;
    } else {
      document.title = "Team Finder - Home";
    }
  }, [location.pathname]);

  return (
    <div className={`${styles.layout} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { toggleSidebar, isSidebarOpen });
        }
        return child;
      })}
    </div>
  );
};

export default Layout;
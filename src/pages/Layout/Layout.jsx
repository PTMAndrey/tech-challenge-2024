import React, { useEffect, useState } from 'react';
import style from './Layout.module.scss'
import useWindowDimensions from '../../hooks/useWindowDimensions';

const Layout = ({ children }) => {
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
useEffect(() => {
  setSidebarOpen(width <= 550 ? false : true);
}, [width])

  return (
    <div className={`${style.layout} ${isSidebarOpen ? style.sidebarOpen : style.sidebarClosed}`}>
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
import React, { useEffect, useState } from 'react';
import styles from './Layout.module.scss'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useLocation } from 'react-router';
import PageTitle from './PageTitle';
import SecondaryMenu from './SecondaryMenu';
import useAuthProvider from '../../hooks/useAuthProvider';
import { getLinksForRoute } from '../../routes/LayoutRoutes'

const Layout = ({ children }) => {
  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [links, setLinks] = useState([]);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setSidebarOpen(width > 500);
  }, [width])

  useEffect(() => {


    const pathSegments = location.pathname.split('/').filter(Boolean);
    document.title = "Team Finder";
    if (pathSegments.length > 0) {
      const segment = pathSegments[0];
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      document.title = `Team Finder - ${title}`;
      setLinks(getLinksForRoute(user, segment));
    } else {
      document.title = "Team Finder - Home";
      setLinks(getLinksForRoute(user, '/')); // sau link-uri default pentru Home
    }
  }, [location.pathname]);

  return (
    <div className={`${styles.layout} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      {links && links.length > 0 && (
        <PageTitle title={document.title.replace('Team Finder - ', '')} secondNav={links} />
      )}
      {links && links.length > 0 && <SecondaryMenu links={links} />}
    
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
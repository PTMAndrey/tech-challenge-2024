import React from 'react'
import styles from "./Users.module.scss";
import { useLocation,  } from 'react-router-dom';
import AllEmployees from './AllEmployees';
import Invitations from './Invitations';

const Users = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
  const tabSelector = () => {
    switch (currentTab) {
      case "all":
        return <AllEmployees />;
      case "invitations":
        return < Invitations />;
      default:
        break;
    }
  };
  return (
    <section>
      <div>{tabSelector()}</div>
    </section>

  );
};

export default Users;
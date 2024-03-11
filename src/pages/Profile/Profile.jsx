import React from 'react'
import styles from "./Profile.module.scss";
import RowItem from '../../components/RowItem/RowItem';
import useAuthProvider from "../../hooks/useAuthProvider";

const Profile = () => {
  const { user } = useAuthProvider();

  return (
    <div>
      <h4 className={styles.title}>Salut</h4>

      <RowItem
        title="Nume"
        info={user?.firstName}
      />
      
      <RowItem
        title="Prenume"
        info={user?.lastName}
      />
      <RowItem
        title="Email"
        info={user?.emailAdress}
      />

      <RowItem
        title="Organisation Name"
        info={user?.organisationName}
      />

      <RowItem
        title="Role"
        data={user?.authorities}
        info={null}
      />

      <RowItem
        title="Organisation Administrator"
        info={user?.organisationAdminNames}
      />

    </div>
  );
};

export default Profile;
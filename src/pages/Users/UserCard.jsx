import * as React from "react";

import styles from './Users.module.scss'


import {
  DeleteForeverIcon,
  AddCircleOutlineIcon,
} from '../imports/muiiconsMaterial';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
} from '../imports/muiMaterial';


const UserCard = (props) => {
  console.log(props.data);
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography gutterBottom variant="p" component="div">
            {props.data.firstName + " " + props.data.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.emailAdress}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ marginTop: 2 }}>
            <ul className={styles.listOfRoles} key={`${props.data.id}-roles`}>
              {props.renderUserRoles(props.data, props.data.authorities)}
              {console.log(props.data, props.data.authorities)}
            </ul>
          </Typography>
        </CardContent>
        <CardActions className={styles.cardButtons}>
          <AddCircleOutlineIcon className={styles.tableButtons} onClick={() => {
            props.setEmployeeInTable(props.data); props.handleOpenAddRole();
          }} />
          <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
            props.setEmployeeInTable(props.data); props.handleOpenDeleteRole();
          }} />
        </CardActions>
      </Card>
    </div>
  );
}
export default UserCard;
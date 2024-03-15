import * as React from "react";

import styles from './Users.module.scss'


import {
  DeleteForeverIcon,
  BorderColorIcon,
} from '../imports/muiiconsMaterial';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
} from '../imports/muiMaterial';


const UserCard = (props) => {
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }}>
        <CardContent sx={{display:"flex", flexDirection:"column", alignItems:"center" }}>
          <Typography gutterBottom variant="p" component="div">
            {props.data.teamRoleName}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Some details if necessarily
          </Typography> */}
        </CardContent>
        <CardActions className={styles.cardButtons}>
          <BorderColorIcon className={styles.tableButtons} onClick={() => {
            props.setEmployee({ emploidUseryeeID: props.data?.id, teamRoleName: props.data?.teamRoleName }); props.handleOpenAddUpdate('update');
          }} />
          <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
            props.setEmployee({ idUser: props.data?.id, teamRoleName: props.data?.teamRoleName }); props.handleOpenDelete();
          }} />
        </CardActions>
      </Card>
    </div>
  );
}
export default UserCard;
import * as React from "react";

import styles from './TeamRoles.module.scss'


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


const RoleCard = (props) => {
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }} className={styles.card}>
        <CardContent sx={{display:"flex", flexDirection:"column", alignItems:"center" }}>
          <Typography gutterBottom variant="p" component="div">
            Team role
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.teamRoleName}
          </Typography>
        </CardContent>
        <CardActions className={styles.cardButtons}>
          <BorderColorIcon className={styles.tableButtons} onClick={() => {
            props.setTeamRole({ idTeamRole: props.data?.id, teamRoleName: props.data?.teamRoleName }); props.handleOpenAddUpdate('update');
          }} />
          <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
            props.setTeamRole({ idTeamRole: props.data?.id, teamRoleName: props.data?.teamRoleName }); props.handleOpenDelete();
          }} />
        </CardActions>
      </Card>
    </div>
  );
}
export default RoleCard;
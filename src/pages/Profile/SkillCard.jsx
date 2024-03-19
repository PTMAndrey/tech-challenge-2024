import * as React from "react";
import styles from './Profile.module.scss'

import {DeleteForeverIcon} from '../imports/muiiconsMaterial';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
} from '../imports/muiMaterial';

const SkillCard = (props) => {
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }} className={styles.card}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography gutterBottom variant="p" component="div">
            <p>Skill name</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.numeSkill}
          </Typography>
          <Typography gutterBottom variant="p" sx={{ marginTop: 2 }}>
            <p>Level</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.level}
          </Typography>
          <Typography gutterBottom variant="p" sx={{ marginTop: 2 }}>
            <p>Experience</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.experience}
          </Typography>

        </CardContent>
        <CardActions className={styles.cardButtons}>

          <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
            props.setFormValue({ idUserSkill: props.data?.id, idSkill: props.data?.idSkill, numeSkill: props.data?.numeSkill, level: props.data?.level, experience: props.data?.experience });
            props.handleOpenDelete();
          }} />
        </CardActions>
      </Card>
    </div>
  );
}
export default SkillCard;
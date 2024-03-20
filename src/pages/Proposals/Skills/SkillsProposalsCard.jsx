import * as React from "react";

import styles from '../Proposals.module.scss'

import {
    CheckTwoToneIcon,
    CloseTwoToneIcon,
} from '../../imports/muiiconsMaterial';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
} from '../../imports/muiMaterial';


const SkillsProposalsCard = (props) => {
    return (
        <div style={{ marginTop: "15%" }}>
            <Card sx={{ minWidth: 200 }} className={styles.card}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="p" component="div">
                        Employee
                    </Typography>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                        {props.data.numeUser}
                    </Typography>
                    <Typography variant="p" component="div"sx={{ marginTop: 2 }}>
                        Skill name
                    </Typography>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                        {props.data.numeSkill}
                    </Typography>
                    <Typography variant="p" component="div" sx={{ marginTop: 2 }}>
                        Level
                    </Typography>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                        {props.data.level}
                    </Typography>
                    <Typography variant="p" component="div" sx={{ marginTop: 2 }}>
                        Experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.data.experience}
                    </Typography>
                </CardContent>
                <CardActions className={styles.cardButtons}>
                    <CheckTwoToneIcon className={styles.tableButtons} onClick={() => {
                        props.setSkillInTable({ idUserSkill: props.data?.id, });
                        props.handleOpenAddUpdate('approve');
                    }} />
                    <CloseTwoToneIcon className={styles.tableButtons} onClick={() => {
                        props.setSkillInTable({ idUserSkill: props.data?.id, });
                        props.handleOpenDelete();
                    }} />
                </CardActions>
            </Card>
        </div>
    );
}
export default SkillsProposalsCard;
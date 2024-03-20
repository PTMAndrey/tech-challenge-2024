import * as React from "react";
import styles from '../Skills.module.scss'

import {
    DeleteForeverIcon,
    AddCircleOutlineIcon,
    BorderColorIcon,
} from '../../imports/muiiconsMaterial';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Tooltip,
    IconButton,
} from '../../imports/muiMaterial';
import useAuthProvider from "../../../hooks/useAuthProvider";
import useStateProvider from "../../../hooks/useStateProvider";


const SkillCategoriesCard = (props) => {
    const { user } = useAuthProvider();
    const { fetchUnassignedDepartmentManagers } = useStateProvider();
    return (
        <div style={{ marginTop: "15%" }}>
            <Card sx={{ minWidth: 200 }} className={styles.card}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography gutterBottom variant="p" component="div">
                        <p>Category Name</p>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.data.skillCategoryName}
                    </Typography>
                </CardContent>

                <CardActions className={styles.cardButtons}>
                    <BorderColorIcon className={styles.tableButtons} onClick={() => {
                        props.setSelectedSkillInTable({ idSkillCategory: props.data?.id, skillCategoryName: props.data?.skillCategoryName });
                        props.setFormValue({ idSkillCategory: props.data?.id, skillCategoryName: props.data?.skillCategoryName });
                        props.handleOpenAddUpdate("update");

                    }} />
                    <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
                        props.setSelectedSkillInTable({ idSkillCategory: props.data?.id, skillCategoryName: props.data?.skillCategoryName });
                        props.setFormValue({ idSkillCategory: props.data?.id, skillCategoryName: props.data?.skillCategoryName });
                        props.handleOpenDelete();
                    }} />
                </CardActions>
            </Card>
        </div>
    );
}
export default SkillCategoriesCard;
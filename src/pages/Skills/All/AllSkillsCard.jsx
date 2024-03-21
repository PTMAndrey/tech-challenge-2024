import * as React from "react";
import styles from '../Skills.module.scss'

import {
  DeleteForeverIcon,
  AddCircleOutlineIcon,
  BorderColorIcon,
  BookmarkRemoveTwoToneIcon,
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


const AllSkillsCard = (props) => {
  const{user} = useAuthProvider();
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }} className={styles.card}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography gutterBottom variant="p" component="div">
            <p>Skill Name</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.skillName}
          </Typography>

          <Typography gutterBottom variant="p" component="div">
            <p>Skill Description</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.skillDescription}
          </Typography>

          <Typography gutterBottom variant="p" component="div">
            <p>Category Name</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.skillCategoryName}
          </Typography>

          <Typography gutterBottom variant="p" component="div">
            <p>Creator</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.creatorName}
          </Typography>

          {props.data?.inMyDepartment === true ?
            <>
              <Typography gutterBottom variant="p" component="div">
                <p>Remove skill from department</p>
              </Typography>
              <Tooltip
                title='Remove skill from department'
                placement='top-start'
                arrow
                onClick={() => {
                  props.setSelectedSkillInTable({
                    idSkill: props.data?.id,
                    skillName: props.data?.skillName,
                    skillDescription: props.data?.skillDescription,
                    creatorName: props.data?.creatorName,
                    skillCategoryName: props.data?.skilCategoryName,
                    departments: props.data?.departments,
                    adToMyDepartment: props.data?.adToMyDepartment,
                    editable: props.data?.editable,
                    inMyDepartment: props.data?.inMyDepartment,
                  });
                  props.setFormValue({ ...props.formValue, idSkill: props.data?.id });
                  props.handleOpenDelete('removeFromMyDepartment');
                }} >
                <IconButton>
                  <BookmarkRemoveTwoToneIcon className={styles.tableButtons} />
                </IconButton>
              </Tooltip>
            </>
            :
            <>
              <Typography gutterBottom variant="p" component="div">
                <p>Add skill to my department</p>
              </Typography>
              <Tooltip
                title='Add skill to my department'
                placement='top-start'
                arrow
                onClick={() => {
                  props.setSelectedSkillInTable({
                    idSkill: props.data?.id,
                    skillName: props.data?.skillName,
                    skillDescription: props.data?.skillDescription,
                    creatorName: props.data?.creatorName,
                    skillCategoryName: props.data?.skilCategoryName,
                    departments: props.data?.departments,
                    adToMyDepartment: props.data?.adToMyDepartment,
                    editable: props.data?.editable,
                    inMyDepartment: props.data?.inMyDepartment,
                  });
                  props.setFormValue({ ...props.formValue, idSkill: props.data?.id });
                  props.handleOpenDelete('addToMyDepartment');
                }} >
                <IconButton>
                  <AddCircleOutlineIcon className={styles.tableButtons} />
                </IconButton>
              </Tooltip>
            </>
          }
          {props.data?.creatorName === (user?.firstName + ' ' + user?.lastName) &&
            <Tooltip
              title='Delete skill'
              placement='top-start'
              arrow
              onClick={() => {
                props.setSelectedSkillInTable({
                  idSkill: props.data?.id,
                  skillName: props.data?.skillName,
                  skillDescription: props.data?.skillDescription,
                  creatorName: props.data?.creatorName,
                  skillCategoryName: props.data?.skilCategoryName,
                  departments: props.data?.departments,
                  adToMyDepartment: props.data?.adToMyDepartment,
                  editable: props.data?.editable,
                  inMyDepartment: props.data?.inMyDepartment,
                });
                props.setFormValue({ ...props.formValue, idSkill: props.data?.id });
                props.handleOpenDelete('deleteSkill');
              }}>
              <IconButton>
                <DeleteForeverIcon className={styles.tableButtons} />
              </IconButton>
            </Tooltip>
          }


        </CardContent>

        <CardActions className={styles.cardButtons}>
          {props.data?.editable &&
            <>
              <BorderColorIcon className={styles.tableButtons} onClick={() => {
                props.setSelectedSkillInTable({
                  idSkill: props.data?.id,
                  skillName: props.data?.skillName,
                  skillDescription: props.data?.skillDescription,
                  creatorName: props.data?.creatorName,
                  skillCategoryName: props.data?.skilCategoryName,
                  departments: props.data?.departments,
                  adToMyDepartment: props.data?.adToMyDepartment,
                  editable: props.data?.editable,
                  inMyDepartment: props.data?.inMyDepartment,
                });
                props.setFormValue({ ...props.formValue, idSkill: props.data?.id });
                props.handleOpenAddUpdate("update");

              }} />
              <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
                props.setSelectedSkillInTable({
                  idSkill: props.data?.id,
                  skillName: props.data?.skillName,
                  skillDescription: props.data?.skillDescription,
                  creatorName: props.data?.creatorName,
                  skillCategoryName: props.data?.skilCategoryName,
                  departments: props.data?.departments,
                  adToMyDepartment: props.data?.adToMyDepartment,
                  editable: props.data?.editable,
                  inMyDepartment: props.data?.inMyDepartment,
                });
                props.setFormValue({ ...props.formValue, idSkill: props.data?.id });
                props.handleOpenDelete("deleteSkill");
              }} />
            </>
          }
        </CardActions>
      </Card>
    </div >
  );
}
export default AllSkillsCard;
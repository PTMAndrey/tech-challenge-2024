import * as React from "react";

import styles from './Departments.module.scss'


import {
  DeleteForeverIcon,
  AddCircleOutlineIcon,
  BorderColorIcon,
} from '../imports/muiiconsMaterial';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Tooltip,
  IconButton,
} from '../imports/muiMaterial';
import useAuthProvider from "../../hooks/useAuthProvider";
import useStateProvider from "../../hooks/useStateProvider";


const DepartmentCard = (props) => {
  console.log(props.data);
  const { user } = useAuthProvider();
  const { fetchUnassignedDepartmentManagers } = useStateProvider();
  return (
    <div style={{ marginTop: "15%" }}>
      <Card sx={{ minWidth: 200 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography gutterBottom variant="p" component="div">
            <p>Department Name</p>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.data.departmentName}
          </Typography>
          <Typography gutterBottom variant="p" sx={{ marginTop: 2 }}>
            <p>Department Manager</p>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {!props.data.departmentManager ?
              <Tooltip
                title='Add department manager'
                placement='top-start'
                arrow
                onClick={() => {
                  props.setDepartment({ idDepartment: props.data.id, departmentName: props.data.departmentName, idOrganisation: user?.idOrganisation, departmentManager: props.data.departmentManager, departmentManagerName: props.data.departmentManagerName });
                  props.handleOpenAddUpdate("addManager");
                  (async () => { const x = await fetchUnassignedDepartmentManagers(user?.idOrganisation); })();
                }} >
                <IconButton className={styles.iconStyle}>
                  <AddCircleOutlineIcon className={styles.tableButtons} />
                </IconButton><small>Add manager</small>
              </Tooltip>
              :
              <>
                {props.data.departmentManagerName}
              </>
            }
          </Typography>
        </CardContent>
        <CardActions className={styles.cardButtons}>
          <BorderColorIcon className={styles.tableButtons} onClick={() => {
            props.setDepartment({ idDepartment: props.data.id, departmentName: props.data.departmentName, idOrganisation: user?.idOrganisation, departmentManager: props.data.departmentManager, departmentManagerName: props.data.departmentManagerName });
            props.handleOpenAddUpdate("update");
            props.setFormValue({ ...props.formValue, idDepartment: props.data.id, departmentName: props.data.departmentName })//, departmentManager: props.data.departmentManager, departmentManagerName: props.data.departmentManagerName });
                                                        
          }} />
          <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
            props.setDepartment({ idDepartment: props.data.id, departmentName: props.data.departmentName, idOrganisation: user?.idOrganisation, departmentManager: props.data.departmentManager, departmentManagerName: props.data.departmentManagerName });
            props.handleOpenDelete();
          }} />
        </CardActions>
      </Card>
    </div>
  );
}
export default DepartmentCard;
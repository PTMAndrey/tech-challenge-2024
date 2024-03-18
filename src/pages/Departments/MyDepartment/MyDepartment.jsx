import React, { useEffect, useMemo, useState } from 'react'
import styles from '../Departments.module.scss'
import { useNavigate, useParams } from 'react-router';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import useStateProvider from '../../../hooks/useStateProvider';
import useAuthProvider from '../../../hooks/useAuthProvider';
import { getDepartmentByID, removeUserFromDepartment } from '../../../api/API';
import ListAvailableEmployees from './ListAvailableEmployees';

import {
    AddCircleOutlineIcon,
} from '../../imports/muiiconsMaterial';
import {
    Card,
    CardContent,
    CardActions,
    Stack,
    Box,
    Typography,
    Chip,
} from '../../imports/muiMaterial';
import Modal from '../../../components/ModalDialog/Modal';

const MyDepartment = () => {

    const { fetchDepartments,
        pageSizeMyDepartmentEmployees, currentPageMyDepartmentEmployees,
        setAlert
    } = useStateProvider();

    const { user } = useAuthProvider();
    const [department, setDepartment] = useState({});
    const navigate = useNavigate();
    const { width } = useWindowDimensions();

    const [showErrors, setShowErrors] = useState(false);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [sortBy, setSortBy] = useState('firstName');
    const [sortDirection, setSortDirection] = useState('Ascending');

    const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });
    const [openDelete, setOpenDelete] = useState(false);
    const [fetchDepartmentID,  setFetchDepartmentID] = useState(false);

    // get department from API
    useEffect(() => {
        (async () => {
            try {
                const response = await getDepartmentByID(user?.idDepartment);
                if (response?.status === 200) {
                    setDepartment(response.data);
                }

            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...", // Use the error message from the catch
                });
            }
        })();
    }, [user?.idDepartment,fetchDepartmentID]);

    const [showAllSkills, setShowAllSkills] = useState(false);

    const handleShowAllSkills = () => {
        setShowAllSkills(true);
    };

    const handleOpenDelete = () => {
        setOpenDelete(true);

    };

    const handleOpenAddUpdate = (action) => {
        setOpenAddUpdate({ open: true, action: action });
    }
    const handleCloseAddUpdate = () => {
        setOpenAddUpdate({ open: false, action: '' });
        setDepartment({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        // setFormValue({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        setShowErrors(false);
        setFetchDepartmentID(false);

    }

    function createData(id, firstName, lastName, emailAdress, userSkill) {
        return { id, firstName, lastName, emailAdress, userSkill };
    }

    const toggleSortDirectionAndColumn = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'Ascending' ? 'Descending' : 'Ascending');
        } else {
            setSortBy(column);
            setSortDirection('Ascending');
        }
    };

    useEffect(() => {
        const sortedDepartments = department?.users?.map(emp =>
            createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.userSkill)
        ).sort((a, b) => {
            if (sortDirection === 'Ascending') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        setRows(sortedDepartments || []);
    }, [department, sortDirection, sortBy]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows[0].length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currentTableData = useMemo(() => {
        if (rows) {
            const firstPageIndex = (currentPageMyDepartmentEmployees - 1) * pageSizeMyDepartmentEmployees;
            const lastPageIndex = firstPageIndex + pageSizeMyDepartmentEmployees;
            if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
                return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
            else
                return rows?.slice(firstPageIndex, lastPageIndex);
        }
        else
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSizeMyDepartmentEmployees, currentPageMyDepartmentEmployees, rows, sortDirection]);


    const handleRemoveUserFromDepartment = async (id) => {
        try {
            const response = await removeUserFromDepartment(id)
            if (response.status === 200 || response.status === 201) {
                handleCloseAddUpdate();
                setFetchDepartmentID(true);
                // const x = await fetchDepartments(user?.idOrganisation);
                setAlert({
                    type: "success",
                    message: "User removed from department!",
                });
                // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
            }
        } catch (error) {
            console.log(error.message, "error");
            handleCloseAddUpdate();
            setAlert({
                type: "danger",
                message: error.message || "Something went wrong...",
            });
        }
    }
    return (
        <section className={styles.cardMyDepartment}>
            <Card sx={{ minWidth: "180px !important" }}>
                <CardContent component="div">
                    <Typography variant="h4">
                        Department name
                    </Typography>

                    <Typography variant="subtitle2" sx={{ marginLeft: 2 }}>
                        {department.departmentName}
                    </Typography>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Department Manager
                    </Typography>

                    <Typography variant="subtitle2" sx={{ marginLeft: 2 }}>
                        You
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Department skills
                    </Typography>

                    <Typography variant="subtitle2" sx={{ marginLeft: 2 }}>

                        {department?.skills?.length !== 0 &&
                            <>
                                <CardContent className={`${styles.displaySkills} `}>
                                    {department?.skills?.length > 2 ? (
                                        <>
                                            {department?.skills?.slice(0, 3).map((skill) =>
                                                <Chip label={skill.skillName} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idSkill} />
                                            )}
                                            <Chip label={`+${department?.skills?.length - 2}`} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" onClick={handleShowAllSkills} />
                                        </>
                                    ) : (
                                        <>
                                            {department?.skills?.map((skill) =>
                                                <Chip label={skill.skillName} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idSkill} />
                                            )}
                                        </>
                                    )
                                    }
                                </CardContent>

                            </>
                        }

                    </Typography>
                </CardContent>
                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography gutterBottom variant="h6" component="div">
                        Employees in department
                    </Typography>
                    {currentTableData.length > 0 &&
                        <Typography variant="subtitle1">
                            <ListAvailableEmployees
                                currentTableData={currentTableData}
                                rows={rows}
                                handleOpenAddUpdate={handleOpenAddUpdate}
                                handleOpenDelete={handleOpenDelete}
                                sortDirection={sortDirection}
                                handleActionYes={handleRemoveUserFromDepartment}
                                // formValue={formValue}
                                // setFormValue={setFormValue}
                                toggleSortDirectionAndColumn={toggleSortDirectionAndColumn}

                            />
                        </Typography>

                    }

                    <Typography gutterBottom variant="h6" sx={{ marginTop: 2 }}>
                        <p>Department Manager</p>
                    </Typography>

                    <Typography variant="body2">
                        You
                    </Typography>
                </CardContent>
                <CardActions className={styles.cardButtons} sx={{ bgcolor: 'background.level1' }}>
                    <AddCircleOutlineIcon className={styles.tableButtons} />
                </CardActions>
            </Card>

            {
                showAllSkills && (
                    <Modal
                        open={showAllSkills}
                        handleClose={() => setShowAllSkills(false)}
                        title="Department skills"
                        content={
                            <Stack direction="column" spacing={2}>
                                {department?.skills?.map((skill, index) => (
                                    <Box key={skill.idUserSkill}>
                                        <Typography variant="body1" component="div">
                                            <>{index + 1}. {skill.skillName}</>
                                        </Typography>
                                        <Typography variant="body2" component="div" sx={{ marginLeft: 1 }}>
                                            <>* {skill.skillDescription}</>
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        }
                    />
                )
            }
        </section>
    )
}

export default MyDepartment
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
import AvailableEmpoyees from './AvailableEmpoyees';

const MyDepartment = () => {

    const { departmentByID,
        setDepartmentByID,
        fetchGetDepartmentByID,
        fetchGetUsersWithoutDepartment,
        pageSizeMyDepartmentEmployees, 
        currentPageMyDepartmentEmployees,
        setCurrentPageMyDepartmentEmployees,
        setAlert
    } = useStateProvider();

    const { user } = useAuthProvider();
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
    const [fetchDepartmentID, setFetchDepartmentID] = useState(false);

    // get department from API
    useEffect(() => {
        fetchGetDepartmentByID(user?.idDepartment);
    }, [user?.idDepartment, fetchDepartmentID]);

    const [showAllSkills, setShowAllSkills] = useState(false);

    const handleShowAllSkills = () => {
        setShowAllSkills(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setFetchDepartmentID(false);
    };


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
        const sortedDepartments = departmentByID?.users?.map(emp =>
            createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.userSkill)
        ).sort((a, b) => {
            if (sortDirection === 'Ascending') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        setRows(sortedDepartments || []);
    }, [departmentByID, fetchDepartmentID, sortDirection, sortBy]);

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
    }, [pageSizeMyDepartmentEmployees, fetchDepartmentID, currentPageMyDepartmentEmployees, rows, sortDirection]);


    const handleRemoveUserFromDepartment = async (id) => {
        try {
            const response = await removeUserFromDepartment(id)
            if (response.status === 200 || response.status === 201) {
                handleCloseDelete();
                setFetchDepartmentID(true);
                const x = await fetchGetUsersWithoutDepartment(user?.idOrganisation)
                const y = await fetchGetDepartmentByID(user?.idDepartment)
                // const x = await fetchDepartments(user?.idOrganisation);
                setAlert({
                    type: "success",
                    message: "User removed from department!",
                });
                // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
            }
        } catch (error) {
            console.log(error.message, "error");
            handleCloseDelete();
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
                        {departmentByID?.departmentName}
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

                        {departmentByID?.skills?.length !== 0 &&
                            <>
                                <CardContent className={`${styles.displaySkills} `}>
                                    {departmentByID?.skills?.length > 3 ? (
                                        <>
                                            {departmentByID?.skills?.slice(0, 3).map((skill) =>
                                                <Chip label={skill.skillName} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idSkill} />
                                            )}
                                            <Chip label={`+${departmentByID?.skills?.length - 3}`} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" onClick={handleShowAllSkills} />
                                        </>
                                    ) : (
                                        <>
                                            {departmentByID?.skills?.map((skill) =>
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
                        // <Typography variant="subtitle1">
                            <ListAvailableEmployees
                                currentTableData={currentTableData}
                                rows={rows}
                                sortDirection={sortDirection}
                                sortBy={sortBy}
                                handleActionYes={handleRemoveUserFromDepartment}
                                handleActionNo={handleCloseDelete}
                                toggleSortDirectionAndColumn={toggleSortDirectionAndColumn}
                                action="remove"
                                currentPage={currentPageMyDepartmentEmployees}
                                pageSize={pageSizeMyDepartmentEmployees}
                                setCurrentPage={setCurrentPageMyDepartmentEmployees}
                            />
                        // </Typography>

                    }
                </CardContent>
                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography gutterBottom variant="h6" component="div">
                        Add more employees
                    </Typography>

                    <AvailableEmpoyees
                        setFetchDepartmentID={setFetchDepartmentID} fetchDepartmentID={fetchDepartmentID} />
                </CardContent>

            </Card >

            {
                showAllSkills && (
                    <Modal
                        open={showAllSkills}
                        handleClose={() => setShowAllSkills(false)}
                        title="Department skills"
                        content={
                            <Stack direction="column" spacing={2}>
                                {departmentByID?.skills?.map((skill, index) => (
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
                        handleActionNo={() => setShowAllSkills(false)}
                        textActionNo={"Close"}
                    />
                )
            }
        </section >
    )
}

export default MyDepartment
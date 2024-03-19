import React, { useEffect, useMemo, useState } from 'react'
import styles from '../Departments.module.scss'
import { useNavigate, useParams } from 'react-router';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import useStateProvider from '../../../hooks/useStateProvider';
import useAuthProvider from '../../../hooks/useAuthProvider';
import { addUserToDepartment, getDepartmentByID, getUsersWithoutDepartment, removeUserFromDepartment } from '../../../api/API';
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

const AvailableEmployees = (props) => {

    const { 
        usersWithoutDepartment, 
        setUsersWithoutDepartment,
        fetchGetDepartmentByID,
        fetchGetUsersWithoutDepartment,

        pageSizeMyDepartmentEmployeesWithoutDepartment, 
        currentPageMyDepartmentEmployeesWithoutDepartment,
        setCurrentPageMyDepartmentEmployeesWithoutDepartment,
        setAlert
    } = useStateProvider();

    const { user } = useAuthProvider();
    const navigate = useNavigate();
    const { width } = useWindowDimensions();

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [sortBy, setSortBy] = useState('firstName');
    const [sortDirection, setSortDirection] = useState('Ascending');

    const [openAddUpdate, setOpenAddUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [fetchAvailableUsers, setFetchAvailableUsers] = useState(false);

    // get usersWithoutDepartment from API
    useEffect(() => {
       fetchGetUsersWithoutDepartment(user?.idOrganisation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.idDepartment, props.fetchDepartmentID, fetchAvailableUsers]);

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
        const sortedDepartments = usersWithoutDepartment?.map(emp =>
            createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.userSkill)
        ).sort((a, b) => {
            if (sortDirection === 'Ascending') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        setRows(sortedDepartments || []);
    }, [usersWithoutDepartment, sortDirection, fetchAvailableUsers, sortBy]);


    const currentTableData = useMemo(() => {
        if (rows) {
            const firstPageIndex = (currentPageMyDepartmentEmployeesWithoutDepartment - 1) * pageSizeMyDepartmentEmployeesWithoutDepartment;
            const lastPageIndex = firstPageIndex + pageSizeMyDepartmentEmployeesWithoutDepartment;
            if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
                return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
            else
                return rows?.slice(firstPageIndex, lastPageIndex);
        }
        else
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSizeMyDepartmentEmployeesWithoutDepartment, fetchAvailableUsers, currentPageMyDepartmentEmployeesWithoutDepartment, rows, sortDirection]);


    const handleAddUserToDepartment = async (id) => {
        try {
            const response = await addUserToDepartment(id, user?.idDepartment)
            if (response.status === 200 || response.status === 201) {
                props.setFetchDepartmentID(true);
                setFetchAvailableUsers(true);
                const x = await fetchGetDepartmentByID( user?.idDepartment)
                const y = await fetchGetUsersWithoutDepartment(user?.idOrganisation)
                setAlert({
                    type: "success",
                    message: "User added to department!",
                });

            }
        } catch (error) {
            console.log(error.message, "error");
            props.setFetchDepartmentID(false);
            setFetchAvailableUsers(false);
            setAlert({
                type: "danger",
                message: error.message || "Something went wrong...",
            });
        }
    }
    return (
        <>
        {usersWithoutDepartment ?
            <Card sx={{ minWidth: "180px !important" }}>
                {currentTableData.length > 0 &&
                    <Typography variant="subtitle1">
                        <ListAvailableEmployees
                            currentTableData={currentTableData}
                            rows={rows}
                            sortDirection={sortDirection}
                            sortBy={sortBy}
                            handleActionYes={handleAddUserToDepartment}
                            toggleSortDirectionAndColumn={toggleSortDirectionAndColumn}
                            action="add"
                            currentPage={currentPageMyDepartmentEmployeesWithoutDepartment}
                            pageSize={pageSizeMyDepartmentEmployeesWithoutDepartment}
                            setCurrentPage={setCurrentPageMyDepartmentEmployeesWithoutDepartment}
                        />
                    </Typography>

                }
            </Card >
            :
            <p>Nu exista personal disponibil momentan</p>
}
        </ >
    )
}

export default AvailableEmployees
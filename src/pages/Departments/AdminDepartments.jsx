import React, { useEffect, useMemo, useState } from 'react'
import useAuthProvider from '../../hooks/useAuthProvider';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useStateProvider from '../../hooks/useStateProvider';
import styles from './Departments.module.scss'
import TableNotFound from '../../components/Tables/TableNotFound'
import Button from '../../components/Button/Button'
import Modal from '../../components/ModalDialog/Modal';
import Input from '../../components/input/Input'
import ListDepartments from './ListDepartments';
import DropdownComponent from '../../components/Dropdown/Dropdown';

import PropTypes from 'prop-types';

import {
    styled,
    StyledEngineProvider,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    TableFooter,
    TablePagination,
    Tooltip
} from '../imports/muiMaterial';

import {
    FirstPageIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
    LastPageIcon,
    AddCircleOutlineIcon,
    DeleteForeverIcon,
    BorderColorIcon,
    TextRotationAngleupIcon,
    TextRotationAngledownIcon
} from '../imports/muiiconsMaterial';
import { useTheme } from '@emotion/react';
import { addDepartment, addDepartmentManager, deleteDepartment, removeDepartmentManagerFromDepartment, updateDepartment } from '../../api/API';
import { useNavigate } from 'react-router';


const AdminDepartments = () => {
    const { setAlert, departments, fetchDepartments,
        currentPageDepartments, pageSizeDepartments,
        fetchUnassignedDepartmentManagers,
        managersWithoutDepartments_dropdown,
    } = useStateProvider();
    const { user } = useAuthProvider();
    const { width } = useWindowDimensions();
    const navigate = useNavigate();
    const [department, setDepartment] = useState({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" });
    const [formValue, setFormValue] = useState({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" });

    useEffect(() => {
        fetchDepartments(user?.idOrganisation);
        fetchUnassignedDepartmentManagers(user?.idOrganisation);


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });
    const [openDelete, setOpenDelete] = useState(false);

    const [showErrors, setShowErrors] = useState(false);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [sortBy, setSortBy] = useState('departmentName');
    const [sortDirection, setSortDirection] = useState('Ascending');
    const [removeDM, setRemoveDM] = useState(false);

    const toggleRemoveDM = () => {
        setRemoveDM(!removeDM);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const isFormValid = () => {
        let isValid = true;
        Object.keys(formValue).forEach((field) => {
            if (checkErrors(field)) {
                isValid = false;
            }
        });
        return isValid;
    };

    const checkErrors = (field) => {
        if (field === "departmentName") {
            if (formValue.departmentName.length < 4 && formValue.departmentName.length > 0) {
                return "Min 4 characters required.";
            } else if (formValue.departmentName.length === 0) {
                return "Min 4 characters required.";
            }
        }
        return "";
    }
    const handleOpenDelete = () => {
        setOpenDelete(true);

    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDepartment({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        setFormValue({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        setShowErrors(false);
        setRemoveDM(false);
    };

    const handleOpenAddUpdate = (action) => {
        setOpenAddUpdate({ open: true, action: action });
    }
    const handleCloseAddUpdate = () => {
        setOpenAddUpdate({ open: false, action: '' });
        setDepartment({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        setFormValue({ idDepartment: "", departmentName: "", idOrganisation: user?.idOrganisation, departmentManager: "", departmentManagerName: "" })
        setShowErrors(false);
        setRemoveDM(false);
    }

    const handleAddDepartment = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = await addDepartment(user?.idUser, { idOrganisation: formValue.idOrganisation, departmentName: formValue.departmentName, departmentManager: formValue.departmentManager });
                if (response.status === 200 || response.status === 201) {
                    handleCloseAddUpdate();
                    const x = await fetchDepartments(user?.idOrganisation);
                    setAlert({
                        type: "success",
                        message: "You added a new department!",
                    });
                }
            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...",
                });
            }
        }
    }

    const handleUpdateDepartment = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = await updateDepartment(formValue.idDepartment, { idOrganisation: formValue.idOrganisation, departmentName: formValue.departmentName })
                if (response.status === 200 || response.status === 201) {
                    handleCloseAddUpdate();
                    const x = await fetchDepartments(user?.idOrganisation);
                    // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation); 
                    setAlert({
                        type: "success",
                        message: "Update complete!",
                    });
                }
            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...",
                });
            }
        }
    }

    const handleAddManager = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = await addDepartmentManager(formValue.departmentManager, formValue.idDepartment)
                if (response.status === 200 || response.status === 201) {
                    handleCloseAddUpdate();
                    const x = await fetchDepartments(user?.idOrganisation);
                    setAlert({
                        type: "success",
                        message: "Manager assigned to " + formValue.departmentName + "!",
                    });
                    const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
                }
            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...",
                });
            }
        }
    }
    const handleRemoveDM = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                console.log(formValue.departmentManager);
                const response = await removeDepartmentManagerFromDepartment(formValue.departmentManager)
                if (response.status === 200 || response.status === 201) {
                    
                    handleCloseAddUpdate();
                    const x = await fetchDepartments(user?.idOrganisation);
                    setAlert({
                        type: "success",
                        message: "Department manager removed!",
                    });
                    const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
                }
            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...",
                });
            }
        }
    }


    const handleDeleteDepartment = async () => {
        try {
            const response = await deleteDepartment(formValue.idDepartment);
            if (response.status === 200 || response.status === 201) {
                handleCloseDelete();
                const x = await fetchDepartments(user?.idOrganisation);
                setAlert({
                    type: "success",
                    message: "Department deleted!",
                });
                const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
            }
        } catch (error) {
            console.log(error.message, "error");
            setAlert({
                type: "danger",
                message: error.message || "Something went wrong...",
            });
        }
    }

    function createData(id, departmentName, departmentManager, departmentManagerName) {
        return { id, departmentName, departmentManager, departmentManagerName };
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
        const sortedDepartments = departments?.map(dep =>
            createData(dep.idDepartment, dep.departmentName, dep.departmentManager, dep.departmentManagerName)
        ).sort((a, b) => {
            if (sortDirection === 'Ascending') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        setRows(sortedDepartments || []);
    }, [departments, sortDirection, sortBy]);

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
            const firstPageIndex = (currentPageDepartments - 1) * pageSizeDepartments;
            const lastPageIndex = firstPageIndex + pageSizeDepartments;

            if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
                return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
            else
                return rows?.slice(firstPageIndex, lastPageIndex);
        }
        else
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageDepartments, pageSizeDepartments, rows, sortDirection]);




    return (
        <section className={styles.pageTeamRoles}>
            {departments?.length === 0 ? <>
                <Button
                    className={styles.addDepartment}
                    label="Add Department"
                    icon={<AddCircleOutlineIcon />}
                    position="left"
                    variant="primary"
                    border={false}
                    onClick={() => { handleOpenAddUpdate('add') }}
                />
                <TableNotFound />
            </>
                :
                <div>
                    <Button
                        className={styles.addDepartment}
                        label="Add department"
                        icon={<AddCircleOutlineIcon />}
                        position="left"
                        variant="primary"
                        border={false}
                        onClick={() => { handleOpenAddUpdate('add') }}
                    />
                    {width > 460 ?
                        <TableContainer component={Paper} className={styles.table}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Name
                                            <Tooltip
                                                title={"Order by department name"}
                                                placement='top-end'
                                                arrow
                                                onClick={() => toggleSortDirectionAndColumn('departmentName')} className={styles.iconWhite}
                                            >
                                                <IconButton className={styles.iconStyle}>
                                                    {sortDirection === 'Ascending' && sortBy === 'departmentName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Manager
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Update</StyledTableCell>
                                        <StyledTableCell align="center">Delete</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows
                                    )?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" style={{ width: 160 }} align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {row?.departmentName}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {!row?.departmentManager ?
                                                    <Tooltip
                                                        title='Add department manager'
                                                        placement='top-start'
                                                        arrow
                                                        onClick={() => {
                                                            setDepartment({ idDepartment: row?.id, departmentName: row?.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
                                                            handleOpenAddUpdate("addManager");
                                                        }} >
                                                        <IconButton className={styles.iconStyle}>
                                                            <AddCircleOutlineIcon className={styles.tableButtons} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    :
                                                    <>
                                                        {row?.departmentManagerName}
                                                        {/* <Tooltip
                                                            title='Update manager'
                                                            placement='top-start'
                                                            arrow
                                                            onClick={() => {
                                                                setDepartment({ idDepartment: row?.id, departmentName: row.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
                                                                handleOpenAddUpdate('update');
                                                            }} >
                                                            <IconButton>
                                                                <BorderColorIcon className={styles.tableButtons} />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </>
                                                }
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                <Tooltip
                                                    title='Update department'
                                                    placement='top-start'
                                                    arrow
                                                    onClick={() => {
                                                        setDepartment({ idDepartment: row?.id, departmentName: row.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
                                                        handleOpenAddUpdate('update');
                                                    }} >
                                                    <IconButton>
                                                        <BorderColorIcon className={styles.tableButtons} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                <Tooltip
                                                    title='Delete deaprtment'
                                                    placement='top-start'
                                                    arrow
                                                    onClick={() => {
                                                        setFormValue({ idDepartment: row?.id, departmentName: row?.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
                                                        handleOpenDelete();
                                                    }} >
                                                    <IconButton>
                                                        <DeleteForeverIcon className={styles.tableButtons} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[3, 5, 10, { label: 'All', value: -1 }]}
                                            colSpan={5}
                                            count={rows?.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>

                        :
                        <>
                            <ListDepartments
                                currentTableData={currentTableData}
                                rows={rows}
                                setTeamRole={setDepartment}
                                handleOpenAddUpdate={handleOpenAddUpdate}
                                handleOpenDelete={handleOpenDelete}
                                sortDirection={sortDirection}
                                toggleSortDirectionAndColumn={toggleSortDirectionAndColumn}
                            />
                        </>
                    }

                </div>
            }
            {openAddUpdate.open &&
                <StyledEngineProvider injectFirst>
                    <Modal
                        open={openAddUpdate.open}
                        handleClose={handleCloseAddUpdate}
                        title={openAddUpdate.action === 'add' ? "Add new department" : openAddUpdate.action === 'addManager' ? "Add new manager" : (<>{"Update"} <br /> {"[" + formValue.departmentName + "]"}</>)}
                        content={
                            <>
                                {(openAddUpdate.action === 'add' || openAddUpdate.action === 'update') &&
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        label="Department name"
                                        id="departmentName"
                                        name="departmentName"
                                        value={formValue.departmentName}
                                        onChange={handleChange}

                                        required
                                        error={showErrors && checkErrors("departmentName") ? true : false}
                                        helper={showErrors ? checkErrors("departmentName") : ""}
                                    />
                                }
                                {(openAddUpdate.action === 'addManager' || openAddUpdate.action === 'update') &&
                                    <>
                                        {managersWithoutDepartments_dropdown[0] !== null ?
                                            <>
                                                {!removeDM && <>
                                                    <p>Choose a department manager</p><br />
                                                    <DropdownComponent
                                                        title={formValue.departmentManager === '' && 'Department managers'}
                                                        options={managersWithoutDepartments_dropdown}
                                                        onChange={(e) => {
                                                            e === null ?
                                                                setFormValue({ ...formValue, idDepartment:'', departmentManager: '', departmentManagerName: '' }) :
                                                                // setDepartment({ idUser: formValue.id, idRole: e.value });
                                                                setFormValue({ ...formValue, idDepartment: department.idDepartment, departmentManager: e.value, departmentManagerName: e.label })

                                                        }}
                                                        error={showErrors && checkErrors('departmentManager') ? true : false}
                                                        helper={showErrors ? checkErrors('departmentManager') : ''}
                                                    />
                                                </>}
                                            </>
                                            :
                                            <>
                                                <p>No managers available</p>
                                                {user?.authorities.some(authority => authority.authority === "ORGANISATION_ADMIN") &&
                                                    <Button
                                                        label="Add department managers"
                                                        variant="secondary"
                                                        border={false}
                                                        onClick={() => { navigate('/employees/all') }}
                                                    />
                                                }
                                            </>
                                        }
                                    </>
                                }
                                {openAddUpdate.action === 'update' &&
                                    <>
                                        {(formValue.departmentManager) && <>
                                            <h2>OR</h2>
                                            <Input
                                                type="checkbox"
                                                checked={removeDM}
                                                label={"Remove " + formValue.departmentManagerName + " as department manager"}
                                                value={formValue.departmentManagerName}
                                                onChange={toggleRemoveDM}
                                            />
                                        </>
                                        }
                                        {/* {!removeDM &&
                                            <><p>Change the department manager</p><br />
                                                <DropdownComponent
                                                    title={formValue.departmentManager && 'Department managers'}
                                                    options={managersWithoutDepartments_dropdown}
                                                    onChange={(e) => {
                                                        e === null ?
                                                            setDepartment({ ...department, departmentManager: '', departmentManagerName: '' }) :
                                                            // setDepartment({ idUser: formValue.id, idRole: e.value });
                                                            setDepartment({ ...department, idDepartment: formValue.id, departmentManager: e.value, departmentManagerName: e.label })

                                                    }}
                                                    error={showErrors && checkErrors('departmentManager') ? true : false}
                                                    helper={showErrors ? checkErrors('departmentManager') : ''}
                                                />
                                            </>
                                        } */}
                                    </>

                                }
                            </>
                        }
                        handleActionYes={() =>
                            openAddUpdate.action === 'add' ?
                                handleAddDepartment()
                                :
                                openAddUpdate.action === 'addManager' || openAddUpdate.action === 'update'?
                                    handleAddManager()
                                    :
                                    removeDM ?
                                        handleRemoveDM()
                                        :
                                        handleUpdateDepartment()
                        }
                        textActionYes={"Confirm"}
                        handleActionNo={handleCloseAddUpdate}
                        textActionNo={"Cancel"}
                    />
                </StyledEngineProvider>
            }
            {
                openDelete &&
                <StyledEngineProvider injectFirst>
                    <Modal
                        open={openDelete}
                        handleClose={handleCloseDelete}
                        title={(<>{"Delete"} <br /> {"[" + formValue.departmentName + "]"}</>)}
                        content={"This action is permanent!"}
                        handleActionYes={() => handleDeleteDepartment()}
                        textActionYes={"Delete"}
                        handleActionNo={handleCloseDelete}
                        textActionNo={"Cancel"}
                    />
                </StyledEngineProvider>
            }
        </section >
    )
}

export default AdminDepartments;


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));



function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowLeftIcon />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRightIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}


TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

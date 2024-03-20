import React, { useEffect, useMemo, useState } from 'react'
import styles from '../Skills.module.scss';
import TableNotFound from '../../../components/Tables/TableNotFound'
import Button from '../../../components/Button/Button'
import Modal from '../../../components/ModalDialog/Modal';
import Input from '../../../components/input/Input'
import useStateProvider from '../../../hooks/useStateProvider'
import useAuthProvider from '../../../hooks/useAuthProvider';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

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
} from '../../imports/muiMaterial';

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
} from '../../imports/muiiconsMaterial';

import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import ListSkillCategories from './ListSkillCategories';
import { addSkillCategory, deleteSkillCategory, updateSkillCategory } from '../../../api/API';


const SkillCategories = () => {
    const { pageSize,
        allSkillCategory,
        currentPageSkillCategories,
        setCurrentPageSkillCategories,

        fetchAllSkillCategory,
        allSkillCategory_dropdown,
        allSkillsFromCategory_dropdown,
        setAlert,

    } = useStateProvider();
    const { user } = useAuthProvider();
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (user?.idUser) {
            (async () => {
                const z = await fetchAllSkillCategory(user?.idOrganisation);
            })();
            // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.idUser]);

    const [selectedSkillInTable, setSelectedSkillInTable] = useState({ idSkillCategory: null, skillCategoryName: "" });
    const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });
    const [openDelete, setOpenDelete] = useState(false);

    const [showErrors, setShowErrors] = useState(false);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [sortBy, setSortBy] = useState('skillCategoryName');
    const [sortDirection, setSortDirection] = useState('Ascending');
    const [formValue, setFormValue] = useState({ idSkillCategory: null, skillCategoryName: "" });



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
        if (field === "skillCategoryName") {
            if (formValue?.skillCategoryName.length < 4 && formValue?.skillCategoryName.length > 0) {
                return "Min 4 characters required.";
            } else if (formValue?.skillCategoryName.length === 0) {
                return "Field is required!";
            }
        }
        return "";
    }

    const handleOpenDelete = () => {
        setOpenDelete(true);

    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedSkillInTable({ idSkillCategory: null, skillCategoryName: "" })
        setFormValue({ idSkillCategory: null, skillCategoryName: "" })
        setShowErrors(false);
    };

    const handleOpenAddUpdate = (action) => {
        setOpenAddUpdate({ open: true, action: action });
    }
    const handleCloseAddUpdate = () => {
        setOpenAddUpdate({ open: false, action: '' });
        setSelectedSkillInTable({ idSkillCategory: null, skillCategoryName: "" })
        setFormValue({ idSkillCategory: null, skillCategoryName: "" })
        setShowErrors(false);

    }

    const handleAddSkillCategory = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = await addSkillCategory(user?.idUser, { skilCategoryName: formValue.skillCategoryName, idOrganisation: user?.idOrganisation });
                if (response.status === 200 || response.status === 201) {
                    fetchAllSkillCategory(user?.idOrganisation);
                    setAlert({
                        type: "success",
                        message: "You added a new category!",
                    });
                    handleCloseAddUpdate();
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

    const handleUpdateSkillCategory = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = await updateSkillCategory(formValue.idSkillCategory, { skilCategoryName: formValue.skillCategoryName, idOrganisation: user?.idOrganisation });
                if (response.status === 200 || response.status === 201) {
                    fetchAllSkillCategory(user?.idOrganisation);
                    setAlert({
                        type: "success",
                        message: "Update complete!",
                    });
                    handleCloseAddUpdate();
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

    const handleDeleteSkillCategory = async () => {
        try {
            const response = await deleteSkillCategory(selectedSkillInTable.idSkillCategory);
            if (response.status === 200 || response.status === 201) {
                fetchAllSkillCategory(user?.idOrganisation);
                setAlert({
                    type: "success",
                    message: "Skill category deleted!",
                });
                handleCloseDelete();
            }
        } catch (error) {
            console.log(error.message, "error");
            setAlert({
                type: "danger",
                message: error.message || "Something went wrong...",
            });
        }
    }

    function createData(id, skillCategoryName) {
        return { id, skillCategoryName };
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
        const sortedDepartments = allSkillCategory?.map(skill =>
            createData(skill.idSkillCategory, skill.skillCategoryName)
        ).sort((a, b) => {
            if (sortDirection === 'Ascending') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        setRows(sortedDepartments || []);
    }, [allSkillCategory, sortDirection, sortBy]);



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
            const firstPageIndex = (currentPageSkillCategories - 1) * pageSize;
            const lastPageIndex = firstPageIndex + pageSize;

            if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
                return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
            else
                return rows?.slice(firstPageIndex, lastPageIndex);
        }
        else
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageSkillCategories, pageSize, rows, sortDirection]);

    return (
        <section>
            {allSkillCategory?.length === 0 ? <>
                <Button
                    className={styles.addSkill}
                    label="Add category"
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
                        className={styles.addSkill}
                        label="Add category"
                        icon={<AddCircleOutlineIcon />}
                        position="left"
                        variant="primary"
                        border={false}
                        onClick={() => { handleOpenAddUpdate('add') }}
                    />
                    {width > 550 ?
                        <TableContainer component={Paper} className={styles.table}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Category name
                                            <Tooltip
                                                title={"Order by category name"}
                                                placement='top-end'
                                                arrow
                                                onClick={() => toggleSortDirectionAndColumn('skillCategoryName')} className={styles.iconWhite}
                                            >
                                                <IconButton className={styles.iconStyle}>
                                                    {sortDirection === 'Ascending' && sortBy === 'skillCategoryName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                                                </IconButton>
                                            </Tooltip>
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
                                                {row?.skillCategoryName}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                <Tooltip
                                                    title='Update category'
                                                    placement='top-start'
                                                    arrow
                                                    onClick={() => {
                                                        setSelectedSkillInTable({ idSkillCategory: row?.id, skillCategoryName: row?.skillCategoryName });
                                                        setFormValue({ idSkillCategory: row?.id, skillCategoryName: row?.skillCategoryName });
                                                        handleOpenAddUpdate('update');
                                                    }} >
                                                    <IconButton>
                                                        <BorderColorIcon className={styles.tableButtons} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                <Tooltip
                                                    title='Delete category'
                                                    placement='top-start'
                                                    arrow
                                                    onClick={() => {
                                                        setSelectedSkillInTable({ idSkillCategory: row?.id, skillCategoryName: row?.skillCategoryName });
                                                        setFormValue({ ...formValue, idSkillCategory: row?.id });
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
                            <ListSkillCategories
                                currentTableData={currentTableData}
                                rows={rows}
                                setSelectedSkillInTable={setSelectedSkillInTable}
                                handleOpenAddUpdate={handleOpenAddUpdate}
                                handleOpenDelete={handleOpenDelete}
                                sortDirection={sortDirection}
                                sortBy={sortBy}
                                toggleSortDirection={toggleSortDirectionAndColumn}
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
                        title={openAddUpdate.action === 'add' ? "Add new role" : (<>{"Update"} <br /> {"[" + selectedSkillInTable.skillCategoryName + "]"}</>)}
                        content={
                            <Input
                                type="text"
                                placeholder="Category name"
                                label="Skill category name"
                                id="skillCategoryName"
                                name="skillCategoryName"
                                value={formValue.skillCategoryName}
                                onChange={handleChange}

                                required
                                error={showErrors && checkErrors("skillCategoryName") ? true : false}
                                helper={showErrors ? checkErrors("skillCategoryName") : ""}
                            />
                        }
                        handleActionYes={() => openAddUpdate.action === 'add' ? handleAddSkillCategory() : handleUpdateSkillCategory()}
                        textActionYes={"Confirm"}
                        handleActionNo={handleCloseAddUpdate}
                        textActionNo={"Cancel"}
                    />
                </StyledEngineProvider>
            }
            {openDelete &&
                <StyledEngineProvider injectFirst>
                    <Modal
                        open={openDelete}
                        handleClose={handleCloseDelete}
                        title={(<>{"Delete"} <br /> {"[" + selectedSkillInTable.skillCategoryName + "]"}</>)}
                        content={"This action is permanent!"}
                        handleActionYes={() => handleDeleteSkillCategory()}
                        textActionYes={"Delete"}
                        handleActionNo={handleCloseDelete}
                        textActionNo={"Cancel"}
                    />
                </StyledEngineProvider>
            }
        </section>
    )
}

export default SkillCategories;


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

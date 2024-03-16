import React, { useEffect, useMemo, useState } from 'react'
import styles from './Users.module.scss';
import { addRoleToEmployee, deleteRoleFromEmployee } from '../../api/API';
import TableNotFound from '../../components/Tables/TableNotFound'
import Modal from '../../components/ModalDialog/Modal';
import useStateProvider from '../../hooks/useStateProvider'
import useAuthProvider from '../../hooks/useAuthProvider';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import ListEmployeesForMobile from './ListEmployeesForMobile';
import DropdownComponent from '../../components/Dropdown/Dropdown';

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
  Tooltip,
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

const AllEmployees = () => {
  const { employees, fetchEmployees,
    currentPageEmployees, pageSize,
    organisationRoles, fetchOrganisationRoles
  } = useStateProvider();
  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchEmployees(user?.idOrganisation);
    fetchOrganisationRoles(user?.idOrganisation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let userRolesPerRow = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let availableRolesToAdd = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let currentRolesToDelete = [];

  const { setAlert } = useStateProvider();
  const [showErrors, setShowErrors] = useState(false);

  const [employeeInTable, setEmployeeInTable] = useState(null);
  const [openAddRole, setOpenAddRole] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);


  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3); // Numarul de informatii pe o paginatie
  const [sortBy, setSortBy] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('Ascending');

  const [formValue, setFormValue] = useState({
    idUser: user?.idUser,
    idRole: '',
  });

  const handleOpenAddRole = () => {
    setOpenAddRole(true);
  }
  const handleCloseAddRole = () => {
    setOpenAddRole(false);
    setEmployeeInTable(null)
    userRolesPerRow = [];
    availableRolesToAdd = [];
    setFormValue({ ...formValue, idRole: '' })
  }

  const handleOpenDeleteRole = () => {
    setOpenDelete(true);

  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setEmployeeInTable(null)
    userRolesPerRow = [];
    availableRolesToAdd = [];
    setFormValue({ ...formValue, idRole: '' })
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
    console.log(formValue);
    if (field === 'idRole') {
      if (formValue.idRole === '') {
        return "Choose a role!";
      }
    }
    return "";
  }

  const handleAddUserRole = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await addRoleToEmployee(formValue.idUser, formValue.idRole);
        if (response.status === 200 || response.status === 201) {
          const x = await fetchEmployees(user?.idOrganisation);
          setAlert({
            type: "success",
            message: "You added a new role!",
          });
          handleCloseAddRole();
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

  const handleDeleteTeamRole = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await deleteRoleFromEmployee(formValue.idUser, formValue.idRole);
        if (response.status === 200 || response.status === 201) {
          const x = await fetchEmployees(user?.idOrganisation);
          setAlert({
            type: "success",
            message: "You removed the role!",
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
  }


  const toggleSortDirectionAndColumn = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'Ascending' ? 'Descending' : 'Ascending');
    } else {
      setSortBy(column);
      setSortDirection('Ascending');
    }
  };


  function createData(id, firstName, lastName, emailAdress, authorities) {
    return { id, firstName, lastName, emailAdress, authorities };
  }

  useEffect(() => {
    const sortedEmployees = employees?.map(emp =>
      createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.authorities)
    ).sort((a, b) => {
      if (sortDirection === 'Ascending') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });
    setRows(sortedEmployees || []);
  }, [employees, sortDirection, sortBy]);

  console.log(rows);

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
      const firstPageIndex = (currentPageEmployees - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;

      if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
        return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
      else
        return rows?.slice(firstPageIndex, lastPageIndex);
    }
    else
      return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageEmployees, pageSize, rows, sortDirection]);

  // formatAuthority and renderUserRoles used for display roles in table
  const formatAuthority = (authority) => {
    return authority
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderUserRoles = (data,info) => {
    console.log();
    if (Array.isArray(info)) {
      return info.map((item,index) => (
        <li key={`${data.id}_${item.id}_${Math.random()}`}>{formatAuthority(item.authority)}</li>
      ))
    }
    else return info;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    organisationRoles?.map(item =>
      userRolesPerRow.push({ value: item.id, label: `${formatAuthority(item.authority)}` })
    );
  }, [organisationRoles, userRolesPerRow]);

  useEffect(() => {
    if (employeeInTable) {
      userRolesPerRow
        .filter(role =>
          !employeeInTable?.authorities.map(authority =>
            formatAuthority(authority.authority)
          ).includes(role.label)
        )
        .filter(role => formValue.idRole !== '' ? role.value !== formValue.idRole : role.value)
        .map(item =>
          availableRolesToAdd.push({ value: item.value, label: item.label })
        );

      userRolesPerRow
        .filter(role =>
          employeeInTable?.authorities.map(authority =>
            formatAuthority(authority.authority)
          ).includes(role.label)
        )
        .filter(role => formValue.idRole !== '' ? role.value !== formValue.idRole : role.value)
        .map(item =>
          currentRolesToDelete.push({ value: item.value, label: item.label })
        );
    }
  }, [availableRolesToAdd, employeeInTable, userRolesPerRow, formValue.idRole, currentRolesToDelete]);




  return (
    <section className={styles.pageAllEmployees}>
      {employees?.length === 0 ?
        <TableNotFound />
        :
        <div>
          {width > 550 ?
            <TableContainer component={Paper} className={styles.table}>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                    <StyledTableCell align="center">
                      First Name
                      {/* <IconButton onClick={() => toggleSortDirectionAndColumn('firstName')} className={styles.iconWhite}>
                        {sortDirection === 'Ascending' && sortBy === 'firstName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
                      </IconButton> */}
                      <Tooltip
                        title={"Order by first name"}
                        placement='top-end'
                        arrow
                        onClick={() => toggleSortDirectionAndColumn('firstName')} className={styles.iconWhite}
                      >
                        <IconButton className={styles.iconStyle}>
                          {sortDirection === 'Ascending' && sortBy === 'firstName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Last Name
                      {/* <IconButton>
                        </IconButton> */}
                      <Tooltip
                        title={"Order by last name"}
                        placement='top-end'
                        arrow
                        onClick={() => toggleSortDirectionAndColumn('lastName')} className={styles.iconWhite}
                      >
                        <IconButton className={styles.iconStyle}>
                          {sortDirection === 'Ascending' && sortBy === 'lastName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Roles</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  )?.map((row, index) => (
                    <TableRow key={row?.id} >
                      <TableCell component="th" scope="row" style={{ width: 160 }} align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.firstName}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.lastName}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.emailAdress}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <ul key={`${row?.id}&${2 * index}`} className={styles.listOfRoles}>{renderUserRoles(row, row?.authorities)}</ul>
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <div className={styles.allEmployeesButtonsAction}>
                          {row?.authorities.length !== 3 &&
                            <Tooltip
                              title='Add role'
                              placement='top-end'
                              arrow
                              onClick={() => {
                                setEmployeeInTable(row); handleOpenAddRole();
                              }} >
                              <IconButton className={styles.iconStyle}>
                                <AddCircleOutlineIcon className={styles.tableButtons} />
                              </IconButton>
                            </Tooltip>
                          }
                          {row?.authorities.some(authority => authority.authority !== "EMPLOYEE") &&
                            <Tooltip
                              title='Delete role'
                              placement='top-end'
                              arrow
                              onClick={() => {
                                setEmployeeInTable(row); handleOpenDeleteRole();
                              }}>
                              <IconButton className={styles.iconStyle}>
                                <DeleteForeverIcon className={styles.tableButtons} />
                              </IconButton>
                            </Tooltip>
                          }
                        </div>
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
              <ListEmployeesForMobile
                currentTableData={currentTableData}
                rows={rows}
                setEmployeeInTable={setEmployeeInTable}
                handleOpenAddRole={handleOpenAddRole}
                handleOpenDeleteRole={handleOpenDeleteRole}
                sortDirection={sortDirection}
                toggleSortDirection={toggleSortDirectionAndColumn}
                renderUserRoles={renderUserRoles}
                sortBy={sortBy}
              />
            </>
          }

        </div>
      }
      {openAddRole &&
        <StyledEngineProvider injectFirst>
          <Modal
            open={openAddRole}
            handleClose={handleCloseAddRole}
            title={"Assign new role"}
            content={
              <>
                <p>Choose a role from menu</p><br />
                <DropdownComponent
                  title={formValue.idRole === '' && 'Roles'}
                  options={availableRolesToAdd}
                  onChange={(e) => {
                    e === null ?
                      setFormValue({ ...formValue, idRole: '' }) :
                      setFormValue({ idUser: employeeInTable.id, idRole: e.value });
                  }}
                  error={showErrors && checkErrors('idRole') ? true : false}
                  helper={showErrors ? checkErrors('idRole') : ''}
                />
              </>
            }
            handleActionYes={() => handleAddUserRole()}
            textActionYes={"Confirm"}
            handleActionNo={handleCloseAddRole}
            textActionNo={"Cancel"}
          />
        </StyledEngineProvider>
      }
      {openDelete &&
        <StyledEngineProvider injectFirst>
          <Modal
            open={openDelete}
            handleClose={handleCloseDelete}
            title={"Delete a role"}
            content={
              <>
                <p>This action is permanent!</p><br />
                <DropdownComponent
                  title={formValue.idRole === '' && 'Roles'}
                  options={currentRolesToDelete}
                  onChange={(e) => {
                    e === null ?
                      setFormValue({ ...formValue, idRole: '' }) :
                      setFormValue({ idUser: employeeInTable.id, idRole: e.value });
                  }}
                  error={showErrors && checkErrors('idRole') ? true : false}
                  helper={showErrors ? checkErrors('idRole') : ''}
                />
              </>}
            handleActionYes={() => handleDeleteTeamRole()}
            textActionYes={"Delete"}
            handleActionNo={handleCloseDelete}
            textActionNo={"Cancel"}
          />
        </StyledEngineProvider>
      }
    </section>
  )
}

export default AllEmployees;


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

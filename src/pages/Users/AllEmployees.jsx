import React, { useEffect, useMemo, useState } from 'react'
import styles from './Users.module.scss';
import { addTeamRoles, deleteTeamRoles, updateTeamRoles } from '../../api/API';
import TableNotFound from '../../components/Tables/TableNotFound'
import Button from '../../components/Button/Button'
import Modal from '../../components/ModalDialog/Modal';
import Input from '../../components/input/Input'
import useStateProvider from '../../hooks/useStateProvider'
import useAuthProvider from '../../hooks/useAuthProvider';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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
  TablePagination
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
import PropTypes from 'prop-types';
import ListRolesForMobile from './ListEmployeesForMobile';


const AllEmployees = () => {
  const { employees, fetchEmployees, currentPageEmployees, pageSize } = useStateProvider();
  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchEmployees(user?.idOrganisation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log(employees);
  const [showErrors, setShowErrors] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInTable((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const isFormValid = () => {
    let isValid = true;
    Object.keys(employeeInTable).forEach((field) => {
      if (checkErrors(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const checkErrors = (field) => {
    if (field === "teamRoleName") {
      if (employeeInTable.teamRoleName.length < 4 && employeeInTable.teamRoleName.length > 0) {
        return "Min 4 characters required.";
      } else if (employeeInTable.teamRoleName.length === 0) {
        return "Min 4 characters required.";
      }
    }
    return "";
  }

  const { setAlert } = useStateProvider();

  const [employeeInTable, setEmployeeInTable] = useState({ idUser: null, firstName: '', lastName: '', emailAdress: '', authorities: [] });
  const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);

  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setEmployeeInTable({ idUser: null, firstName: '', lastName: '', emailAdress: '', authorities: [] })
    setShowErrors(false);
  };

  const handleOpenAddUpdate = (action) => {
    setOpenAddUpdate({ open: true, action: action });
  }
  const handleCloseAddUpdate = () => {
    setOpenAddUpdate({ open: false, action: '' });
    setEmployeeInTable({ idUser: null, firstName: '', lastName: '', emailAdress: '', authorities: [] })
    setShowErrors(false);

  }

  const handleAddTeamRole = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await addTeamRoles(user?.idUser, { teamRoleName: employeeInTable.teamRoleName, idOrganisation: user?.idOrganisation });
        if (response.status === 200 || response.status === 201) {
          fetchEmployees(user?.idOrganisation);
          setAlert({
            type: "success",
            message: "You added a new role!",
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

  const handleUpdateTeamRole = async (idTeamRole) => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await updateTeamRoles(idTeamRole, { teamRoleName: employeeInTable.teamRoleName, idOrganisation: user?.idOrganisation });
        if (response.status === 200 || response.status === 201) {
          fetchEmployees(user?.idOrganisation);
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

  const handleDeleteTeamRole = async (idTeamRole) => {
    try {
      const response = await deleteTeamRoles(idTeamRole);
      if (response.status === 200 || response.status === 201) {
        fetchEmployees(user?.idOrganisation);
        setAlert({
          type: "success",
          message: "Team-role deleted!",
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

  function createData(idUser, firstName, lastName, emailAdress, authorities) {
    return { idUser, firstName, lastName, emailAdress, authorities };
  }

  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortBy, setSortBy] = useState('firstName'); // Starea pentru coloana după care se sortează

  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' pentru crescător, 'desc' pentru descrescător

  // const toggleSortDirection = () => {
  //   setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  // };

  // useEffect(() => {
  //   const sortedEmployees = employees?.map(emp =>
  //     createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.authorities)
  //   ).sort((a, b) => {
  //     if (sortDirection === 'asc') {
  //       return a.firstName.localeCompare(b.firstName);
  //     } else {
  //       return b.firstName.localeCompare(a.firstName);
  //     }
  //   });
  //   setRows(sortedEmployees || []);
  // }, [employees, sortDirection]);

  const toggleSortDirectionAndColumn = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc'); // Resetăm direcția sortării la ascendent când schimbăm coloana
    }
  };
  useEffect(() => {
    const sortedEmployees = employees?.map(emp =>
      createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.authorities)
    ).sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });
    setRows(sortedEmployees || []);
  }, [employees, sortDirection, sortBy]);


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

  const formatAuthority = (authority) => {
    return authority
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderUserRoles = (info) => {
    if (Array.isArray(info)) {
      return info.map(item => (
        <p key={item.id} className={styles.empRole}>{formatAuthority(item.authority)}</p>
      ))
    }
    else return info;
  };

  return (
    <section className={styles.pageAllEmployees}>
      {employees?.length === 0 ?
        <TableNotFound />
        :
        <div>
          {width > 460 ?
            <TableContainer component={Paper} className={styles.table}>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                    <StyledTableCell align="center">
                      First Name
                      <IconButton onClick={() => toggleSortDirectionAndColumn('firstName')} className={styles.iconWhite}>
                        {sortDirection === 'asc' && sortBy === 'firstName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Last Name
                      <IconButton onClick={() => toggleSortDirectionAndColumn('lastName')} className={styles.iconWhite}>
                        {sortDirection === 'asc' && sortBy === 'lastName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
                      </IconButton>
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
                    <TableRow key={index}>
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
                        {renderUserRoles(row?.authorities)}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <BorderColorIcon className={styles.tableButtons} onClick={() => {
                          setEmployeeInTable({ idUser: row?.idUser, firstName: row?.firstName, lastName: row?.lastName, emailAdress: row?.emailAdress, authorities: row?.authorities }); handleOpenAddUpdate('update');
                        }} />
                        <DeleteForeverIcon className={styles.tableButtons} onClick={() => {
                          setEmployeeInTable({ idUser: row?.idUser, firstName: row?.firstName, lastName: row?.lastName, emailAdress: row?.emailAdress, authorities: row?.authorities }); handleOpenDelete();
                        }} />
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
              <ListRolesForMobile
                currentTableData={currentTableData}
                rows={rows}
                setEmployeeInTable={setEmployeeInTable}
                handleOpenAddUpdate={handleOpenAddUpdate}
                handleOpenDelete={handleOpenDelete}
                sortDirection={sortDirection}
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
            title={openAddUpdate.action === 'add' ? "Add new role" : (<>{"Update"} <br /> {"[" + employeeInTable.teamRoleName + "]"}</>)}
            content={
              <Input
                type="text"
                placeholder="Role"
                label="Team role"
                id="teamRoleName"
                name="teamRoleName"
                value={employeeInTable.teamRoleName}
                onChange={handleChange}

                required
                error={showErrors && checkErrors("teamRoleName") ? true : false}
                helper={showErrors ? checkErrors("teamRoleName") : ""}
              />
            }
            handleActionYes={() => openAddUpdate.action === 'add' ? handleAddTeamRole() : handleUpdateTeamRole(employeeInTable.idTeamRole)}
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
            title={(<>{"Delete"} <br /> {"[" + employeeInTable.teamRoleName + "]"}</>)}
            content={"This action is permanent!"}
            handleActionYes={() => handleDeleteTeamRole(employeeInTable.idTeamRole)}
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

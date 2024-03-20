// import React, { useEffect, useMemo, useState } from 'react'
// import styles from '../Skills.module.scss';
// import TableNotFound from '../../components/Tables/TableNotFound'
// import Button from '../../components/Button/Button'
// import Modal from '../../components/ModalDialog/Modal';
// import Input from '../../components/input/Input'
// import useStateProvider from '../../hooks/useStateProvider'
// import useAuthProvider from '../../hooks/useAuthProvider';
// import useWindowDimensions from '../../hooks/useWindowDimensions';

// import {
//   styled,
//   StyledEngineProvider,
//   Table,
//   TableBody,
//   TableCell,
//   tableCellClasses,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Box,
//   TableFooter,
//   TablePagination,
//   Tooltip
// } from '../imports/muiMaterial';

// import {
//   FirstPageIcon,
//   KeyboardArrowLeftIcon,
//   KeyboardArrowRightIcon,
//   LastPageIcon,
//   AddCircleOutlineIcon,
//   DeleteForeverIcon,
//   BorderColorIcon,
//   TextRotationAngleupIcon,
//   TextRotationAngledownIcon
// } from '../imports/muiiconsMaterial';

// import { useTheme } from '@emotion/react';
// import PropTypes from 'prop-types';
// import ListRolesForMobile from './ListRolesForMobile';


// const Skills = () => {
//   const { pageSize, 
//     fetchAllSkills,
    
//     currentPageSkills,
//     setCurrentPageSkills,

//     fetchAllSkillCategory,
//     fetchAllSkillsFromCategory,
//     allSkillCategory_dropdown,
//     allSkillsFromCategory_dropdown,

//    } = useStateProvider();
//   const { user } = useAuthProvider();
//   const { width } = useWindowDimensions();

//   useEffect(() => {
//     if (user?.idUser) {
//       (async () => {
//         const x = await fetchAllSkills(user?.idUser);
//         const y = await fetchPendingUserSkills(user?.idUser);
//         const z = await fetchAllSkillCategory(user?.idOrganisation);
//       })();
//       // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.idUser]);

//   const [showErrors, setShowErrors] = useState(false);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTeamRole((prev) => {
//       return { ...prev, [name]: value };
//     });
//   };

//   const isFormValid = () => {
//     let isValid = true;
//     Object.keys(teamRole).forEach((field) => {
//       if (checkErrors(field)) {
//         isValid = false;
//       }
//     });
//     return isValid;
//   };

//   const checkErrors = (field) => {
//     if (field === "teamRoleName") {
//       if (teamRole.teamRoleName.length < 4 && teamRole.teamRoleName.length > 0) {
//         return "Min 4 characters required.";
//       } else if (teamRole.teamRoleName.length === 0) {
//         return "Min 4 characters required.";
//       }
//     }
//     return "";
//   }

//   const { setAlert } = useStateProvider();

//   const [teamRole, setTeamRole] = useState({ idTeamRole: null, teamRoleName: '' });
//   const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });

//   const [openDelete, setOpenDelete] = useState(false);
//   const handleOpenDelete = () => {
//     setOpenDelete(true);

//   };
//   const handleCloseDelete = () => {
//     setOpenDelete(false);
//     setTeamRole({ idTeamRole: null, teamRoleName: '' })
//     setShowErrors(false);
//   };

//   const handleOpenAddUpdate = (action) => {
//     setOpenAddUpdate({ open: true, action: action });
//   }
//   const handleCloseAddUpdate = () => {
//     setOpenAddUpdate({ open: false, action: '' });
//     setTeamRole({ idTeamRole: null, teamRoleName: '' })
//     setShowErrors(false);

//   }

//   const handleAddTeamRole = async () => {
//     if (!isFormValid()) {
//       setShowErrors(true);
//     }
//     if (isFormValid()) {
//       setShowErrors(false);
//       try {
//         // const response = await addTeamRoles(user?.idUser, { teamRoleName: teamRole.teamRoleName, idOrganisation: user?.idOrganisation });
//         // if (response.status === 200 || response.status === 201) {
//         //   fetchTeamRoles(user?.idOrganisation);
//         //   setAlert({
//         //     type: "success",
//         //     message: "You added a new role!",
//         //   });
//         //   handleCloseAddUpdate();
//         // }
//       } catch (error) {
//         console.log(error.message, "error");
//         setAlert({
//           type: "danger",
//           message: error.message || "Something went wrong...",
//         });
//       }
//     }
//   }

//   const handleUpdateTeamRole = async (idTeamRole) => {
//     if (!isFormValid()) {
//       setShowErrors(true);
//     }
//     if (isFormValid()) {
//       setShowErrors(false);
//       try {
//         // const response = await updateTeamRoles(idTeamRole, { teamRoleName: teamRole.teamRoleName, idOrganisation: user?.idOrganisation });
//         // if (response.status === 200 || response.status === 201) {
//         //   fetchTeamRoles(user?.idOrganisation);
//         //   setAlert({
//         //     type: "success",
//         //     message: "Update complete!",
//         //   });
//         //   handleCloseAddUpdate();
//         // }
//       } catch (error) {
//         console.log(error.message, "error");
//         setAlert({
//           type: "danger",
//           message: error.message || "Something went wrong...",
//         });
//       }
//     }
//   }

//   const handleDeleteTeamRole = async (idTeamRole) => {
//     try {
//       // const response = await deleteTeamRoles(idTeamRole);
//       // if (response.status === 200 || response.status === 201) {
//       //   fetchTeamRoles(user?.idOrganisation);
//       //   setAlert({
//       //     type: "success",
//       //     message: "Team-role deleted!",
//       //   });
//       //   handleCloseDelete();
//       // }
//     } catch (error) {
//       console.log(error.message, "error");
//       setAlert({
//         type: "danger",
//         message: error.message || "Something went wrong...",
//       });
//     }
//   }

//   function createData(id, teamRoleName) {
//     return { id, teamRoleName };
//   }

//   // const sortedTeamRoles = teamRoles?.map(role =>
//   //   createData(role.idTeamRole, role.teamRoleName)
//   // ).sort((a, b) => a.teamRoleName.localeCompare(b.teamRoleName));

//   // const rows = [sortedTeamRoles];
//   const [rows, setRows] = useState([]);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(3);
//   const [sortBy, setSortBy] = useState('firstName');
//   const [sortDirection, setSortDirection] = useState('Ascending');

//   const toggleSortDirectionAndColumn = (column) => {
//     if (sortBy === column) {
//       setSortDirection(sortDirection === 'Ascending' ? 'Descending' : 'Ascending');
//     } else {
//       setSortBy(column);
//       setSortDirection('Ascending');
//     }
//   };

//   useEffect(() => {
//     const sortedDepartments = usersWithoutDepartment?.map(emp =>
//       createData(emp.idUser, emp.firstName, emp.lastName, emp.emailAdress, emp.userSkill)
//     ).sort((a, b) => {
//       if (sortDirection === 'Ascending') {
//         return a[sortBy].localeCompare(b[sortBy]);
//       } else {
//         return b[sortBy].localeCompare(a[sortBy]);
//       }
//     });
//     setRows(sortedDepartments || []);
//   }, [usersWithoutDepartment, sortDirection, fetchAvailableUsers, sortBy]);



//   // Avoid a layout jump when reaching the last page with empty rows.
//   const emptyRows =
//     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows[0].length) : 0;

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const currentTableData = useMemo(() => {
//     if (rows) {
//       const firstPageIndex = (currentPageTeamRoles - 1) * pageSize;
//       const lastPageIndex = firstPageIndex + pageSize;

//       if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
//         return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
//       else
//         return rows?.slice(firstPageIndex, lastPageIndex);
//     }
//     else
//       return null;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPageTeamRoles, pageSize, rows, sortDirection]);

//   return (
//     <section className={styles.pageTeamRoles}>
//       {teamRoles?.length === 0 ? <>
//         <Button
//           className={styles.addRole}
//           label="Add role"
//           icon={<AddCircleOutlineIcon />}
//           position="left"
//           variant="primary"
//           border={false}
//           onClick={() => { handleOpenAddUpdate('add') }}
//         />
//         <TableNotFound />
//       </>
//         :
//         <div>
//           <Button
//             className={styles.addRole}
//             label="Add role"
//             icon={<AddCircleOutlineIcon />}
//             position="left"
//             variant="primary"
//             border={false}
//             onClick={() => { handleOpenAddUpdate('add') }}
//           />
//           {width > 550 ?
//             <TableContainer component={Paper} className={styles.table}>
//               <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
//                 <TableHead>
//                   <TableRow>
//                     <StyledTableCell align="center">Nr. crt.</StyledTableCell>
//                     <StyledTableCell align="center">
//                       Role
//                       <Tooltip
//                         title={"Order by department name"}
//                         placement='top-end'
//                         arrow
//                         onClick={() => toggleSortDirectionAndColumn('departmentName')} className={styles.iconWhite}
//                       >
//                         <IconButton className={styles.iconStyle}>
//                           {sortDirection === 'Ascending' && sortBy === 'departmentName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

//                         </IconButton>
//                       </Tooltip>
//                     </StyledTableCell>
//                     <StyledTableCell align="center">
//                       <Tooltip
//                         title='Update department'
//                         placement='top-start'
//                         arrow
//                         onClick={() => {
//                           setDepartment({ idDepartment: row?.id, departmentName: row?.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
//                           setFormValue({ ...formValue, departmentName: row?.departmentName })//, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
//                           handleOpenAddUpdate('update');
//                         }} >
//                         <IconButton>
//                           <BorderColorIcon className={styles.tableButtons} />
//                         </IconButton>
//                       </Tooltip>
//                     </StyledTableCell>
//                     <StyledTableCell align="center">
//                       <Tooltip
//                         title='Delete department'
//                         placement='top-start'
//                         arrow
//                         onClick={() => {
//                           setDepartment({ idDepartment: row?.id, departmentName: row?.departmentName, idOrganisation: user?.idOrganisation, departmentManager: row?.departmentManager, departmentManagerName: row?.departmentManagerName });
//                           handleOpenDelete();
//                         }} >
//                         <IconButton>
//                           <DeleteForeverIcon className={styles.tableButtons} />
//                         </IconButton>
//                       </Tooltip>
//                     </StyledTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {(rowsPerPage > 0
//                     ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     : rows
//                   )?.map((row, index) => (
//                     <TableRow key={index}>
//                       <TableCell component="th" scope="row" style={{ width: 160 }} align="center">
//                         {index + 1}
//                       </TableCell>
//                       <TableCell style={{ width: 160 }} align="center">
//                         {row?.teamRoleName}
//                       </TableCell>
//                       <TableCell style={{ width: 160 }} align="center">
//                         <Tooltip
//                           title='Update team role'
//                           placement='top-start'
//                           arrow
//                           onClick={() => {
//                             setTeamRole({ idTeamRole: row?.id, teamRoleName: row?.teamRoleName }); handleOpenAddUpdate('update');
//                           }} >
//                           <IconButton>
//                             <BorderColorIcon className={styles.tableButtons} />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                       <TableCell style={{ width: 160 }} align="center">
//                         <Tooltip
//                           title='Delete team role'
//                           placement='top-start'
//                           arrow
//                           onClick={() => {
//                             setTeamRole({ idTeamRole: row?.id, teamRoleName: row?.teamRoleName }); handleOpenDelete();
//                           }} >
//                           <IconButton>
//                             <DeleteForeverIcon className={styles.tableButtons} />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                     </TableRow>
//                   ))}

//                   {emptyRows > 0 && (
//                     <TableRow style={{ height: 53 * emptyRows }}>
//                       <TableCell colSpan={6} />
//                     </TableRow>
//                   )}
//                 </TableBody>
//                 <TableFooter>
//                   <TableRow>
//                     <TablePagination
//                       rowsPerPageOptions={[3, 5, 10, { label: 'All', value: -1 }]}
//                       colSpan={5}
//                       count={rows?.length}
//                       rowsPerPage={rowsPerPage}
//                       page={page}
//                       SelectProps={{
//                         inputProps: {
//                           'aria-label': 'rows per page',
//                         },
//                         native: true,
//                       }}
//                       onPageChange={handleChangePage}
//                       onRowsPerPageChange={handleChangeRowsPerPage}
//                       ActionsComponent={TablePaginationActions}
//                     />
//                   </TableRow>
//                 </TableFooter>
//               </Table>
//             </TableContainer>

//             :
//             <>
//               <ListRolesForMobile
//                 currentTableData={currentTableData}
//                 rows={rows}
//                 setTeamRole={setTeamRole}
//                 handleOpenAddUpdate={handleOpenAddUpdate}
//                 handleOpenDelete={handleOpenDelete}
//                 sortDirection={sortDirection}
//                 sortBy={sortBy}
//                 toggleSortDirection={toggleSortDirectionAndColumn}
//               />
//             </>
//           }

//         </div>
//       }
//       {openAddUpdate.open &&
//         <StyledEngineProvider injectFirst>
//           <Modal
//             open={openAddUpdate.open}
//             handleClose={handleCloseAddUpdate}
//             title={openAddUpdate.action === 'add' ? "Add new role" : (<>{"Update"} <br /> {"[" + teamRole.teamRoleName + "]"}</>)}
//             content={
//               <Input
//                 type="text"
//                 placeholder="Role"
//                 label="Team role"
//                 id="teamRoleName"
//                 name="teamRoleName"
//                 value={teamRole.teamRoleName}
//                 onChange={handleChange}

//                 required
//                 error={showErrors && checkErrors("teamRoleName") ? true : false}
//                 helper={showErrors ? checkErrors("teamRoleName") : ""}
//               />
//             }
//             handleActionYes={() => openAddUpdate.action === 'add' ? handleAddTeamRole() : handleUpdateTeamRole(teamRole.idTeamRole)}
//             textActionYes={"Confirm"}
//             handleActionNo={handleCloseAddUpdate}
//             textActionNo={"Cancel"}
//           />
//         </StyledEngineProvider>
//       }
//       {openDelete &&
//         <StyledEngineProvider injectFirst>
//           <Modal
//             open={openDelete}
//             handleClose={handleCloseDelete}
//             title={(<>{"Delete"} <br /> {"[" + teamRole.teamRoleName + "]"}</>)}
//             content={"This action is permanent!"}
//             handleActionYes={() => handleDeleteTeamRole(teamRole.idTeamRole)}
//             textActionYes={"Delete"}
//             handleActionNo={handleCloseDelete}
//             textActionNo={"Cancel"}
//           />
//         </StyledEngineProvider>
//       }
//     </section>
//   )
// }

// export default Skills;


// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));



// function TablePaginationActions(props) {
//   const theme = useTheme();
//   const { count, page, rowsPerPage, onPageChange } = props;

//   const handleFirstPageButtonClick = (event) => {
//     onPageChange(event, 0);
//   };

//   const handleBackButtonClick = (event) => {
//     onPageChange(event, page - 1);
//   };

//   const handleNextButtonClick = (event) => {
//     onPageChange(event, page + 1);
//   };

//   const handleLastPageButtonClick = (event) => {
//     onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <Box sx={{ flexShrink: 0, ml: 2.5 }}>
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleBackButtonClick}
//         disabled={page === 0}
//         aria-label="previous page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowLeftIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowRightIcon /> : <KeyboardArrowRightIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </Box>
//   );
// }


// TablePaginationActions.propTypes = {
//   count: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// };
import React from 'react'

const AllSkills = () => {
  return (
    <div>AllSkills</div>
  )
}

export default AllSkills
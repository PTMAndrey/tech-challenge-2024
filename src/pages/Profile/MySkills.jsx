import React, { useEffect, useMemo, useState } from 'react'
import useAuthProvider from '../../hooks/useAuthProvider';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useStateProvider from '../../hooks/useStateProvider';
import styles from './Profile.module.scss'
import TableNotFound from '../../components/Tables/TableNotFound'
import Button from '../../components/Button/Button'
import Modal from '../../components/ModalDialog/Modal';
import Input from '../../components/input/Input'
import ListSkills from './ListSkills';
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
import { addUserSkill, deleteDepartment, deleteUserSkill, removeDepartmentManagerFromDepartment, } from '../../api/API';
import { useNavigate } from 'react-router';


const MySkills = () => {
  const { setAlert,
    pageSizeMySkills,
    currentPageMySkills,
    setCurrentPageMySkills,
    approvedUserSkills,
    fetchApprovedUserSkills,
    fetchAllSkillCategory,
    fetchAllSkillsFromCategory,
    allSkillCategory_dropdown,
    allSkillsFromCategory_dropdown,
    managersWithoutDepartments_dropdown,


    currentPageMySkills2,
    setCurrentPageMySkills2,
    pendingUserSkills,
    fetchPendingUserSkills,
  } = useStateProvider();
  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.idUser) {
      (async () => {
        const x = await fetchApprovedUserSkills(user?.idUser);
        const y = await fetchPendingUserSkills(user?.idUser);
        const z = await fetchAllSkillCategory(user?.idOrganisation);
      })();
      // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idUser]);


  // ********************* APPROVED SKILLS ********************************
  const [selectedSkillInTable, setSelectedSkillInTable] = useState({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" });
  const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });
  const [openDelete, setOpenDelete] = useState(false);

  const [showErrors, setShowErrors] = useState(false);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortBy, setSortBy] = useState('numeSkill');
  const [sortDirection, setSortDirection] = useState('Ascending');
  const [removeDM, setRemoveDM] = useState(false);
  const [formValue, setFormValue] = useState({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" });



  useEffect(() => {
    if (formValue.idUserSkill !== "") {
      (async () => {
        const x = await fetchAllSkillsFromCategory(formValue.idUserSkill, user?.idUser)
        // const y = await fetchAllSkillCategory(user?.idOrganisation);
      })();
      // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue.idUserSkill]);

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
    if (field === "skillCategory") {
      if (formValue.skillCategory === '') {
        return "Choose a category!";
      }
    }
    if (field === "numeSkill") {
      if (formValue.numeSkill === '') {
        return "Choose a skill!";
      }
    }
    if (field === "level") {
      if (formValue.level === '') {
        return "Pick level of knowledge!";
      }
    }
    if (field === "experience") {
      if (formValue.experience === '') {
        return "Pick level of experience!";
      }
    }

    return "";
  }
  const handleOpenDelete = () => {
    setOpenDelete(true);

  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedSkillInTable({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" })
    setFormValue({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" })
    setShowErrors(false);
    setRemoveDM(false);

  };

  const handleOpenAddUpdate = (action) => {
    setOpenAddUpdate({ open: true, action: action });
  }
  const handleCloseAddUpdate = () => {
    setOpenAddUpdate({ open: false, action: '' });
    setSelectedSkillInTable({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" })
    setFormValue({ idUserSkill: "", idSkill: "", numeSkill: "", level: "", experience: "" })
    setShowErrors(false);
    setRemoveDM(false);

  }

  const handleAddSkill = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        console.log(formValue);
        const response = await addUserSkill({ idUser: user?.idUser, idSkill: formValue?.idSkill, level: formValue.level, experience: formValue.experience });
        if (response.status === 200 || response.status === 201) {
          handleCloseAddUpdate();
          await fetchApprovedUserSkills(user?.idUser);
          await fetchPendingUserSkills(user?.idUser);
          setAlert({
            type: "success",
            message: "You added a new skill!",
          });
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
  }

  const handleUpdateSkill = async () => {

    console.log(formValue, selectedSkillInTable);

    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        // const response = await updateDepartment(formValue.idDepartment, { idOrganisation: user?.idOrganisation, departmentName: formValue.departmentName })
        // if (response.status === 200 || response.status === 201) {
        //   handleCloseAddUpdate();
        //   const y = await fetchApprovedUserSkills(user?.idUser);
        //   setAlert({
        //     type: "success",
        //     message: "Update complete!",
        //   });
        //   // const x = await fetchDepartments(user?.idOrganisation);
        // }
      } catch (error) {
        console.log(error.message, "error");
        handleCloseAddUpdate();
        setAlert({
          type: "danger",
          message: error.message || "Something went wrong...",
        });
      }
    }
  }


  const handleDeleteSkill = async () => {
    try {
      const response = await deleteUserSkill(formValue?.idUserSkill);
      if (response.status === 200 || response.status === 201) {
        handleCloseDelete();
        const x = fetchApprovedUserSkills(user?.idUser);
        const y = fetchPendingUserSkills(user?.idUser);
        setAlert({
          type: "success",
          message: "Skill deleted!",
        });
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

  function createData(id, idSkill, numeSkill, level, experience) {
    return { id, idSkill, numeSkill, level, experience };
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
    const sortedSkills = approvedUserSkills?.map(skill =>
      createData(skill.idUserSkill, skill.idSkill, skill.numeSkill, skill.level, skill.experience)
    ).sort((a, b) => {
      if (sortDirection === 'Ascending') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });
    setRows(sortedSkills || []);
  }, [approvedUserSkills, sortDirection, sortBy]);

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
      const firstPageIndex = (currentPageMySkills - 1) * pageSizeMySkills;
      const lastPageIndex = firstPageIndex + pageSizeMySkills;

      if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
        return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
      else
        return rows?.slice(firstPageIndex, lastPageIndex);
    }
    else
      return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageMySkills, pageSizeMySkills, rows, sortDirection]);



  // ********************* PENDING SKILLS ********************************

  const [rows2, setRows2] = useState([]);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(3);
  const [sortBy2, setSortBy2] = useState('numeSkill');
  const [sortDirection2, setSortDirection2] = useState('Ascending');

  // useEffect(() => {
  //   if (formValue.idUserSkill !== "") {
  //     (async () => {
  //       // const y = await fetchAllSkillCategory(user?.idOrganisation);
  //     })();
  //     // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);

  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formValue.idUserSkill]);


  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const isFormValid2 = () => {
    let isValid = true;
    Object.keys(formValue).forEach((field) => {
      if (checkErrors2(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const checkErrors2 = (field) => {
    if (field === "skillCategory") {
      if (formValue.skillCategory === '') {
        return "Choose a category!";
      }
    }
    if (field === "numeSkill") {
      if (formValue.numeSkill === '') {
        return "Choose a skill!";
      }
    }

    return "";
  }

  const toggleSortDirectionAndColumn2 = (column) => {
    if (sortBy2 === column) {
      setSortDirection2(sortDirection2 === 'Ascending' ? 'Descending' : 'Ascending');
    } else {
      setSortBy2(column);
      setSortDirection2('Ascending');
    }
  };

  useEffect(() => {
    const sortedSkills2 = pendingUserSkills?.map(skill =>
      createData(skill.idUserSkill, skill.idSkill, skill.numeSkill, skill.level, skill.experience)
    ).sort((a, b) => {
      if (sortDirection2 === 'Ascending') {
        return a[sortBy2].localeCompare(b[sortBy2]);
      } else {
        return b[sortBy2].localeCompare(a[sortBy2]);
      }
    });
    setRows2(sortedSkills2 || []);
  }, [pendingUserSkills, sortDirection2, sortBy2]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows2 =
    page2 > 0 ? Math.max(0, (1 + page2) * rowsPerPage2 - rows2[0].length) : 0;

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const currentTableData2 = useMemo(() => {
    if (rows2) {
      const firstPageIndex = (currentPageMySkills2 - 1) * pageSizeMySkills;
      const lastPageIndex = firstPageIndex + pageSizeMySkills;

      if (rows2?.length < lastPageIndex && (lastPageIndex - rows2?.length) > 0)
        return rows2?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows2?.length));
      else
        return rows2?.slice(firstPageIndex, lastPageIndex);
    }
    else
      return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageMySkills2, pageSizeMySkills, rows2, sortDirection2]);


  // ********************* END PENDING SKILLS ********************************


  const handleChangeSkillCategory = async (e) => {
    if (e === null) {
      setFormValue({ ...formValue, idUserSkill: '', idSkill: '', numeSkill: '', level: '', experience: '' })
    }
    else {
      setFormValue({ ...formValue, idUserSkill: e.value, idSkill: '', numeSkill: '', level: '', experience: '' });
      fetchAllSkillsFromCategory(e.value, user?.idUser)
    }
  }

  const levelOfKnowledge = [
    { value: '1 – Learns', label: '1 – Learns' },
    { value: '2 – Knows', label: '2 – Knows' },
    { value: '3 – Does', label: '3 – Does' },
    { value: '4 – Helps', label: '4 – Helps' },
    { value: '5 – Teaches', label: '5 – Teaches' },
  ];

  const levelOfExperience = [
    { value: '0-6 months', label: '0-6 months' },
    { value: '6-12 months', label: '6-12 months' },
    { value: '1-2 years', label: '1-2 years' },
    { value: '2-4 years', label: '2-4 years' },
    { value: '4-7 years', label: '4-7 years' },
    { value: '>7 years', label: '>7 years' },
  ];

  return (
    <section className={styles.pageProfile}>
      {console.log(approvedUserSkills?.length)}
      {console.log(pendingUserSkills?.length)}
      {approvedUserSkills?.length === 0 && pendingUserSkills?.length === 0 ? <>
        <Button
          className={styles.addSkill}
          label="Add skill"
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
            label="Add skill"
            icon={<AddCircleOutlineIcon />}
            position="left"
            variant="primary"
            border={false}
            onClick={() => { handleOpenAddUpdate('add') }}
          />
          {width > 550 ?
            <>
              <h5>Approved skills</h5>
              {approvedUserSkills?.length !== 0 ?
                <>
                  <TableContainer component={Paper} className={styles.table}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                          <StyledTableCell align="center">
                            Skill name
                            <Tooltip
                              title={"Order by skill name"}
                              placement='top-end'
                              arrow
                              onClick={() => toggleSortDirectionAndColumn('numeSkill')} className={styles.iconWhite}
                            >
                              <IconButton className={styles.iconStyle}>
                                {sortDirection === 'Ascending' && sortBy === 'numeSkill' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Level
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Experience
                          </StyledTableCell>
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
                              {row?.numeSkill}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="center">
                              {row?.level}
                            </TableCell>

                            <TableCell style={{ width: 160 }} align="center">
                              {row?.experience}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="center">
                              <Tooltip
                                title='Delete skill'
                                placement='top-start'
                                arrow
                                onClick={() => {
                                  setFormValue({ idUserSkill: row?.id, idSkill: row?.idSkill, numeSkill: row?.numeSkill, level: row?.level, experience: row?.experience });
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
                </>
                :
                <TableNotFound />
              }

              <h5 className='mt-5'>In pending</h5>
              {pendingUserSkills?.length !== 0 ?
                <>
                  <TableContainer component={Paper} className={styles.table}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                          <StyledTableCell align="center">
                            Skill name
                            <Tooltip
                              title={"Order by skill name"}
                              placement='top-end'
                              arrow
                              onClick={() => toggleSortDirectionAndColumn2('numeSkill')} className={styles.iconWhite}
                            >
                              <IconButton className={styles.iconStyle}>
                                {sortDirection2 === 'Ascending' && sortBy2 === 'numeSkill' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Level
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Experience
                          </StyledTableCell>
                          <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage2 > 0
                          ? rows2?.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
                          : rows2
                        )?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row" style={{ width: 160 }} align="center">
                              {index + 1}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="center">
                              {row?.numeSkill}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="center">
                              {row?.level}
                            </TableCell>

                            <TableCell style={{ width: 160 }} align="center">
                              {row?.experience}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="center">
                              <Tooltip
                                title='Delete skill'
                                placement='top-start'
                                arrow
                                onClick={() => {
                                  setFormValue({ idUserSkill: row?.id, idSkill: row?.idSkill, numeSkill: row?.numeSkill, level: row?.level, experience: row?.experience });
                                  handleOpenDelete();
                                }}
                              >
                                <IconButton>
                                  <DeleteForeverIcon className={styles.tableButtons} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}

                        {emptyRows2 > 0 && (
                          <TableRow style={{ height: 53 * emptyRows2 }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[3, 5, 10, { label: 'All', value: -1 }]}
                            colSpan={5}
                            count={rows2?.length}
                            rowsPerPage={rowsPerPage2}
                            page={page2}
                            SelectProps={{
                              inputProps: {
                                'aria-label': 'rows per page',
                              },
                              native: true,
                            }}
                            onPageChange={handleChangePage2}
                            onRowsPerPageChange={handleChangeRowsPerPage2}
                            ActionsComponent={TablePaginationActions}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </>
                :
                <TableNotFound />
              }
            </>
            :
            <>
              {currentTableData.length !== 0 ?
                <>
                  <h5>Approved skills</h5>
                  <ListSkills
                    currentTableData={currentTableData}
                    rows={rows}
                    handleOpenAddUpdate={handleOpenAddUpdate}
                    handleOpenDelete={handleOpenDelete}
                    sortDirection={sortDirection}
                    sortBy={sortBy}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    toggleSortDirectionAndColumn={toggleSortDirectionAndColumn}
                    pageSize={pageSizeMySkills}
                    currentPage={currentPageMySkills}
                    setCurrentPage={setCurrentPageMySkills}

                  />
                </>
                :
                <>
                  <h5>No approved skills</h5>
                  <TableNotFound />
                </>
              }

              {currentTableData2.length !== 0 ?
                <>
                  <h5 className='mt-5'>Pending skills</h5>
                  <ListSkills
                    currentTableData={currentTableData2}
                    rows={rows2}
                    handleOpenAddUpdate={handleOpenAddUpdate}
                    handleOpenDelete={handleOpenDelete}
                    sortDirection={sortDirection2}
                    sortBy={sortBy2}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    toggleSortDirectionAndColumn={toggleSortDirectionAndColumn2}
                    pageSize={pageSizeMySkills}
                    currentPage={currentPageMySkills2}
                    setCurrentPage={setCurrentPageMySkills2}
                  />
                </>
                :
                <>
                  <h5 className='mt-5'>No pending skills</h5>
                  <TableNotFound />
                </>
              }
            </>
          }

        </div>
      }
      {
        openAddUpdate.open &&
        <StyledEngineProvider injectFirst>
          <Modal
            open={openAddUpdate.open}
            handleClose={handleCloseAddUpdate}
            title={openAddUpdate.action === 'add' && "Add new skill"}
            content={
              <>
                {(openAddUpdate.action === 'add') &&
                  <>
                    <p>Choose a skill category</p><br />
                    <DropdownComponent
                      title={'Skill category'}
                      options={allSkillCategory_dropdown}
                      onChange={(e) => {
                        handleChangeSkillCategory(e);
                      }}
                      error={showErrors && checkErrors('skillCategory') ? true : false}
                      helper={showErrors ? checkErrors('skillCategory') : ''}
                    />
                    {formValue.idUserSkill !== "" &&
                      <>
                        <p>Choose a skill category</p><br />
                        <DropdownComponent
                          title={formValue?.idSkill !== '' ? formValue.numeSkill : 'Skill name'}
                          options={allSkillsFromCategory_dropdown}
                          onChange={(e) => {
                            e === null ?
                              setFormValue({ ...formValue, idSkill: '', numeSkill: '' }) :
                              setFormValue({ ...formValue, idSkill: e.value, numeSkill: e.label })


                          }}
                          error={showErrors && checkErrors('numeSkill') ? true : false}
                          helper={showErrors ? checkErrors('numeSkill') : ''}
                        />
                      </>
                    }

                    {formValue.idSkill !== "" &&
                      <>
                        <>
                          <p>Choose level of knowledge</p><br />
                          <DropdownComponent
                            title={'Knowledge'}
                            options={levelOfKnowledge}
                            onChange={(e) => {
                              e === null ?
                                setFormValue({ ...formValue, level: '' }) :
                                setFormValue({ ...formValue, level: e.value })


                            }}
                            error={showErrors && checkErrors('level') ? true : false}
                            helper={showErrors ? checkErrors('level') : ''}
                          />
                        </>
                      </>
                    }
                    {formValue.level !== "" &&
                      <>
                        <>
                          <p>Choose level of knowledge</p><br />
                          <DropdownComponent
                            title={'Experience'}
                            options={levelOfExperience}
                            onChange={(e) => {
                              e === null ?
                                setFormValue({ ...formValue, experience: '' }) :
                                setFormValue({ ...formValue, experience: e.value })


                            }}
                            error={showErrors && checkErrors('experience') ? true : false}
                            helper={showErrors ? checkErrors('experience') : ''}
                          />
                        </>
                      </>
                    }
                  </>
                }

              </>
            }

            handleActionYes={() => {
              // Verifică dacă acțiunea este de a adăuga un manager fără a verifica lungimea dropdown-ului
              if (openAddUpdate.action === 'add') {
                handleAddSkill();
              }
            }}
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
            title={(<>{"Delete"} <br /> {"[" + formValue.numeSkill + "]"}</>)}
            content={"This action is permanent!"}
            handleActionYes={() => handleDeleteSkill()}
            textActionYes={"Delete"}
            handleActionNo={handleCloseDelete}
            textActionNo={"Cancel"}
          />
        </StyledEngineProvider>
      }
    </section >
  )
}

export default MySkills;


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

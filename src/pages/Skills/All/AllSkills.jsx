import React, { useEffect, useMemo, useState } from 'react'
import styles from '../Skills.module.scss';
import TableNotFound from '../../../components/Tables/TableNotFound'
import Button from '../../../components/Button/Button'
import Modal from '../../../components/ModalDialog/Modal';
import Input from '../../../components/input/Input'
import useStateProvider from '../../../hooks/useStateProvider'
import useAuthProvider from '../../../hooks/useAuthProvider';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import DropdownComponent from '../../../components/Dropdown/Dropdown';

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
  TextRotationAngledownIcon,
  BookmarkRemoveTwoToneIcon
} from '../../imports/muiiconsMaterial';

import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import ListAllSkills from './ListAllSkills';
import { addSkill, addSkillCategory, addSkillToMyDepartment, deleteSkill, deleteSkillCategory, deleteSkillFromMyDepartment, updateSkill, updateSkillCategory } from '../../../api/API';


const AllSkills = () => {
  const { pageSize,
    fetchAllSkills,
    currentPageAllSkills,
    setCurrentPageAllSkills,
    allSkills,
    fetchAllSkillCategory,
    allSkillCategory_dropdown,
    setAlert,
  } = useStateProvider();

  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (user?.idUser) {
      (async () => {
        const x = await fetchAllSkills(user?.idOrganisation, user?.idUser)
        const z = await fetchAllSkillCategory(user?.idOrganisation);
      })();
      // const y = await fetchUnassignedDepartmentManagers(user?.idOrganisation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idUser]);

  const [selectedSkillInTable, setSelectedSkillInTable] = useState({
    idSkill: null,
    skillName: '',
    skillDescription: '',
    creatorName: '',
    skillCategoryName: "",
    departments: [],
    adToMyDepartment: null,
    editable: null,
    inMyDepartment: false,
  }
  );
  const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });
  const [openDelete, setOpenDelete] = useState({ open: false, action: '' });

  const [showErrors, setShowErrors] = useState(false);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortBy, setSortBy] = useState('skillCategoryName');
  const [sortDirection, setSortDirection] = useState('Ascending');
  const [formValue, setFormValue] = useState({
    idSkill: null,
    skillName: '',
    skillDescription: '',
    creatorName: '',
    idSkillCategory: "",
    skillCategoryName: "",
    departments: [],
    adToMyDepartment: null,
    editable: null,
    inMyDepartment: false,
  });


  const [addToMyDepartment_checkbox, setAddToMyDepartment_checkbox] = useState(false);

  const toggleAddToMyDepartment_checkbox = () => {
    setAddToMyDepartment_checkbox(!addToMyDepartment_checkbox);
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
    if (field === "skillName") {
      if (formValue?.skillName.length < 4 && formValue?.skillName.length > 0) {
        return "Min 4 characters required.";
      } else if (formValue?.skillName.length === 0) {
        return "Field is required!";
      }
    }
    if (field === "idSkillCategory") {
      if (formValue?.idSkillCategory.length === 0) {
        return "Field is required!";
      }
    }
    if (field === "skillDescription") {
      if (formValue?.skillDescription.length < 25 && formValue?.skillDescription.length > 0) {
        return "Min 25 characters required.";
      } else if (formValue?.skillDescription.length === 0) {
        return "Field is required!";
      }
    }
    return "";
  }

  const handleOpenDelete = (action) => {
    setOpenDelete({ open: true, action: action });

  };
  const handleCloseDelete = () => {
    setOpenDelete({ open: false, action: '' });
    setSelectedSkillInTable({
      idSkill: null,
      skillName: '',
      skillDescription: '',
      creatorName: '',
      skillCategoryName: "",
      departments: [],
      adToMyDepartment: null,
      editable: null,
      inMyDepartment: false,
    })
    setFormValue({
      idSkill: null,
      skillName: '',
      skillDescription: '',
      creatorName: '',
      idSkillCategory: "",
      skillCategoryName: "",
      departments: [],
      adToMyDepartment: null,
      editable: null,
      inMyDepartment: false,
    })
    setShowErrors(false);
    setAddToMyDepartment_checkbox(false);
  };

  const handleOpenAddUpdate = (action) => {
    setOpenAddUpdate({ open: true, action: action });
  }
  const handleCloseAddUpdate = () => {
    setOpenAddUpdate({ open: false, action: '' });
    setSelectedSkillInTable({
      idSkill: null,
      skillName: '',
      skillDescription: '',
      creatorName: '',
      skillCategoryName: "",
      departments: [],
      adToMyDepartment: null,
      editable: null,
      inMyDepartment: false,
    })
    setFormValue({
      idSkill: null,
      skillName: '',
      skillDescription: '',
      creatorName: '',
      idSkillCategory: "",
      skillCategoryName: "",
      departments: [],
      adToMyDepartment: null,
      editable: null,
      inMyDepartment: false,
    })
    setShowErrors(false);
    setAddToMyDepartment_checkbox(false);

  }

  const handleAddSkill = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await addSkill({ skillName: formValue.skillName, skillDescription: formValue.skillDescription, createdBy: user?.idUser, idSkillCategory: formValue.idSkillCategory, adToMyDepartment: addToMyDepartment_checkbox });
        if (response.status === 200 || response.status === 201) {
          fetchAllSkills(user?.idOrganisation, user?.idUser);
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

  const handleUpdateSkill = async () => {
    if (!isFormValid()) {
      setShowErrors(true);
    }
    if (isFormValid()) {
      setShowErrors(false);
      try {
        const response = await updateSkill(formValue.idSkillCategory, { skilCategoryName: formValue.skillCategoryName, idOrganisation: user?.idOrganisation });
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

  const handleAddSkillToMyDepartment = async () => {

    try {
      const response = await addSkillToMyDepartment(selectedSkillInTable.idSkill, user?.idUser);
      if (response.status === 200 || response.status === 201) {
        fetchAllSkills(user?.idOrganisation, user?.idUser);
        setAlert({
          type: "success",
          message: "You added a new skill in department!",
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

  const handleRemoveSkillFromMyDepartment = async () => {

    try {
      const response = await deleteSkillFromMyDepartment(selectedSkillInTable.idSkill, user?.idUser)
      if (response.status === 200 || response.status === 201) {
        fetchAllSkills(user?.idOrganisation, user?.idUser);
        setAlert({
          type: "success",
          message: "Skill removed from department!",
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


  function createData(id, skillName, skillDescription, creatorName, skillCategoryName, departments, adToMyDepartment, editable, inMyDepartment) {
    return { id, skillName, skillDescription, creatorName, skillCategoryName, departments, adToMyDepartment, editable, inMyDepartment };
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
    const sortedDepartments = allSkills?.map(skill =>
      createData(skill.idSkill,
        skill.skillName,
        skill.skillDescription,
        skill.creatorName,
        skill.skillCategoryName,
        skill.departments,
        skill.adToMyDepartment,
        skill.editable,
        skill.inMyDepartment)
    ).sort((a, b) => {
      if (sortDirection === 'Ascending') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });
    setRows(sortedDepartments || []);
  }, [allSkills, sortDirection, sortBy]);



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
      const firstPageIndex = (currentPageAllSkills - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;

      if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
        return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
      else
        return rows?.slice(firstPageIndex, lastPageIndex);
    }
    else
      return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageAllSkills, pageSize, rows, sortDirection]);


  return (
    <section>
      {allSkills?.length === 0 ? <>
        <Button
          className={styles.addSkill}
          label="Add skill"
          icon={<AddCircleOutlineIcon />}
          position="left"
          variant="primary"
          border={false}
          onClick={() => { handleOpenAddUpdate('addSkill') }}
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
            onClick={() => { handleOpenAddUpdate('addSkill') }}
          />
          {width > 550 ?
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
                        onClick={() => toggleSortDirectionAndColumn('skillName')} className={styles.iconWhite}
                      >
                        <IconButton className={styles.iconStyle}>
                          {sortDirection === 'Ascending' && sortBy === 'skillName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}

                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    <StyledTableCell align="center">
                      Skill category
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
                    <StyledTableCell align="center">Creator</StyledTableCell>
                    <StyledTableCell align="center">My department</StyledTableCell>
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
                        {row?.skillName}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.skillDescription}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.skillCategoryName}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {row?.creatorName}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <div className={styles.allEmployeesButtonsAction}>
                          {row?.inMyDepartment === true ?
                            <Tooltip
                              title='Remove skill from department'
                              placement='top-start'
                              arrow
                              onClick={() => {
                                setSelectedSkillInTable({
                                  idSkill: row?.id,
                                  skillName: row?.skillName,
                                  skillDescription: row?.skillDescription,
                                  creatorName: row?.creatorName,
                                  skillCategoryName: row?.skilCategoryName,
                                  departments: row?.departments,
                                  adToMyDepartment: row?.adToMyDepartment,
                                  editable: row?.editable,
                                  inMyDepartment: row?.inMyDepartment,
                                });
                                setFormValue({ ...formValue, idSkill: row?.id });
                                handleOpenDelete('removeFromMyDepartment');
                              }} >
                              <IconButton>
                                <BookmarkRemoveTwoToneIcon className={styles.tableButtons} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip
                              title='Add skill to my department'
                              placement='top-start'
                              arrow
                              onClick={() => {
                                setSelectedSkillInTable({
                                  idSkill: row?.id,
                                  skillName: row?.skillName,
                                  skillDescription: row?.skillDescription,
                                  creatorName: row?.creatorName,
                                  skillCategoryName: row?.skilCategoryName,
                                  departments: row?.departments,
                                  adToMyDepartment: row?.adToMyDepartment,
                                  editable: row?.editable,
                                  inMyDepartment: row?.inMyDepartment,
                                });
                                setFormValue({ ...formValue, idSkill: row?.id });
                                handleOpenDelete('addToMyDepartment');
                              }} >
                              <IconButton>
                                <AddCircleOutlineIcon className={styles.tableButtons} />
                              </IconButton>
                            </Tooltip>
                          }

                        </div>
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        <div className={styles.allEmployeesButtonsAction}>
                          {row?.editable ?
                            <>
                              <Tooltip
                                title='Update skill'
                                placement='top-start'
                                arrow
                                onClick={() => {
                                  setSelectedSkillInTable({
                                    idSkill: row?.id,
                                    skillName: row?.skillName,
                                    skillDescription: row?.skillDescription,
                                    creatorName: row?.creatorName,
                                    skillCategoryName: row?.skilCategoryName,
                                    departments: row?.departments,
                                    adToMyDepartment: row?.adToMyDepartment,
                                    editable: row?.editable,
                                    inMyDepartment: row?.inMyDepartment,
                                  });
                                  setFormValue({
                                    ...formValue,
                                    idSkill: row?.id,
                                    skillName: row?.skillName,
                                    skillDescription: row?.skillDescription,
                                    creatorName: row?.creatorName,
                                    skillCategoryName: row?.skilCategoryName,
                                    departments: row?.departments,
                                    adToMyDepartment: row?.adToMyDepartment,
                                    editable: row?.editable,
                                    inMyDepartment: row?.inMyDepartment,
                                  });
                                  handleOpenAddUpdate('updateSkill');
                                }} >
                                <IconButton>
                                  <BorderColorIcon className={styles.tableButtons} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title='Delete skill'
                                placement='top-start'
                                arrow
                                onClick={() => {
                                  setSelectedSkillInTable({
                                    idSkill: row?.id,
                                    skillName: row?.skillName,
                                    skillDescription: row?.skillDescription,
                                    creatorName: row?.creatorName,
                                    skillCategoryName: row?.skilCategoryName,
                                    departments: row?.departments,
                                    adToMyDepartment: row?.adToMyDepartment,
                                    editable: row?.editable,
                                    inMyDepartment: row?.inMyDepartment,
                                  });
                                  setFormValue({ ...formValue, idSkill: row?.id });
                                  handleOpenDelete('deleteSkill');
                                }} >
                                <IconButton>
                                  <DeleteForeverIcon className={styles.tableButtons} />
                                </IconButton>
                              </Tooltip>
                            </>
                            :
                            <p>The skill is created by other user and can not be edited or deleted</p>
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
              <ListAllSkills
                currentTableData={currentTableData}
                rows={rows}
                setSelectedSkillInTable={setSelectedSkillInTable}
                handleOpenAddUpdate={handleOpenAddUpdate}
                handleOpenDelete={handleOpenDelete}
                sortDirection={sortDirection}
                sortBy={sortBy}
                formValue={formValue}
                setFormValue={setFormValue}
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
            title={openAddUpdate.action === 'addSkill' ? "Add new skill" : (<>{"Update"} <br /> {"[" + selectedSkillInTable.skillName + "]"}</>)}
            content={
              <>
                <Input
                  type="text"
                  placeholder="Skill name"
                  label="Skill name"
                  id="skillName"
                  name="skillName"
                  value={formValue.skillName}
                  onChange={handleChange}

                  required
                  error={showErrors && checkErrors("skillName") ? true : false}
                  helper={showErrors ? checkErrors("skillName") : ""}
                />
                <br />
                <p>Choose a skill category</p>
                <DropdownComponent
                  title={'Skill category'}
                  options={allSkillCategory_dropdown}
                  onChange={(e) => {
                    e === null ?
                      setFormValue({ ...formValue, idUserSkill: '', idSkill: '', numeSkill: '', level: '', experience: '' })
                      :
                      setFormValue({ ...formValue, idSkillCategory: e.value, skillCategoryName: e.label });
                  }}
                  error={showErrors && checkErrors('idSkillCategory') ? true : false}
                  helper={showErrors ? checkErrors('idSkillCategory') : ''}
                />
                <br/>
                <Input
                  type="text"
                  placeholder="Description"
                  label="Description"
                  id="skillDescription"
                  name="skillDescription"
                  value={formValue.skillDescription}
                  onChange={handleChange}

                  required
                  error={showErrors && checkErrors("skillDescription") ? true : false}
                  helper={showErrors ? checkErrors("skillDescription") : ""}
                />
                <br/>
                <Input
                  type="checkbox"
                  checked={addToMyDepartment_checkbox}
                  label={"Add skill to my department"}
                  value={formValue.adToMyDepartment}
                  onChange={toggleAddToMyDepartment_checkbox}
                />
              </>
            }
            handleActionYes={() => openAddUpdate.action === 'addSkill' ? handleAddSkill() : handleUpdateSkill()}
            textActionYes={"Confirm"}
            handleActionNo={handleCloseAddUpdate}
            textActionNo={"Cancel"}
          />
        </StyledEngineProvider>
      }
      {openDelete.open &&
        <StyledEngineProvider injectFirst>
          <Modal
            open={openDelete.open}
            handleClose={handleCloseDelete}
            title={openDelete.action === 'addToMyDepartment' ? "Add skill to my department" : `Remove [${selectedSkillInTable.skillName}]`}
            content={"This action is permanent!"}
            handleActionYes={() => openDelete.action === 'addToMyDepartment' ? handleAddSkillToMyDepartment() : handleRemoveSkillFromMyDepartment()}
            textActionYes={openDelete.action === 'addToMyDepartment' ? "Add skill" : "Remove skill"}
            handleActionNo={handleCloseDelete}
            textActionNo={"Cancel"}
          />
        </StyledEngineProvider>
      }
    </section>
  )
}

export default AllSkills;


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

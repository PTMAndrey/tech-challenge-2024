import React, { useEffect, useMemo, useState } from 'react'
import styles from '../Proposals.module.scss';
import { addTeamRoles, approveUserSkill, deleteTeamRoles, rejectUserSkill, updateTeamRoles } from '../../../api/API';
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
  TextRotationAngleupIcon,
  TextRotationAngledownIcon,
  CheckTwoToneIcon,
  CloseTwoToneIcon
} from '../../imports/muiiconsMaterial';

import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import ListSkillsProposals from './ListSkillsProposals';


const SkillProposals = () => {
  const {
    pageSize,
    unassignedSkillsProposals,
    currentPageProposals,
    fetchUnassignedSkillsProposals,
    setAlert,
  } = useStateProvider();
  const { user } = useAuthProvider();
  const { width } = useWindowDimensions();

  const [skillInTable, setSkillInTable] = useState({ idUserSkill: '' });
  const [openAddUpdate, setOpenAddUpdate] = useState({ open: false, action: '' });

  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetchUnassignedSkillsProposals(user?.idUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idUser]);

  const handleOpenDelete = () => {
    setOpenDelete(true);

  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSkillInTable({ idUserSkill: '' })
  };

  const handleOpenAddUpdate = (action) => {
    setOpenAddUpdate({ open: true, action: action });
  }
  const handleCloseAddUpdate = () => {
    setOpenAddUpdate({ open: false, action: '' });
    setSkillInTable({ idUserSkill: '' })

  }

  const handleAcceptProposal = async () => {
    try {
      const response = await approveUserSkill(skillInTable.idUserSkill);
      if (response.status === 200 || response.status === 201) {
        fetchUnassignedSkillsProposals(user?.idUser);
        setAlert({
          type: "success",
          message: "You approved the skill request",
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

  const handleRejectProposal = async () => {
    try {
      const response = await rejectUserSkill(skillInTable.idUserSkill);
      if (response.status === 200 || response.status === 201) {
        fetchUnassignedSkillsProposals(user?.idUser);
        setAlert({
          type: "success",
          message: "Skill request declined",
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

  function createData(id,  numeSkill, numeUser, level, experience) {
    return { id,  numeSkill, numeUser, level, experience };
  }

  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortDirection, setSortDirection] = useState('asc');
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    const sortedTeamRoles = unassignedSkillsProposals?.map(skill =>
      createData(skill.idUserSkill, skill.numeSkill, skill.numeUser, skill.level, skill.experience)
    ).sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.numeUser.localeCompare(b.numeUser);
      } else {
        return b.numeUser.localeCompare(a.numeUser);
      }
    });
    setRows(sortedTeamRoles || []);
  }, [unassignedSkillsProposals, sortDirection]);

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
      const firstPageIndex = (currentPageProposals - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;

      if (rows?.length < lastPageIndex && (lastPageIndex - rows?.length) > 0)
        return rows?.slice(firstPageIndex, lastPageIndex - (lastPageIndex - rows?.length));
      else
        return rows?.slice(firstPageIndex, lastPageIndex);
    }
    else
      return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageProposals, pageSize, rows, sortDirection]);

  return (
    <section className={styles.pageTeamRoles}>
      {unassignedSkillsProposals?.length === 0 ?
        <>
          <h5 className='mt-3'>No skill requests yet</h5>
          <TableNotFound />
        </>
        :
        <div>
          {width > 550 ?
            <TableContainer component={Paper} className={styles.table}>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                    <StyledTableCell align="center">
                      Employee
                      <Tooltip
                        title={"Order by department name"}
                        placement='top-end'
                        arrow
                        onClick={toggleSortDirection}
                        className={styles.iconWhite}
                      >
                        <IconButton className={styles.iconWhite}>
                        {sortDirection === 'asc' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center">Skill name</StyledTableCell>
                  <StyledTableCell align="center">Level</StyledTableCell>
                  <StyledTableCell align="center">Experience</StyledTableCell>
                  <StyledTableCell align="center">Aprove</StyledTableCell>
                  <StyledTableCell align="center">Decline</StyledTableCell>
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
                      {row?.numeUser}
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
                        title='Aprove skill request'
                        placement='top-start'
                        arrow
                        onClick={() => {
                          setSkillInTable({ idUserSkill: row?.id });
                          handleOpenAddUpdate('aprove');
                        }} >
                        <IconButton>
                          <CheckTwoToneIcon className={styles.tableButtons} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      <Tooltip
                        title='Delete team role'
                        placement='top-start'
                        arrow
                        onClick={() => {
                          setSkillInTable({ idUserSkill: row?.id });
                          handleOpenDelete();
                        }} >
                        <IconButton>
                          <CloseTwoToneIcon className={styles.tableButtons} />
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
        <ListSkillsProposals
          currentTableData={currentTableData}
          rows={rows}
          setSkillInTable={setSkillInTable}
          handleOpenAddUpdate={handleOpenAddUpdate}
          handleOpenDelete={handleOpenDelete}
          sortDirection={sortDirection}
          toggleSortDirection={toggleSortDirection}
        />
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
      title={'Skill request'}
      content={'Approve the skill request'}
      handleActionYes={() =>  handleAcceptProposal()}
      textActionYes={"Approve"}
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
      title={'Skill request'}
      content={"Decline the skill request"}
      handleActionYes={() => handleRejectProposal()}
      textActionYes={"Reject"}
      handleActionNo={handleCloseDelete}
      textActionNo={"Cancel"}
    />
  </StyledEngineProvider>
}
    </section >
  )
}

export default SkillProposals;


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

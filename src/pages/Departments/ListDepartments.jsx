import useStateProvider from "../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./Departments.module.scss"
import DepartmentCard from "./DepartmentCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon} from '../imports/muiiconsMaterial';

const ListDepartments = (props) => {
    const { pageSizeDepartments, currentPageDepartments, setCurrentPageDepartments } = useStateProvider();

    return (
        <>
            <div onClick={()=>props.toggleSortDirectionAndColumn('departmentName')} className={styles.sortButtonCard}>
                <FilterListIcon />
                <p>Sort by department name </p>
                {props.sortDirection === 'Ascending' && props.sortBy === 'departmentName'? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>

            {props.currentTableData?.length >= 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSizeDepartments}
                    currentPage={currentPageDepartments}
                    onPageChange={page => setCurrentPageDepartments(page)}
                />
            }


            {props.currentTableData?.map(
                (dept, index) =>
                (
                    <Fragment key={`${dept?.id}_${index}`}>
                        {
                            // <p key={`${dept?.id}_${index + Math.random()}`}>{dept.teamRoleName}</p>
                            <DepartmentCard
                                key={`${dept?.id}_${index + Math.random()}`}
                                data={dept}
                                setDepartment={props.setDepartment}
                                handleOpenAddUpdate={props.handleOpenAddUpdate}
                                handleOpenDelete={props.handleOpenDelete}
                                formValue={props.formValue}
                                setFormValue={props.setFormValue}
                            />
                        }
                    </Fragment>
                )
            )}
            {props.currentTableData?.length > 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSizeDepartments}
                    currentPage={currentPageDepartments}
                    onPageChange={page => setCurrentPageDepartments(page)}
                />
            }

        </>
    );
};

export default ListDepartments;
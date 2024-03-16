import useStateProvider from "../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./Users.module.scss"
import UserCard from "./UserCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon } from '../imports/muiiconsMaterial';

const ListEmployeesForMobile = (props) => {
    const { currentPageEmployees, pageSize, setCurrentPageEmployees } = useStateProvider();
console.log(props.currentTableData);
    return (
        <>
            <div onClick={()=>props.toggleSortDirection('firstName')} className={styles.sortButtonCard}>
                <FilterListIcon />
                <p>Sort by first name </p>
                {props.sortDirection === 'Ascending' && props.sortBy === 'firstName'? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>

            <div onClick={()=>props.toggleSortDirection('lastName')} className={styles.sortButtonCard}>
                <FilterListIcon />
                <p>Sort by last name </p>
                {props.sortDirection === 'Ascending' && props.sortBy === 'lastName' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>
            {props.currentTableData?.length >= 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSize}
                    currentPage={currentPageEmployees}
                    onPageChange={page => setCurrentPageEmployees(page)}
                />
            }


            {props.currentTableData?.map(
                (user, index) =>
                (
                    <Fragment key={`${user?.emailAdress}`}>
                        {
                            <UserCard
                                key={`${user?.id}@${user?.emailAdress}`}
                                data={user}
                                setEmployeeInTable={props.setEmployeeInTable}
                                handleOpenAddRole={props.handleOpenAddRole}
                                handleOpenDeleteRole={props.handleOpenDeleteRole}
                                renderUserRoles={props.renderUserRoles}
                            />
                        }
                    </Fragment>
                )
            )}

        </>
    );
};

export default ListEmployeesForMobile
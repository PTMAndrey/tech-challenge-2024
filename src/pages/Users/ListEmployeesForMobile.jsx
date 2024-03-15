import useStateProvider from "../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./Users.module.scss"
import RoleCard from "./UserCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon} from '../imports/muiiconsMaterial';

const ListRolesForMobile = (props) => {
    const { pageSize, currentPageTeamRoles, setCurrentPageTeamRoles } = useStateProvider();

    return (
        <>
            <div onClick={props.toggleSortDirection} className={styles.sortButtonCard}>
                <FilterListIcon/>
                <p>Sort the roles </p>
                {props.sortDirection === 'asc' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>
            {props.currentTableData?.length >= 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSize}
                    currentPage={currentPageTeamRoles}
                    onPageChange={page => setCurrentPageTeamRoles(page)}
                />
            }


            {props.currentTableData?.map(
                (role, index) =>
                (
                    <Fragment key={`${role?.id}_${index}`}>
                        {
                            // <p key={`${role?.id}_${index + Math.random()}`}>{role.teamRoleName}</p>
                            <RoleCard
                                key={`${role?.id}_${index + Math.random()}`}
                                data={role}
                                setTeamRole={props.setTeamRole}
                                handleOpenAddUpdate={props.handleOpenAddUpdate}
                                handleOpenDelete={props.handleOpenDelete}
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
                    pageSize={pageSize}
                    currentPage={currentPageTeamRoles}
                    onPageChange={page => setCurrentPageTeamRoles(page)}
                />
            }

        </>
    );
};

export default ListRolesForMobile
import useStateProvider from "../../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../../components/Pagination/Pagination";
import styles from "../Proposals.module.scss"
import SkillsProposalsCard from "./SkillsProposalsCard";

import { 
    TextRotationAngleupIcon, 
    TextRotationAngledownIcon, 
    FilterListIcon
} 
from '../../imports/muiiconsMaterial';

const ListSkillsProposals = (props) => {
    const { pageSize, currentPageProposals, setUnassignedSkillsProposals } = useStateProvider();

    return (
        <>
            <div onClick={props.toggleSortDirection} className={styles.sortButtonCard}>
                <FilterListIcon/>
                <p>Sort by employee name </p>
                {props.sortDirection === 'asc' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>
            {props.currentTableData?.length >= 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSize}
                    currentPage={currentPageProposals}
                    onPageChange={page => setUnassignedSkillsProposals(page)}
                />
            }


            {props.currentTableData?.map(
                (role, index) =>
                (
                    <Fragment key={`${role?.id}_${index}`}>
                        {
                            <SkillsProposalsCard
                                key={`${role?.id}_${index + Math.random()}`}
                                data={role}
                                setSkillInTable={props.setSkillInTable}
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
                    currentPage={currentPageProposals}
                    onPageChange={page => setUnassignedSkillsProposals(page)}
                />
            }

        </>
    );
};

export default ListSkillsProposals
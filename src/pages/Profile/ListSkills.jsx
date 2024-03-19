import useStateProvider from "../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../components/Pagination/Pagination";
import styles from './Profile.module.scss'
import SkillCard from "./SkillCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon } from '../imports/muiiconsMaterial';

const ListSkils = (props) => {
    return (
        <>
            {props.data?.length > 0 &&
                <>
                    <div onClick={() => props.toggleSortDirectionAndColumn('numeSkill')} className={styles.sortButtonCard}>
                        <FilterListIcon />
                        <p>Sort by department name </p>
                        {props.sortDirection === 'Ascending' && props.sortBy === 'numeSkill' ? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
                    </div>

                    {props.currentTableData?.length >= 1 &&
                        <Pagination
                            data={props.rows}
                            className={styles.paginationBar}
                            totalCount={props.rows?.length}
                            pageSize={props.pageSize}
                            currentPage={props.currentPage}
                            onPageChange={page => props.setCurrentPage(page)}
                        />
                    }
                </>
            }

            {props.currentTableData?.map(
                (dept, index) =>
                (
                    <Fragment key={`${dept?.id}_${index}`}>
                        {
                            // <p key={`${dept?.id}_${index + Math.random()}`}>{dept.teamRoleName}</p>
                            <SkillCard
                                key={`${dept?.id}_${index + Math.random()}`}
                                data={dept}
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
                    pageSize={props.pageSize}
                    currentPage={props.currentPage}
                    onPageChange={page => props.setCurrentPage(page)}
                />
            }

        </>
    );
};

export default ListSkils;
import useStateProvider from "../../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../../components/Pagination/Pagination";
import styles from '../Skills.module.scss'
import AllSkillsCard from "./AllSkillsCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon} from '../../imports/muiiconsMaterial';

const ListAllSkills = (props) => {
    const { pageSize, currentPageAllSkills, setCurrentPageAllSkills } = useStateProvider();

    return (
        <>
            <div onClick={()=>props.toggleSortDirectionAndColumn('skillName')} className={styles.sortButtonCard}>
                <FilterListIcon />
                <p>Sort by category name </p>
                {props.sortDirection === 'Ascending' && props.sortBy === 'skillName'? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>

            <div onClick={()=>props.toggleSortDirectionAndColumn('skillCategoryName')} className={styles.sortButtonCard}>
                <FilterListIcon />
                <p>Sort by category name </p>
                {props.sortDirection === 'Ascending' && props.sortBy === 'skillCategoryName'? <TextRotationAngledownIcon /> : <TextRotationAngleupIcon />}
            </div>

            {props.currentTableData?.length >= 1 &&
                <Pagination
                    data={props.rows}
                    className={styles.paginationBar}
                    totalCount={props.rows?.length}
                    pageSize={pageSize}
                    currentPage={currentPageAllSkills}
                    onPageChange={page => setCurrentPageAllSkills(page)}
                />
            }


            {props.currentTableData?.map(
                (skill, index) =>
                (
                    <Fragment key={`${skill?.id}_${index}`}>
                        {
                            <AllSkillsCard
                                key={`${skill?.id}_${index + Math.random()}`}
                                data={skill}
                                setSelectedSkillInTable={props.setSelectedSkillInTable}
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
                    pageSize={pageSize}
                    currentPage={currentPageAllSkills}
                    onPageChange={page => setCurrentPageAllSkills(page)}
                />
            }

        </>
    );
};

export default ListAllSkills;
import useStateProvider from "../../../hooks/useStateProvider";
import { Fragment, } from "react";
import Pagination from "../../../components/Pagination/Pagination";
import styles from '../Skills.module.scss'
import SkillCategoriesCard from "./SkillCategoriesCard";

import { TextRotationAngleupIcon, TextRotationAngledownIcon, FilterListIcon} from '../../imports/muiiconsMaterial';

const ListSkillCategories = (props) => {
    const { pageSize, currentPageSkillCategories, setCurrentPageSkillCategories } = useStateProvider();

    return (
        <>
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
                    currentPage={currentPageSkillCategories}
                    onPageChange={page => setCurrentPageSkillCategories(page)}
                />
            }


            {props.currentTableData?.map(
                (skill, index) =>
                (
                    <Fragment key={`${skill?.id}_${index}`}>
                        {
                            <SkillCategoriesCard
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
                    currentPage={currentPageSkillCategories}
                    onPageChange={page => setCurrentPageSkillCategories(page)}
                />
            }

        </>
    );
};

export default ListSkillCategories;
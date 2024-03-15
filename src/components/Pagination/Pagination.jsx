import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import styles from './Pagination.module.scss';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Pagination = props => {
    const {
        data,
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        totalCount,
        pageSize,
        siblingCount,
        currentPage
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange?.length < 2) {
        return null;
    }

    // const onNext = () => {
    //     onPageChange(currentPage + 1);
    // };

    // const onPrevious = () => {
    //     onPageChange(currentPage - 1);
    // };
    const onNext = () => {
        if (currentPage < Math.ceil(totalCount / pageSize)) {
          onPageChange(currentPage + 1);
        }
      };
      
      const onPrevious = () => {
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      };
      

    // let lastPage = 0;
    // if ((paginationRange || []).length > 0)
    //     lastPage = paginationRange[paginationRange.length - 1];
    
    let lastPage = Math.ceil(totalCount / pageSize);

    return (
        <ul
            className={classnames(`${styles.paginationContainer}`, { [className]: className })}
        >
            {/* Left navigation arrow */}
            <li
                className={classnames(` ${styles.paginationItem}`, {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <ArrowLeftIcon />
            </li>
            {paginationRange?.map((pageNumber, index) => {

                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                    return <li className={`${styles.paginationItem} ${styles.dots}`} key={`${index}_dots`}>&#8230;</li>;
                }

                // Render our Page Pills
                return (
                    <li
                        className={classnames(`${styles.paginationItem} ${pageNumber === currentPage ? styles.activePage : null}`, {
                            selected: pageNumber === currentPage
                        })}
                        onClick={() => onPageChange(pageNumber)}
                        key={`${data[index]?.id}_${currentPage}`.toString()}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            {/*  Right Navigation arrow */}
            <li
                className={classnames(`${styles.paginationItem}`, {
                    disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <ArrowRightIcon />
            </li>
        </ul>
    );
};

export default Pagination;
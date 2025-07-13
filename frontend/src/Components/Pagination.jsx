import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from './index';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  showPageInfo = true,
  showPageSizeOptions = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className = '',
  buttonClassName = '',
  activeButtonClassName = '',
  infoClassName = '',
  size = 'md',
  ...props
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const buttonSizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const renderPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // Less than maxVisiblePages total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than maxVisiblePages total pages so calculate start and end pages
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        // Current page near the start
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        // Current page near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline'}
          size={size}
          className={classNames(
            buttonClassName,
            i === currentPage && activeButtonClassName,
            'mx-0.5 min-w-[2.25rem]',
            {
              'opacity-50 cursor-not-allowed': i === currentPage,
            }
          )}
          onClick={() => i !== currentPage && onPageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis and first/last page buttons if needed
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift(
          <span key="start-ellipsis" className="px-2 py-2">
            ...
          </span>
        );
      }
      pages.unshift(
        <Button
          key={1}
          variant="outline"
          size={size}
          className={classNames('mx-0.5 min-w-[2.25rem]', buttonClassName)}
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          variant="outline"
          size={size}
          className={classNames('mx-0.5 min-w-[2.25rem]', buttonClassName)}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={classNames(
        'flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0',
        className
      )}
      {...props}
    >
      {showPageInfo && (
        <div className={classNames('text-sm text-gray-700', infoClassName)}>
          Showing{' '}
          <span className="font-medium">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      <div className="flex-1 flex justify-center sm:justify-end">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            size={size}
            className={classNames(
              'rounded-r-none px-2 sm:px-3',
              buttonClassName,
              {
                'opacity-50 cursor-not-allowed': isFirstPage,
              }
            )}
            onClick={() => !isFirstPage && onPageChange(1)}
            disabled={isFirstPage}
            aria-label="First page"
          >
            <span className="sr-only">First</span>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M7.707 5.293a1 1 0 010 1.414L4.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          
          <Button
            variant="outline"
            size={size}
            className={classNames(
              'rounded-none px-2 sm:px-3',
              buttonClassName,
              {
                'opacity-50 cursor-not-allowed': isFirstPage,
              }
            )}
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Button>

          {renderPageNumbers()}

          <Button
            variant="outline"
            size={size}
            className={classNames(
              'rounded-none px-2 sm:px-3',
              buttonClassName,
              {
                'opacity-50 cursor-not-allowed': isLastPage,
              }
            )}
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          
          <Button
            variant="outline"
            size={size}
            className={classNames(
              'rounded-l-none px-2 sm:px-3',
              buttonClassName,
              {
                'opacity-50 cursor-not-allowed': isLastPage,
              }
            )}
            onClick={() => !isLastPage && onPageChange(totalPages)}
            disabled={isLastPage}
            aria-label="Last page"
          >
            <span className="sr-only">Last</span>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M15.707 14.707a1 1 0 010-1.414L19.414 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </nav>
      </div>

      {showPageSizeOptions && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            className="block w-20 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-[#16638A] focus:border-[#16638A] sm:text-sm rounded-md"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageNumbers: PropTypes.bool,
  showPageInfo: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageSizeChange: PropTypes.func,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  activeButtonClassName: PropTypes.string,
  infoClassName: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Pagination;

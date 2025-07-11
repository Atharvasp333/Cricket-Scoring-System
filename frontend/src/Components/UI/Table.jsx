import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../../utils/helpers';

const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  className = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  emptyState = 'No data available',
  loading = false,
  loadingText = 'Loading...',
  ...props
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        {loadingText}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={cn('min-w-full divide-y divide-gray-200', className)}
        {...props}
      >
        <thead className={cn('bg-gray-50', headerClassName)}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.headerClassName
                )}
                style={column.headerStyle}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={row[keyField] || rowIndex}
              className={cn(
                onRowClick && 'hover:bg-gray-50 cursor-pointer',
                rowClassName
              )}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column) => (
                <td
                  key={`${row[keyField]}-${column.key}`}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    cellClassName,
                    column.cellClassName
                  )}
                  style={column.cellStyle}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      render: PropTypes.func,
      headerClassName: PropTypes.string,
      headerStyle: PropTypes.object,
      cellClassName: PropTypes.string,
      cellStyle: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyField: PropTypes.string,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  cellClassName: PropTypes.string,
  emptyState: PropTypes.node,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
};

export default Table;

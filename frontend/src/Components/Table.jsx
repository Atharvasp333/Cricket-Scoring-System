import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LoadingSpinner } from './index';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  theadClassName = '',
  tbodyClassName = '',
  trClassName = '',
  thClassName = '',
  tdClassName = '',
  striped = false,
  hoverable = true,
  compact = false,
  ...props
}) => {
  const tableClasses = classNames(
    'min-w-full divide-y divide-gray-200',
    className
  );

  const theadClasses = classNames(
    'bg-gray-50',
    theadClassName
  );

  const thClasses = (column) =>
    classNames(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      column.headerClassName,
      thClassName
    );

  const trClasses = (rowIndex, rowData) =>
    classNames(
      {
        'bg-white': !striped || rowIndex % 2 === 0,
        'bg-gray-50': striped && rowIndex % 2 !== 0,
        'hover:bg-gray-100': hoverable && onRowClick && !loading,
        'cursor-pointer': onRowClick && !loading,
      },
      trClassName,
      rowClassName && (typeof rowClassName === 'function' ? rowClassName(rowData, rowIndex) : rowClassName)
    );

  const tdClasses = (column, rowIndex, rowData) =>
    classNames(
      compact ? 'px-3 py-2' : 'px-6 py-4',
      'whitespace-nowrap text-sm text-gray-900',
      column.cellClassName,
      cellClassName,
      tdClassName
    );

  const renderCell = (row, column, rowIndex) => {
    if (column.render) {
      return column.render(row[column.dataIndex], row, rowIndex);
    }
    return row[column.dataIndex];
  };

  const handleRowClick = (row, index) => {
    if (onRowClick && !loading) {
      onRowClick(row, index);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className={tableClasses} {...props}>
          <thead className={theadClasses}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || column.dataIndex || index}
                  scope="col"
                  className={thClasses(column)}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${tbodyClassName}`}>
            {data.map((row, rowIndex) => (
              <tr
                key={row.key || rowIndex}
                className={trClasses(rowIndex, row)}
                onClick={() => handleRowClick(row, rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || column.dataIndex || colIndex}
                    className={tdClasses(column, rowIndex, row)}
                  >
                    {renderCell(row, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      headerClassName: PropTypes.string,
      cellClassName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  cellClassName: PropTypes.string,
  theadClassName: PropTypes.string,
  tbodyClassName: PropTypes.string,
  trClassName: PropTypes.string,
  thClassName: PropTypes.string,
  tdClassName: PropTypes.string,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  compact: PropTypes.bool,
};

export default Table;

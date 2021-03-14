import React, { useMemo } from 'react'
import { useTable, useSortBy, useColumnOrder } from 'react-table'
import { snakeCaseToTitleCase } from './utils'

const Table = ({ tableData, tableColumns }) => {

  const data = useMemo(
    () => tableData,
    [tableData]
  )

  const columns = useMemo(
    () => tableColumns,
    [tableColumns]
  )

  const initialState = {
    columnOrder: ['name', 'image', 'days_since_ath', 'percentage_of_market_share']
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    toggleHideColumn,
    state,
    prepareRow,
  } = useTable({ columns, data, initialState }, useSortBy, useColumnOrder)

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead className={state.hiddenColumns.length > 0 ? '' : 'hidden'}>
        <tr className="hidden-column-row">
          <th className="show-text"><em>Show:</em></th>
          {state.hiddenColumns.map((col) => {
            return (
              <th className="table-header-container" onClick={() => toggleHideColumn(col)} key={col}><input type="checkbox"></input>{snakeCaseToTitleCase(col)}</th>
            )
          })}
        </tr>
      </thead>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, colIdx) => {
              return (
                <th
                  className="table-header-container"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {/* Hide Column */}
                  <span className="hide-column" onClick={(e) => {
                    e.stopPropagation()
                    toggleHideColumn(column.id)
                  }}>
                    &times;
                  </span>
                  <span>
                    {column.render('Header')}
                  </span>
                  {/* https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/sorting?file=/src/App.js */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ' ↕️'}
                  </span>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}


export default Table
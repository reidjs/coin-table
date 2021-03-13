import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'

const Table = ({ tableData, tableColumns }) => {
  // TODO: memo on App.js component
  const data = useMemo(
    () => tableData,
    [tableData]
  )

  const columns = useMemo(
    () => tableColumns,
    [tableColumns]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    toggleHideColumn,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)
  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        <tr>
          <details>
            <summary>Hidden Columns</summary>
            <ul>
              <li>test</li>
            </ul>
          </details>
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
                    // console.log('column', column)
                    toggleHideColumn(column.id)
                    // column.show = false
                    console.log('column', column)

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
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
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
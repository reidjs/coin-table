export const snakeCaseToTitleCase = str => {
  let titleCase = ''
  let flag = false
  for(let i = 0; i < str.length; i++) {
    let char = str[i]
    if (i == 0 || flag) {
      titleCase += char.toUpperCase()
      flag = false
    } else if (char == '_') {
      titleCase += ' '
      flag = true
    } else {
      titleCase += char
    }
  }
  return titleCase
}

export const formatTableColumns = (firstDatum) => {
  const formattedColumns = []
  const keys = Object.keys(firstDatum)
  // https://stackoverflow.com/questions/57877482/react-table-render-component-inside-data
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const t = {}
    t.Header = snakeCaseToTitleCase(key)
    t.accessor = key
    t.defaultCanSort = true
    formattedColumns.push(t)
    if (key == 'image') {
      t.Cell = props => {
        return <img width="64" height="64" key={props.value} src={props.value}></img>
      }
    }
  }
  return formattedColumns
}


export const formatTableData = tableData => {
  const formattedRows = []
  let totalMarketShare = 0
  tableData.forEach(row => {
    return totalMarketShare += row.market_cap
  })

  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i]
    const t = Object.assign({}, row)

    // ROI is occasionally an object, breaks render.
    delete t.roi

    const athDate = new Date(t.ath_date).getTime()
    const currentDate = new Date().getTime()
    const daysSinceATH = Math.floor(((currentDate - athDate) / (1000 * 60 * 60 * 24)))
    t.days_since_ath = daysSinceATH

    const percentageOfMarketShare = parseFloat((t.market_cap / totalMarketShare) * 100).toFixed(4)
    t.percentage_of_market_share = `${percentageOfMarketShare}%`

    formattedRows.push(t)
  }

  return formattedRows
}

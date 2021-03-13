
import { useEffect, useState } from 'react'
import Table from './table';
import './App.css';

const snakeCaseToTitleCase = str => {
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

const formatTableColumns = (firstDatum) => {
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


const formatTableData = tableData => {
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

function App() {
  const [tableData, setTableData] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [intervalId, setIntervalId] = useState(undefined)

  const getTableData = async () => {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    const json = await res.json()
    const formattedRows = formatTableData(json)
    
    return formattedRows
  }

  // TODO: loading state
  useEffect(async () => {
    // TODO: change to 1000ms/request
    if (typeof intervalId == 'undefined') {
      const data = await getTableData()
      setTableData(data)
      setIntervalId(setInterval(getTableData, 5000))
      if (tableColumns.length == 0) {
        const firstRow = data[0]
        const formattedColumns = formatTableColumns(firstRow)
        setTableColumns(formattedColumns)
      }
    }
  }, [tableData, tableColumns, intervalId])
  return (
    <main>
      <h1>Coin Rankings</h1>
      <div className="table-container">
        <figure>
          <Table tableData={tableData} tableColumns={tableColumns} />
        </figure>
      </div>
      <footer>
        <ul>
          {/* TODO */}
        </ul>
      </footer>
    </main>
  );
}

export default App;

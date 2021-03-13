
import { useEffect, useState } from 'react'
import Table from './table';
import './App.css';

const snakeCaseToTitleCase = str => {
  // TODO (nice headers)
  return str
}

const formatTableColumns = firstDatum => {
  const formattedColumns = []
  const keys = Object.keys(firstDatum)
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const t = {}
    t.Header = snakeCaseToTitleCase(key)
    t.accessor = key
    formattedColumns.push(t)
  }
  return formattedColumns
}

function App() {
  const [tableData, setTableData] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [intervalId, setIntervalId] = useState(undefined)

  
  // TODO: loading state
  useEffect(async () => {
    const getTableData = async () => {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      const json = await res.json()
      // ROI is occasionally an object, breaks render.
      json.forEach(j => delete j.roi)
      setTableData(json)

      setTableColumns(formatTableColumns(json[0]))
    }

    // TODO: change to 1/second
    if (typeof intervalId == 'undefined') {
      getTableData()
      setIntervalId(setInterval(getTableData, 5000))
    }
  }, [tableData, tableColumns, intervalId])
  return (
    <div>
      <Table tableData={tableData} tableColumns={tableColumns} />
    </div>
  );
}

export default App;

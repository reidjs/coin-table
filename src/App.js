
import { useEffect, useState } from 'react'
import Table from './table';
import './App.css';
import { formatTableColumns, formatTableData } from './utils'

function App() {
  const [tableData, setTableData] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [intervalId, setIntervalId] = useState(undefined)
  const [isLoading, setLoading] = useState(true)

  const getTableData = async () => {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    const json = await res.json()
    const formattedRows = formatTableData(json)

    return formattedRows
  }

  // TODO: loading state
  useEffect(async () => {
    if (typeof intervalId == 'undefined') {
      const data = await getTableData()
      setTableData(data)
      setIntervalId(setInterval(
        async () => {
          const data = await getTableData()
          setTableData(data)
        }, 1000))
      if (tableColumns.length == 0) {
        const firstRow = data[0]
        const formattedColumns = formatTableColumns(firstRow)
        setTableColumns(formattedColumns)
      }
      setLoading(false)
    }
  }, [tableData, tableColumns, intervalId])
  return (
    <main>
      <h1>Coin Rankings</h1>
      <div className="table-container">
        <figure>
          <h3 className={isLoading ? 'loading-text' : 'hidden'}>Loading</h3>
          <Table tableData={tableData} tableColumns={tableColumns} />
        </figure>
      </div>
      <footer>
        <h2>Made by Reid Sherman, 2021</h2>
        <ul>
          <li><a href="https://github.com/reidjs">https://github.com/reidjs/coin-table</a></li>
          <li><a href="https://linkedin.com/in/reidsherman">linkedin.com/in/reidsherman</a></li>
        </ul>
      </footer>
    </main>
  );
}

export default App;

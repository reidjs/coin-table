
import logo from './logo.svg';
import { useEffect, useState } from 'react'
import Table from './table';
import './App.css';

function App() {
  const [tableData, setTableData] = useState([])
  useEffect(async () => {
    const getTableData = async () => {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      const json = await res.json()
      setTableData(json)
    }
    getTableData()
  }, [tableData])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Table tableRows={tableData}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

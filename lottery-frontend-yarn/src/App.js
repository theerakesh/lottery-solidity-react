import './App.css';
import web3 from './web3'
import lottery from './lottery'
import { useEffect, useState } from 'react'

function App() {

  const [manager, setManager] = useState(null)
  const [connected, setConnected] = useState(false)
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState(0)
  const [value, setValue] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    async function initWeb3() {

      if (connected) {
        const lottery_manager = await lottery.methods.manager().call()
        const lottery_players = await lottery.methods.getPlayers().call()
        const lottery_balance = await web3.eth.getBalance(lottery.options.address)
        const accounts = await web3.eth.getAccounts()
        console.log(lottery_manager, lottery_players, lottery_balance, accounts)
        setBalance(web3.utils.fromWei(lottery_balance, 'ether'))
        setManager(lottery_manager)
        setPlayers(lottery_players)
      }

    }

    initWeb3()
    return () => {
      cancelled = true
    }
  }, [connected])

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && window.ethereum.isConnected()) {
          setConnected(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    init()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    setMessage("Waiting for the transaction to process")
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })
    setMessage("You have been entered")
  }
  const onClick = async () => {
    const accounts = await web3.eth.getAccounts()
    setMessage("Waiting for the transaction to process..")
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage("A winner has been picked!")
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}. Currently there are  {players.length} players and are competing for {balance} ether</p>
      <hr />
      <form onSubmit={(e) => onSubmit(e)}>
        <h4>
          Wan't to try your luck?
        </h4>
        <div>
          <label>Amout of ether to enter</label>
          <input
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Read to pick winner?</h4>
      <button onClick={() => onClick()}>Pick Winner</button>
      <hr />
      <div>
        <h4>{message}</h4>
      </div>
    </div>
  )
}

export default App;

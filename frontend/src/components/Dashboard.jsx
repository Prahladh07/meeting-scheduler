import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Dashboard() {
  const [spaceName, setSpaceName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedName = localStorage.getItem('username')
    const storedUserId = localStorage.getItem('userId')
    if (!storedName || !storedUserId) {
      navigate('/') // not logged in
      return
    }
    setUsername(storedName)
  }, [])

  async function createSpace() {
    if (spaceName.trim() === '') {
      alert('enter a name for the space')
      return
    }
    const userId = localStorage.getItem('userId')

    try {
      const res = await api.post('/space/create', {
        name: spaceName,
        userId: userId
      })
      navigate(`/space/${res.data._id}`)
    } catch (err) {
      console.log(err)
      alert('something went wrong creating the space')
    }
  }

  async function joinSpace() {
    if (joinCode.trim() === '') {
      alert('enter a code first')
      return
    }
    const userId = localStorage.getItem('userId')

    try {
      const res = await api.post('/space/join', {
        code: joinCode.toUpperCase(), // backend stores codes uppercase
        userId: userId
      })
      navigate(`/space/${res.data._id}`)
    } catch (err) {
      console.log(err)
      alert('invalid code or something went wrong')
    }
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {username}</h2>

      <div className="card">
        <h3>Create a new meeting space</h3>
        <input
          type="text"
          placeholder="Space name"
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
        />
        <button onClick={createSpace}>Create Space</button>
      </div>

      <div className="card">
        <h3>Join a meeting space</h3>
        <input
          type="text"
          placeholder="Enter code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={joinSpace}>Join</button>
      </div>
    </div>
  )
}

export default Dashboard
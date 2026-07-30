import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Login() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    if (name.trim() === '') {
      alert('please enter your name')
      return
    }

    try {
      const res = await api.post('/login', { name })
      // backend gives us back the user with _id
      localStorage.setItem('userId', res.data._id)
      localStorage.setItem('username', res.data.name)
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
      alert('login failed, try again')
    }
  }

  return (
    <div className="login-page">
      <h1>Meeting Scheduler</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
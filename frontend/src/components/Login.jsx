import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    if (email.trim() === '' || password.trim() === '') {
      alert('please enter email and password')
      return
    }

    try {
      const res = await api.post('/login', { email, password })
      // backend gives us back { token, user }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.user.id)
      localStorage.setItem('username', res.data.user.name)
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.error || 'login failed, try again')
    }
  }

  return (
    <div className="login-page">
      <h1>Meeting Scheduler</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}

export default Login
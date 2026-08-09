import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSignup() {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      alert('please fill in all fields')
      return
    }

    try {
      await api.post('/signup', { name, email, password })
      alert('account created! please log in')
      navigate('/')
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.error || 'signup failed, try again')
    }
  }

  return (
    <div className="login-page">
      <h1>Create Account</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button onClick={handleSignup}>Sign Up</button>
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  )
}

export default Signup
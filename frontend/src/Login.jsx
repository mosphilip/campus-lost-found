import { useState } from 'react'
import './Login.css'
import { login } from './api'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await login(username, password)
      navigate('/')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="page">
      <div className="box">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>

          <div className="input-box">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </div>

          <div className="links">
            <a href="#">Forgot password</a>
            <Link to="/signup">Sign up</Link>
          </div>

          <button type="submit" className="btn">Login</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  )
}

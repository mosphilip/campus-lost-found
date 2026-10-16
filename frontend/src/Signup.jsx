import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { register, login } from './api'

export default function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await register(username, email, password)
      await login(username, password)
      navigate('/')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="page">
      <div className="box tall">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Create account</h2>

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
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password (6+ characters)</span>
          </div>

          <div className="links">
            <Link to="/login">Already have an account? Log in</Link>
          </div>

          <button type="submit" className="btn">Sign up</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  )
}

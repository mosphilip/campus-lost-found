import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createItem } from './api'
import './PostItem.css'

export default function PostItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'other',
    location: '',
    date: '',
  })
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState('')
  const loggedIn = Boolean(localStorage.getItem('access'))

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (photo) data.append('photo', photo)

    try {
      await createItem(data)
      navigate('/')
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (!loggedIn) {
    return (
      <div className="post-page">
        <div className="post-card">
          <h2>Log in to post an item</h2>
          <p>You need an account so people can trust who posted.</p>
          <Link to="/login" className="post-btn">Log in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="post-page">
      <form className="post-card" onSubmit={handleSubmit}>
        <h2>Post an item</h2>

        <label>
          What happened?
          <select name="type" value={form.type} onChange={update}>
            <option value="lost">I lost something</option>
            <option value="found">I found something</option>
          </select>
        </label>

        <label>
          Item name
          <input name="title" value={form.title} onChange={update} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={update}
          />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={update}>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="id_cards">ID Cards</option>
            <option value="clothing">Clothing</option>
            <option value="keys">Keys</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Where
          <input name="location" value={form.location} onChange={update} required />
        </label>

        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={update} required />
        </label>

        <label>
          Photo (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </label>

        {message && <p className="post-error">{message}</p>}

        <button type="submit" className="post-btn">Post item</button>
        <Link to="/" className="post-back">Back to items</Link>
      </form>
    </div>
  )
}

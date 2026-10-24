import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getItems, logout } from './api'
import './Home.css'

export default function Home() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('access')))

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  const visible = items.filter((item) => {
    const matchesType = filter === 'all' || item.type === filter
    const text = `${item.title} ${item.description} ${item.location}`.toLowerCase()
    return matchesType && text.includes(search.toLowerCase())
  })

  return (
    <div className="home">
      <header className="nav">
        <span className="logo">Campus Lost &amp; Found</span>
       <div className="nav-links">
  <Link to="/post" className="nav-btn">Post an item</Link>
  {loggedIn ? (
    <button
      className="nav-btn"
      onClick={() => {
        logout()
        setLoggedIn(false)
      }}
    >
      Log out
    </button>
  ) : (
    <Link to="/login" className="nav-btn">Log in</Link>
  )}
</div>
      </header>

      <section className="hero">
        <h1>Lost something on campus? Someone may have found it.</h1>
        <p>Search by item, description, or place.</p>

        <div className="search-wrap">
          <input
            className="search"
            type="text"
            placeholder="Try &quot;backpack&quot; or &quot;library&quot;"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chips">
          {['all', 'lost', 'found'].map((option) => (
            <button
              key={option}
              className={filter === option ? 'chip active' : 'chip'}
              onClick={() => setFilter(option)}
            >
              {option === 'all' ? 'All' : option === 'lost' ? 'Lost' : 'Found'}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        {visible.map((item) => (
          <Link to={`/items/${item.id}`} key={item.id} className="card-link">
<article className={`card ${item.type}`}>
            {item.photo ? (
              <img src={item.photo} alt={item.title} />
            ) : (
              <div className="no-photo">No photo</div>
            )}
            <div className="card-body">
              <span className="status">
                {item.type === 'lost' ? 'Lost' : 'Found'}
              </span>
              <h3>{item.title}</h3>
              <p className="where">{item.location}</p>
              <p className="when">
                {new Date(item.date).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </article>
          </Link>
        ))}
      </section>

      {!error && visible.length === 0 && (
        <p className="empty">
          No items match. Try a different word, or switch the filter to All.
        </p>
      )}
    </div>
  )
}

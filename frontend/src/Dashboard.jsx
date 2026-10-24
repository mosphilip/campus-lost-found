import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getReceivedClaims,
  getMyClaims,
  decideClaim,
  getMyItems,
  updateItemStatus,
  deleteItem,
} from './api'
import './Dashboard.css'

const STATUS_TEXT = {
  pending: 'Waiting for review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function Dashboard() {
  const [myItems, setMyItems] = useState([])
  const [received, setReceived] = useState([])
  const [mine, setMine] = useState([])
  const [error, setError] = useState('')
  const loggedIn = Boolean(localStorage.getItem('access'))

  async function load() {
    try {
      setMyItems(await getMyItems())
      setReceived(await getReceivedClaims())
      setMine(await getMyClaims())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (loggedIn) load()
  }, [loggedIn])

  async function decide(id, action) {
    setError('')
    try {
      await decideClaim(id, action)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function markReturned(id) {
    setError('')
    try {
      await updateItemStatus(id, 'returned')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    setError('')
    try {
      await deleteItem(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!loggedIn) {
    return (
      <div className="dash-page">
        <div className="dash-wrap">
          <h1>My dashboard</h1>
          <p className="dash-empty">
            <Link to="/login">Log in</Link> to see your items and claims.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div className="dash-wrap">
        <Link to="/" className="dash-back">Back to items</Link>
        <h1>My dashboard</h1>

        {error && <p className="dash-error">{error}</p>}

        <h2>My items</h2>
        {myItems.length === 0 && (
          <p className="dash-empty">
            You haven't posted anything yet. <Link to="/post">Post an item</Link>
          </p>
        )}
        {myItems.map((item) => (
          <div className="dash-card" key={item.id}>
            <p className="dash-title">
              <Link to={`/items/${item.id}`}>{item.title}</Link>
            </p>
            <p className="dash-who">
              {item.type === 'lost' ? 'Lost' : 'Found'} at {item.location}
            </p>
            <p className="dash-msg">Status: {item.status}</p>
            <div className="dash-actions">
              {item.status !== 'returned' && (
                <button
                  className="dash-approve"
                  onClick={() => markReturned(item.id)}
                >
                  Mark as returned
                </button>
              )}
              <button className="dash-reject" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        <h2>Claims on my items</h2>
        {received.length === 0 && (
          <p className="dash-empty">No one has claimed your items yet.</p>
        )}
        {received.map((claim) => (
          <div className="dash-card" key={claim.id}>
            <p className="dash-title">
              <Link to={`/items/${claim.item}`}>{claim.item_title}</Link>
            </p>
            <p className="dash-who">Claimed by {claim.claimant}</p>
            <p className="dash-msg">{claim.message}</p>

            {claim.status === 'pending' ? (
              <div className="dash-actions">
                <button
                  className="dash-approve"
                  onClick={() => decide(claim.id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="dash-reject"
                  onClick={() => decide(claim.id, 'reject')}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span className={`dash-status ${claim.status}`}>
                {STATUS_TEXT[claim.status]}
              </span>
            )}
          </div>
        ))}

        <h2>My claims</h2>
        {mine.length === 0 && (
          <p className="dash-empty">
            You haven't claimed anything yet. Open an item and click This is mine.
          </p>
        )}
        {mine.map((claim) => (
          <div className="dash-card" key={claim.id}>
            <p className="dash-title">
              <Link to={`/items/${claim.item}`}>{claim.item_title}</Link>
            </p>
            <p className="dash-msg">{claim.message}</p>
            <span className={`dash-status ${claim.status}`}>
              {STATUS_TEXT[claim.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

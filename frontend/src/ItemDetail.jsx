import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getItem, submitClaim } from './api'
import './ItemDetail.css'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [sent, setSent] = useState(false)
  const loggedIn = Boolean(localStorage.getItem('access'))

  useEffect(() => {
    getItem(id)
      .then(setItem)
      .catch((err) => setError(err.message))
  }, [id])

  async function handleClaim(e) {
    e.preventDefault()
    setFeedback('')
    try {
      await submitClaim(id, message)
      setSent(true)
    } catch (err) {
      setFeedback(err.message)
    }
  }

  if (error) {
    return (
      <div className="detail-page">
        <p className="detail-error">{error}</p>
        <Link to="/" className="detail-back">Back to items</Link>
      </div>
    )
  }

  if (!item) {
    return <div className="detail-page"><p>Loading...</p></div>
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back">Back to items</Link>

      <div className={`detail-card ${item.type}`}>
        {item.photo && <img src={item.photo} alt={item.title} />}

        <div className="detail-body">
          <span className="detail-status">
            {item.type === 'lost' ? 'Lost' : 'Found'}
            {item.status !== 'open' && ` (${item.status})`}
          </span>
          <h1>{item.title}</h1>
          <p className="detail-where">{item.location}</p>
          <p className="detail-meta">
            Posted by {item.posted_by} on{' '}
            {new Date(item.date).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          {item.description && <p className="detail-desc">{item.description}</p>}

          <div className="claim-box">
            {item.status !== 'open' ? (
              <p>This item is no longer open for claims.</p>
            ) : !loggedIn ? (
              <p>
                <Link to="/login">Log in</Link> to claim this item.
              </p>
            ) : sent ? (
              <p className="claim-success">
                Claim sent. The person who posted this item will review it.
              </p>
            ) : (
              <form onSubmit={handleClaim}>
                <label>
                  Describe something only the owner would know
                  <textarea
                    rows="3"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="For example: a broken zip, or what's inside"
                  />
                </label>
                {feedback && <p className="detail-error">{feedback}</p>}
                <button type="submit" className="claim-btn">This is mine</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

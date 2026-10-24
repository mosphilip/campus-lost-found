const API_URL = 'http://127.0.0.1:8000/api'

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Wrong username or password')
  }

  const data = await response.json()
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export async function getItems() {
  const response = await fetch(`${API_URL}/items/`)

  if (!response.ok) {
    throw new Error('Could not load items')
  }

  const data = await response.json()
  return data
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) return false

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    logout()
    return false
  }

  const data = await response.json()
  localStorage.setItem('access', data.access)
  return true
}

// Sends a request with the login token.
// If the token has expired, it gets a new one and tries once more.
async function authFetch(url, options = {}) {
  const send = () =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })

  let response = await send()
  if (response.status === 401 && (await refreshAccessToken())) {
    response = await send()
  }
  return response
}

export async function createItem(formData) {
  const response = await authFetch(`${API_URL}/items/`, {
    method: 'POST',
    body: formData,
  })

  if (response.status === 401) {
    throw new Error('Your login expired. Please log in again.')
  }
  if (!response.ok) {
    throw new Error('Could not post the item. Check the fields and try again.')
  }

  return response.json()
}

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })

  if (!response.ok) {
    const data = await response.json()
    const first = Object.values(data)[0]
    throw new Error(
      Array.isArray(first) ? first[0] : 'Could not create the account'
    )
  }

  return response.json()
}

export async function getItem(id) {
  const response = await fetch(`${API_URL}/items/${id}/`)

  if (!response.ok) {
    throw new Error('Could not find this item')
  }

  return response.json()
}

export async function submitClaim(id, message) {
  const response = await authFetch(`${API_URL}/items/${id}/claim/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.detail || data.message?.[0] || 'Could not send your claim. Try again.'
    )
  }

  return data
}

export async function getReceivedClaims() {
  const response = await authFetch(`${API_URL}/claims/received/`)
  if (!response.ok) throw new Error('Could not load claims on your items')
  return response.json()
}

export async function getMyClaims() {
  const response = await authFetch(`${API_URL}/claims/mine/`)
  if (!response.ok) throw new Error('Could not load your claims')
  return response.json()
}

export async function decideClaim(id, action) {
  const response = await authFetch(`${API_URL}/claims/${id}/${action}/`, {
    method: 'POST',
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || 'Could not update this claim')
  }
  return data
}

export async function getMyItems() {
  const response = await authFetch(`${API_URL}/my-items/`)
  if (!response.ok) throw new Error('Could not load your items')
  return response.json()
}

export async function updateItemStatus(id, status) {
  const response = await authFetch(`${API_URL}/items/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Could not update this item')
  return response.json()
}

export async function deleteItem(id) {
  const response = await authFetch(`${API_URL}/items/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Could not delete this item')
}
